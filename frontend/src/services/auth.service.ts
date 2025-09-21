// T030: Firebase Authentication service
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import type { User, CreateUserRequest, LoginRequest, AuthResponse, AuthError } from '../types/user';

export class AuthService {
  /**
   * Register a new user with email and password
   */
  async register(userData: CreateUserRequest): Promise<AuthResponse> {
    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      const firebaseUser = userCredential.user;

      // Update profile with display name if provided
      if (userData.displayName) {
        await updateProfile(firebaseUser, {
          displayName: userData.displayName,
        });
      }

      // Create user document in Firestore
      const userDoc = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: userData.displayName || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true,
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userDoc);

      // Get ID token
      const token = await firebaseUser.getIdToken();

      return {
        user: {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: userData.displayName,
          createdAt: new Date().toISOString(),
        },
        token,
      };
    } catch (error: unknown) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign in user with email and password
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      const firebaseUser = userCredential.user;
      const token = await firebaseUser.getIdToken();

      // Get user data from Firestore
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);

      let userData = null;
      if (userDoc.exists()) {
        userData = userDoc.data();
      }

      return {
        user: {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || userData?.displayName,
          createdAt: userData?.createdAt?.toDate().toISOString() || new Date().toISOString(),
        },
        token,
      };
    } catch (error: unknown) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign out current user
   */
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: unknown) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  /**
   * Get current user's ID token
   */
  async getCurrentUserToken(): Promise<string | null> {
    const user = this.getCurrentUser();
    if (!user) return null;
    return await user.getIdToken();
  }

  /**
   * Subscribe to authentication state changes
   */
  onAuthStateChange(callback: (user: FirebaseUser | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Get user profile from Firestore
   */
  async getUserProfile(userId: string): Promise<User | null> {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        return null;
      }

      const data = userDoc.data();
      return {
        id: userDoc.id,
        email: data.email,
        displayName: data.displayName,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        isActive: data.isActive,
      };
    } catch (error: unknown) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, updates: Partial<User>): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', userId);
      await setDoc(
        userDocRef,
        {
          ...updates,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // Update Firebase Auth profile if display name changed
      const currentUser = this.getCurrentUser();
      if (currentUser && updates.displayName !== undefined) {
        await updateProfile(currentUser, {
          displayName: updates.displayName,
        });
      }
    } catch (error: unknown) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  /**
   * Refresh user token
   */
  async refreshToken(): Promise<string | null> {
    const user = this.getCurrentUser();
    if (!user) return null;
    return await user.getIdToken(true); // Force refresh
  }

  /**
   * Handle Firebase authentication errors
   */
  private handleAuthError(error: unknown): AuthError {
    console.error('Auth error:', error);

    const errorCode = (error as { code?: string }).code;

    switch (errorCode) {
      case 'auth/invalid-email':
        return {
          code: 'INVALID_EMAIL',
          message: 'Please enter a valid email address.',
        };
      case 'auth/email-already-in-use':
        return {
          code: 'EMAIL_EXISTS',
          message: 'An account with this email already exists.',
        };
      case 'auth/weak-password':
        return {
          code: 'WEAK_PASSWORD',
          message: 'Password should be at least 6 characters long.',
        };
      case 'auth/user-not-found':
        return {
          code: 'USER_NOT_FOUND',
          message: 'No account found with this email address.',
        };
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password.',
        };
      default:
        return {
          code: 'INVALID_EMAIL',
          message: (error as Error).message || 'An unexpected error occurred.',
        };
    }
  }
}

// Export singleton instance
export const authService = new AuthService();