// T048: Error boundary implementation
import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Container, Title, Text, Button, Stack, Alert } from '@mantine/core';
import { IconAlertTriangle, IconRefresh } from '@tabler/icons-react';
import { errorService } from '../services/error.service';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Generate a unique error ID for tracking
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Log error with our error service
    errorService.handleError(error, 'ErrorBoundary');

    this.setState({
      error,
      errorInfo,
      errorId,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <Container size="sm" py="xl">
          <Stack gap="xl" align="center">
            <Alert
              icon={<IconAlertTriangle size={20} />}
              title="Something went wrong"
              color="red"
              variant="light"
              style={{ width: '100%' }}
            >
              <Text size="sm" c="dimmed" mb="md">
                An unexpected error occurred while rendering this page.
                {this.state.errorId && (
                  <>
                    <br />
                    Error ID: <Text span ff="monospace">{this.state.errorId}</Text>
                  </>
                )}
              </Text>
            </Alert>

            <div style={{ textAlign: 'center' }}>
              <Title order={2} size="h3" mb="xs">
                Oops! Something went wrong
              </Title>
              <Text c="dimmed" mb="xl">
                We're sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists.
              </Text>
            </div>

            <Stack gap="md">
              <Button
                leftSection={<IconRefresh size={16} />}
                onClick={this.handleRetry}
                variant="filled"
              >
                Try Again
              </Button>
              <Button
                onClick={this.handleReload}
                variant="outline"
              >
                Reload Page
              </Button>
            </Stack>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Alert
                color="gray"
                variant="light"
                style={{ width: '100%', marginTop: '2rem' }}
                title="Development Error Details"
              >
                <Text size="sm" ff="monospace" style={{ whiteSpace: 'pre-wrap' }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack && (
                    <>
                      <br /><br />
                      Component Stack:
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </Text>
              </Alert>
            )}
          </Stack>
        </Container>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

// Hook for manual error reporting
export function useErrorHandler() {
  const reportError = (error: Error) => {
    errorService.handleError(error, 'useErrorHandler');
  };

  return { reportError };
}