/**
 * Firebase Authentication Providers Configuration
 * Supports Google Sign-In, Email/Password, Magic Link, Password Reset, Email Verification
 */

import {
  Auth,
  GoogleAuthProvider,
  EmailAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  deleteUser,
  User as FirebaseUser,
  UserCredential,
  ActionCodeSettings,
  AuthError,
} from 'firebase/auth';
import { auth } from './firebase';
import { logger } from '../utils/logger';

// Auth provider configurations
export const GOOGLE_PROVIDER = new GoogleAuthProvider();
GOOGLE_PROVIDER.addScope('email');
GOOGLE_PROVIDER.addScope('profile');
GOOGLE_PROVIDER.setCustomParameters({
  prompt: 'select_account',
});

export const EMAIL_PROVIDER = new EmailAuthProvider();

/**
 * Magic Link Configuration
 */
export const getMagicLinkSettings = (email: string): ActionCodeSettings => ({
  url: `${window.location.origin}/auth/verify-email`,
  handleCodeInApp: true,
  iOS: {
    bundleId: 'com.b2bsales.app',
  },
  android: {
    packageName: 'com.b2bsales.app',
    installApp: true,
    minimumVersion: '12',
  },
  dynamicLinkDomain: undefined, // Set if using Firebase Dynamic Links
});

/**
 * Authentication Methods
 */

// Google Sign-In
export async function signInWithGoogle(): Promise<{
  user: FirebaseUser;
  isNewUser: boolean;
  error?: string;
}> {
  try {
    logger.info('Attempting Google sign-in');

    const result = await signInWithPopup(auth, GOOGLE_PROVIDER);
    const credential = GoogleAuthProvider.credentialFromResult(result);

    if (!credential) {
      throw new Error('Failed to get Google credential');
    }

    // Check if this is a new user
    const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;

    logger.info('Google sign-in successful', {
      uid: result.user.uid,
      email: result.user.email,
      isNewUser,
    });

    return {
      user: result.user,
      isNewUser,
    };
  } catch (error) {
    const authError = error as AuthError;
    logger.error('Google sign-in failed', {
      code: authError.code,
      message: authError.message,
    });

    let errorMessage = 'Google sign-in failed';

    switch (authError.code) {
      case 'auth/popup-closed-by-user':
        errorMessage = 'Sign-in was cancelled';
        break;
      case 'auth/popup-blocked':
        errorMessage = 'Popup was blocked by browser. Please allow popups and try again';
        break;
      case 'auth/cancelled-popup-request':
        errorMessage = 'Sign-in was cancelled';
        break;
      case 'auth/account-exists-with-different-credential':
        errorMessage = 'An account already exists with this email using a different sign-in method';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your connection and try again';
        break;
      default:
        errorMessage = authError.message || 'Google sign-in failed';
    }

    return {
      user: null as any,
      isNewUser: false,
      error: errorMessage,
    };
  }
}

// Email & Password Sign-In
export async function signInWithEmailPassword(
  email: string,
  password: string,
): Promise<{
  user: FirebaseUser;
  error?: string;
}> {
  try {
    logger.info('Attempting email/password sign-in', { email });

    const result = await signInWithEmailAndPassword(auth, email, password);

    if (!result.user.emailVerified) {
      logger.warn('User email not verified', { uid: result.user.uid });
      // Note: You may want to handle unverified emails differently
    }

    logger.info('Email/password sign-in successful', {
      uid: result.user.uid,
      emailVerified: result.user.emailVerified,
    });

    return { user: result.user };
  } catch (error) {
    const authError = error as AuthError;
    logger.error('Email/password sign-in failed', {
      email,
      code: authError.code,
      message: authError.message,
    });

    let errorMessage = 'Sign-in failed';

    switch (authError.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email address';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed attempts. Please try again later';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your connection and try again';
        break;
      default:
        errorMessage = authError.message || 'Sign-in failed';
    }

    return {
      user: null as any,
      error: errorMessage,
    };
  }
}

// Email & Password Registration
export async function registerWithEmailPassword(
  email: string,
  password: string,
  displayName: string,
): Promise<{
  user: FirebaseUser;
  error?: string;
}> {
  try {
    logger.info('Attempting email/password registration', { email, displayName });

    const result = await createUserWithEmailAndPassword(auth, email, password);

    // Update display name
    await updateProfile(result.user, {
      displayName: displayName,
    });

    // Send email verification
    await sendEmailVerification(result.user, getMagicLinkSettings(email));

    logger.info('Email/password registration successful', {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
    });

    return { user: result.user };
  } catch (error) {
    const authError = error as AuthError;
    logger.error('Email/password registration failed', {
      email,
      code: authError.code,
      message: authError.message,
    });

    let errorMessage = 'Registration failed';

    switch (authError.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'An account already exists with this email address';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password is too weak. Please use at least 6 characters';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Email/password registration is not enabled';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your connection and try again';
        break;
      default:
        errorMessage = authError.message || 'Registration failed';
    }

    return {
      user: null as any,
      error: errorMessage,
    };
  }
}

// Magic Link Authentication
export async function sendMagicLink(email: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    logger.info('Sending magic link', { email });

    const actionCodeSettings = getMagicLinkSettings(email);
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);

    // Store email in localStorage for verification
    window.localStorage.setItem('emailForSignIn', email);

    logger.info('Magic link sent successfully', { email });

    return { success: true };
  } catch (error) {
    const authError = error as AuthError;
    logger.error('Magic link sending failed', {
      email,
      code: authError.code,
      message: authError.message,
    });

    let errorMessage = 'Failed to send magic link';

    switch (authError.code) {
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email address';
        break;
      case 'auth/quota-exceeded':
        errorMessage = 'Too many requests. Please try again later';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your connection and try again';
        break;
      default:
        errorMessage = authError.message || 'Failed to send magic link';
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

// Verify Magic Link
export async function verifyMagicLink(emailLink: string): Promise<{
  user: FirebaseUser;
  isNewUser: boolean;
  error?: string;
}> {
  try {
    if (!isSignInWithEmailLink(auth, emailLink)) {
      throw new Error('Invalid magic link');
    }

    let email = window.localStorage.getItem('emailForSignIn');

    if (!email) {
      // If email is not in localStorage, prompt user for it
      email = window.prompt('Please provide your email for confirmation');
      if (!email) {
        throw new Error('Email is required');
      }
    }

    logger.info('Verifying magic link', { email });

    const result = await signInWithEmailLink(auth, email, emailLink);

    // Clear email from storage
    window.localStorage.removeItem('emailForSignIn');

    // Check if this is a new user
    const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;

    logger.info('Magic link verification successful', {
      uid: result.user.uid,
      email: result.user.email,
      isNewUser,
    });

    return {
      user: result.user,
      isNewUser,
    };
  } catch (error) {
    const authError = error as AuthError;
    logger.error('Magic link verification failed', {
      code: authError.code,
      message: authError.message,
    });

    let errorMessage = 'Magic link verification failed';

    switch (authError.code) {
      case 'auth/invalid-action-code':
        errorMessage = 'Invalid or expired magic link';
        break;
      case 'auth/expired-action-code':
        errorMessage = 'Magic link has expired';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      default:
        errorMessage = authError.message || 'Magic link verification failed';
    }

    return {
      user: null as any,
      isNewUser: false,
      error: errorMessage,
    };
  }
}

// Password Reset
export async function sendPasswordReset(email: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    logger.info('Sending password reset email', { email });

    const actionCodeSettings: ActionCodeSettings = {
      url: `${window.location.origin}/auth/login`,
      handleCodeInApp: false,
    };

    await sendPasswordResetEmail(auth, email, actionCodeSettings);

    logger.info('Password reset email sent successfully', { email });

    return { success: true };
  } catch (error) {
    const authError = error as AuthError;
    logger.error('Password reset sending failed', {
      email,
      code: authError.code,
      message: authError.message,
    });

    let errorMessage = 'Failed to send password reset email';

    switch (authError.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email address';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/quota-exceeded':
        errorMessage = 'Too many requests. Please try again later';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your connection and try again';
        break;
      default:
        errorMessage = authError.message || 'Failed to send password reset email';
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

// Resend Email Verification
export async function resendEmailVerification(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No authenticated user');
    }

    if (user.emailVerified) {
      return {
        success: false,
        error: 'Email is already verified',
      };
    }

    logger.info('Resending email verification', { uid: user.uid });

    await sendEmailVerification(user, getMagicLinkSettings(user.email || ''));

    logger.info('Email verification sent successfully', { uid: user.uid });

    return { success: true };
  } catch (error) {
    const authError = error as AuthError;
    logger.error('Email verification resend failed', {
      code: authError.code,
      message: authError.message,
    });

    let errorMessage = 'Failed to resend verification email';

    switch (authError.code) {
      case 'auth/quota-exceeded':
        errorMessage = 'Too many requests. Please try again later';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your connection and try again';
        break;
      default:
        errorMessage = authError.message || 'Failed to resend verification email';
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

// Update Password
export async function updateUserPassword(
  currentPassword: string,
  newPassword: string,
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error('No authenticated user');
    }

    logger.info('Updating user password', { uid: user.uid });

    // Re-authenticate user first
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Update password
    await updatePassword(user, newPassword);

    logger.info('Password updated successfully', { uid: user.uid });

    return { success: true };
  } catch (error) {
    const authError = error as AuthError;
    logger.error('Password update failed', {
      code: authError.code,
      message: authError.message,
    });

    let errorMessage = 'Failed to update password';

    switch (authError.code) {
      case 'auth/wrong-password':
        errorMessage = 'Current password is incorrect';
        break;
      case 'auth/weak-password':
        errorMessage = 'New password is too weak. Please use at least 6 characters';
        break;
      case 'auth/requires-recent-login':
        errorMessage = 'Please sign out and sign in again to update your password';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your connection and try again';
        break;
      default:
        errorMessage = authError.message || 'Failed to update password';
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

// Delete Account
export async function deleteUserAccount(password: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error('No authenticated user');
    }

    logger.info('Deleting user account', { uid: user.uid });

    // Re-authenticate user first
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);

    // Delete user
    await deleteUser(user);

    logger.info('User account deleted successfully');

    return { success: true };
  } catch (error) {
    const authError = error as AuthError;
    logger.error('Account deletion failed', {
      code: authError.code,
      message: authError.message,
    });

    let errorMessage = 'Failed to delete account';

    switch (authError.code) {
      case 'auth/wrong-password':
        errorMessage = 'Password is incorrect';
        break;
      case 'auth/requires-recent-login':
        errorMessage = 'Please sign out and sign in again to delete your account';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your connection and try again';
        break;
      default:
        errorMessage = authError.message || 'Failed to delete account';
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Utility Functions
 */

// Check if email link is valid
export function isValidMagicLink(emailLink: string): boolean {
  return isSignInWithEmailLink(auth, emailLink);
}

// Get pending email from localStorage
export function getPendingEmail(): string | null {
  return window.localStorage.getItem('emailForSignIn');
}

// Clear pending email
export function clearPendingEmail(): void {
  window.localStorage.removeItem('emailForSignIn');
}

/**
 * Auth State Helpers
 */
export function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser;
}

export function isEmailVerified(): boolean {
  const user = auth.currentUser;
  return user?.emailVerified || false;
}

export function getProviderData(): Array<{
  providerId: string;
  uid: string;
  email: string | null;
}> {
  const user = auth.currentUser;
  return user?.providerData || [];
}

export function hasPasswordProvider(): boolean {
  const providers = getProviderData();
  return providers.some((provider) => provider.providerId === 'password');
}

export function hasGoogleProvider(): boolean {
  const providers = getProviderData();
  return providers.some((provider) => provider.providerId === 'google.com');
}

// Session persistence
export function getAuthPersistence(): string {
  // Firebase automatically handles persistence, but we can check the type
  return 'local'; // Default persistence in Firebase v9+
}
