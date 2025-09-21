// T033: Error handling service
import { FirebaseError } from 'firebase/app';

export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
  userId?: string;
}

export interface ErrorNotification {
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    handler: () => void;
  };
}

export class ErrorService {
  private errorLog: AppError[] = [];
  private maxLogSize = 100;
  private notificationHandlers: ((notification: ErrorNotification) => void)[] = [];

  /**
   * Handle and log application errors
   */
  handleError(error: unknown, context?: string): AppError {
    const appError = this.transformError(error, context);
    this.logError(appError);
    this.notifyError(appError);
    return appError;
  }

  /**
   * Transform various error types into standardized AppError
   */
  private transformError(error: unknown, context?: string): AppError {
    const timestamp = new Date();
    const userId = this.getCurrentUserId();

    // Firebase errors
    if (error instanceof FirebaseError) {
      return {
        code: error.code,
        message: this.getFirebaseErrorMessage(error),
        details: {
          originalMessage: error.message,
          context,
          customData: error.customData
        },
        timestamp,
        userId,
      };
    }

    // Standard Error objects
    if (error instanceof Error) {
      return {
        code: 'APPLICATION_ERROR',
        message: error.message,
        details: {
          stack: error.stack,
          context,
          name: error.name
        },
        timestamp,
        userId,
      };
    }

    // String errors
    if (typeof error === 'string') {
      return {
        code: 'STRING_ERROR',
        message: error,
        details: { context },
        timestamp,
        userId,
      };
    }

    // Network errors
    if (this.isNetworkError(error)) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Network connection failed. Please check your internet connection.',
        details: { error, context },
        timestamp,
        userId,
      };
    }

    // Unknown errors
    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred.',
      details: { error, context },
      timestamp,
      userId,
    };
  }

  /**
   * Get user-friendly messages for Firebase errors
   */
  private getFirebaseErrorMessage(error: FirebaseError): string {
    const errorMessages: Record<string, string> = {
      // Auth errors
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/user-not-found': 'No account found with this email address.',
      'auth/wrong-password': 'Invalid email or password.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password should be at least 6 characters long.',
      'auth/invalid-credential': 'Invalid email or password.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection.',

      // Firestore errors
      'firestore/permission-denied': 'You do not have permission to perform this action.',
      'firestore/not-found': 'The requested resource was not found.',
      'firestore/already-exists': 'This resource already exists.',
      'firestore/resource-exhausted': 'Server is temporarily overloaded. Please try again.',
      'firestore/failed-precondition': 'Operation failed due to current state.',
      'firestore/aborted': 'Operation was aborted. Please try again.',
      'firestore/out-of-range': 'Invalid input parameters.',
      'firestore/unimplemented': 'This feature is not yet available.',
      'firestore/internal': 'Internal server error. Please try again.',
      'firestore/unavailable': 'Service is temporarily unavailable.',
      'firestore/deadline-exceeded': 'Request timeout. Please try again.',

      // Storage errors
      'storage/object-not-found': 'File not found.',
      'storage/bucket-not-found': 'Storage bucket not found.',
      'storage/project-not-found': 'Project not found.',
      'storage/quota-exceeded': 'Storage quota exceeded.',
      'storage/unauthenticated': 'Please sign in to access files.',
      'storage/unauthorized': 'You do not have permission to access this file.',
      'storage/retry-limit-exceeded': 'Upload failed. Please try again.',
      'storage/invalid-checksum': 'File upload failed. Please try again.',
      'storage/canceled': 'Upload was canceled.',
      'storage/invalid-event-name': 'Invalid file operation.',
      'storage/invalid-url': 'Invalid file URL.',
    };

    return errorMessages[error.code] || error.message || 'An unexpected error occurred.';
  }

  /**
   * Check if error is network-related
   */
  private isNetworkError(error: any): boolean {
    if (!error) return false;

    const networkErrorCodes = [
      'network-request-failed',
      'timeout',
      'NETWORK_ERROR',
      'ERR_NETWORK',
      'ERR_INTERNET_DISCONNECTED'
    ];

    return (
      networkErrorCodes.some(code =>
        error.code?.includes(code) ||
        error.message?.includes(code) ||
        error.name?.includes(code)
      ) ||
      error.name === 'NetworkError' ||
      error.type === 'network'
    );
  }

  /**
   * Log error for debugging and analytics
   */
  private logError(error: AppError): void {
    // Add to in-memory log
    this.errorLog.unshift(error);
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize);
    }

    // Console log for development
    if (process.env.NODE_ENV === 'development') {
      console.error('Application Error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        timestamp: error.timestamp,
        userId: error.userId,
      });
    }

    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoring(error);
    }
  }

  /**
   * Send error to monitoring service (placeholder)
   */
  private sendToMonitoring(error: AppError): void {
    // Implementation would depend on monitoring service (Sentry, LogRocket, etc.)
    // For now, we'll use Firebase Analytics for error tracking
    try {
      // Analytics would be implemented here
      console.log('Sending error to monitoring:', error.code);
    } catch (monitoringError) {
      console.warn('Failed to send error to monitoring:', monitoringError);
    }
  }

  /**
   * Show error notification to user
   */
  private notifyError(error: AppError): void {
    const notification: ErrorNotification = {
      type: 'error',
      title: 'Error',
      message: error.message,
      duration: 5000,
    };

    // Add retry action for certain errors
    if (this.isRetryableError(error)) {
      notification.action = {
        label: 'Retry',
        handler: () => {
          // Retry logic would be implemented by the calling component
          console.log('Retry requested for error:', error.code);
        },
      };
    }

    this.showNotification(notification);
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: AppError): boolean {
    const retryableCodes = [
      'NETWORK_ERROR',
      'firestore/unavailable',
      'firestore/deadline-exceeded',
      'firestore/aborted',
      'auth/network-request-failed',
    ];

    return retryableCodes.includes(error.code);
  }

  /**
   * Show success notification
   */
  showSuccess(message: string, title = 'Success'): void {
    this.showNotification({
      type: 'success',
      title,
      message,
      duration: 3000,
    });
  }

  /**
   * Show info notification
   */
  showInfo(message: string, title = 'Info'): void {
    this.showNotification({
      type: 'info',
      title,
      message,
      duration: 4000,
    });
  }

  /**
   * Show warning notification
   */
  showWarning(message: string, title = 'Warning'): void {
    this.showNotification({
      type: 'warning',
      title,
      message,
      duration: 4000,
    });
  }

  /**
   * Show notification using registered handlers
   */
  private showNotification(notification: ErrorNotification): void {
    this.notificationHandlers.forEach(handler => {
      try {
        handler(notification);
      } catch (error) {
        console.error('Error in notification handler:', error);
      }
    });
  }

  /**
   * Register notification handler
   */
  onNotification(handler: (notification: ErrorNotification) => void): () => void {
    this.notificationHandlers.push(handler);

    // Return unsubscribe function
    return () => {
      const index = this.notificationHandlers.indexOf(handler);
      if (index > -1) {
        this.notificationHandlers.splice(index, 1);
      }
    };
  }

  /**
   * Get error log for debugging
   */
  getErrorLog(): AppError[] {
    return [...this.errorLog];
  }

  /**
   * Clear error log
   */
  clearErrorLog(): void {
    this.errorLog = [];
  }

  /**
   * Get current user ID for error context
   */
  private getCurrentUserId(): string | undefined {
    try {
      // This would integrate with auth service
      const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
      return user?.id;
    } catch {
      return undefined;
    }
  }

  /**
   * Create error boundary handler for React components
   */
  createErrorBoundaryHandler() {
    return (error: Error, errorInfo: { componentStack: string }) => {
      this.handleError(error, `React Error Boundary: ${errorInfo.componentStack}`);
    };
  }

  /**
   * Handle unhandled promise rejections
   */
  handleUnhandledRejection(event: PromiseRejectionEvent): void {
    this.handleError(event.reason, 'Unhandled Promise Rejection');
    event.preventDefault(); // Prevent default browser error handling
  }

  /**
   * Handle uncaught JavaScript errors
   */
  handleUncaughtError(event: ErrorEvent): void {
    this.handleError(event.error || event.message, 'Uncaught JavaScript Error');
  }

  /**
   * Initialize global error handling
   */
  initializeGlobalHandlers(): void {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleUnhandledRejection(event);
    });

    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      this.handleUncaughtError(event);
    });
  }
}

// Export singleton instance
export const errorService = new ErrorService();

// Initialize global error handling
if (typeof window !== 'undefined') {
  errorService.initializeGlobalHandlers();
}