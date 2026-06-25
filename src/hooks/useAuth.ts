/**
 * Enhanced Authentication Hook
 * Provides comprehensive auth state management and operations
 */

import { useState, useEffect, useCallback } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { User } from '../types/auth';
import { logger } from '../utils/logger';
import {
  signInWithGoogle,
  signInWithEmailPassword,
  registerWithEmailPassword,
  sendMagicLink,
  verifyMagicLink,
  sendPasswordReset,
  resendEmailVerification,
  updateUserPassword,
  deleteUserAccount,
  isValidMagicLink,
  getCurrentUser,
  isEmailVerified,
} from '../lib/auth-providers';

interface AuthState {
  // User state
  user: FirebaseUser | null;
  profile: User | null;
  loading: boolean;
  initializing: boolean;

  // Session state
  activeWorkspaceId: string | null;
  sessionId: string | null;
  lastActivity: Date | null;

  // Auth operations
  signInWithGoogle: () => Promise<{ success: boolean; error?: string; isNewUser?: boolean }>;
  signInWithEmail: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  registerWithEmail: (
    email: string,
    password: string,
    name: string,
  ) => Promise<{ success: boolean; error?: string }>;
  sendMagicLink: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyMagicLink: (
    emailLink: string,
  ) => Promise<{ success: boolean; error?: string; isNewUser?: boolean }>;
  sendPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  resendEmailVerification: () => Promise<{ success: boolean; error?: string }>;
  updatePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: (password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;

  // Utility functions
  isEmailVerified: boolean;
  hasPasswordProvider: boolean;
  hasGoogleProvider: boolean;
  setActiveWorkspace: (workspaceId: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateActivity: () => Promise<void>;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [activeWorkspaceId, setActiveWorkspaceIdState] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [lastActivity, setLastActivity] = useState<Date | null>(null);
  // Create session record
  const createSession = async (userId: string) => {
    try {
      logger.debug('Session created', { userId });
      setSessionId(`session_${Date.now()}`);
    } catch (error) {
      logger.error('Failed to create session', error);
    }
  };

  // Update last activity
  const updateLastActivity = async (userId: string) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        'activityMetrics.lastActiveAt': new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Failed to update last activity', error);
    }
  };

  // Initialize auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setUser(firebaseUser);

        if (firebaseUser) {
          logger.info('User authenticated', { uid: firebaseUser.uid, email: firebaseUser.email });

          // Create session record
          await createSession(firebaseUser.uid);

          // Listen to user profile changes
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const unsubscribeProfile = onSnapshot(
            userDocRef,
            (docSnap) => {
              if (docSnap.exists()) {
                const userData = { id: docSnap.id, ...docSnap.data() } as User;
                setProfile(userData);

                // Set active workspace from profile
                if (userData.preferences?.activeWorkspaceId) {
                  setActiveWorkspaceIdState(userData.preferences.activeWorkspaceId);
                }

                logger.debug('Profile updated', { uid: userData.id, role: userData.role });
              } else {
                logger.warn('User profile not found', { uid: firebaseUser.uid });
                setProfile(null);
              }
            },
            (error) => {
              logger.error('Profile listener error', error);
              setProfile(null);
            },
          );

          // Update last activity
          await updateLastActivity(firebaseUser.uid);
          setLastActivity(new Date());

          return () => unsubscribeProfile();
        } else {
          logger.info('User signed out');
          setProfile(null);
          setActiveWorkspaceIdState(null);
          setSessionId(null);
          setLastActivity(null);
        }
      } catch (error) {
        logger.error('Auth state change error', error);
      } finally {
        setInitializing(false);
      }
    });

    return unsubscribe;
  }, []);

  // Authentication operations
  const handleSignInWithGoogle = useCallback(async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.error) {
        return { success: false, error: result.error };
      }
      return { success: true, isNewUser: result.isNewUser };
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSignInWithEmail = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await signInWithEmailPassword(email, password);
      if (result.error) {
        return { success: false, error: result.error };
      }
      return { success: true };
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRegisterWithEmail = useCallback(
    async (email: string, password: string, name: string) => {
      setLoading(true);
      try {
        const result = await registerWithEmailPassword(email, password, name);
        if (result.error) {
          return { success: false, error: result.error };
        }
        return { success: true };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const handleSendMagicLink = useCallback(async (email: string) => {
    setLoading(true);
    try {
      const result = await sendMagicLink(email);
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleVerifyMagicLink = useCallback(async (emailLink: string) => {
    setLoading(true);
    try {
      const result = await verifyMagicLink(emailLink);
      if (result.error) {
        return { success: false, error: result.error };
      }
      return { success: true, isNewUser: result.isNewUser };
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSendPasswordReset = useCallback(async (email: string) => {
    setLoading(true);
    try {
      const result = await sendPasswordReset(email);
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleResendEmailVerification = useCallback(async () => {
    setLoading(true);
    try {
      const result = await resendEmailVerification();
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdatePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    setLoading(true);
    try {
      const result = await updateUserPassword(currentPassword, newPassword);
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteAccount = useCallback(async (password: string) => {
    setLoading(true);
    try {
      const result = await deleteUserAccount(password);
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut(auth);
      // Clear local storage
      localStorage.removeItem('activeWorkspaceId');
      logger.info('User signed out successfully');
    } catch (error) {
      logger.error('Sign out error', error);
      throw error;
    }
  }, []);

  // Workspace management
  const setActiveWorkspace = useCallback(
    async (workspaceId: string) => {
      if (!user || !profile) return;

      try {
        setActiveWorkspaceIdState(workspaceId);
        localStorage.setItem('activeWorkspaceId', workspaceId);

        // Update user preferences
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          'preferences.activeWorkspaceId': workspaceId,
          updatedAt: new Date().toISOString(),
        });

        logger.info('Active workspace updated', { userId: user.uid, workspaceId });
      } catch (error) {
        logger.error('Failed to update active workspace', error);
        throw error;
      }
    },
    [user, profile],
  );

  // Refresh profile data
  const refreshProfile = useCallback(async () => {
    if (!user) return;

    try {
      // Profile will be updated via the onSnapshot listener
      logger.info('Profile refresh requested', { userId: user.uid });
    } catch (error) {
      logger.error('Failed to refresh profile', error);
    }
  }, [user]);

  // Manual activity update
  const updateActivity = useCallback(async () => {
    if (!user) return;

    try {
      await updateLastActivity(user.uid);
      setLastActivity(new Date());
    } catch (error) {
      logger.error('Failed to update activity', error);
    }
  }, [user, updateLastActivity]);

  return {
    // State
    user,
    profile,
    loading,
    initializing,
    activeWorkspaceId,
    sessionId,
    lastActivity,

    // Auth operations
    signInWithGoogle: handleSignInWithGoogle,
    signInWithEmail: handleSignInWithEmail,
    registerWithEmail: handleRegisterWithEmail,
    sendMagicLink: handleSendMagicLink,
    verifyMagicLink: handleVerifyMagicLink,
    sendPasswordReset: handleSendPasswordReset,
    resendEmailVerification: handleResendEmailVerification,
    updatePassword: handleUpdatePassword,
    deleteAccount: handleDeleteAccount,
    signOut: handleSignOut,

    // Utility
    isEmailVerified: isEmailVerified(),
    hasPasswordProvider: getCurrentUser() !== null,
    hasGoogleProvider: getCurrentUser() !== null,
    setActiveWorkspace,
    refreshProfile,
    updateActivity,
  };
}

// Session management hook
export function useSession() {
  const [sessionValid, setSessionValid] = useState(true);
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null);

  useEffect(() => {
    const checkSession = () => {
      const user = getCurrentUser();
      if (!user) {
        setSessionValid(false);
        return;
      }

      // Check token expiry (Firebase handles this automatically)
      user
        .getIdTokenResult()
        .then((tokenResult) => {
          const expiryTime = new Date(tokenResult.expirationTime);
          setSessionExpiry(expiryTime);
          setSessionValid(new Date() < expiryTime);
        })
        .catch((error) => {
          logger.error('Failed to check token expiry', error);
          setSessionValid(false);
        });
    };

    checkSession();

    // Check session every 5 minutes
    const interval = setInterval(checkSession, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const refreshSession = useCallback(async () => {
    const user = getCurrentUser();
    if (!user) return false;

    try {
      await user.getIdToken(true); // Force refresh
      setSessionValid(true);
      return true;
    } catch (error) {
      logger.error('Failed to refresh session', error);
      setSessionValid(false);
      return false;
    }
  }, []);

  return {
    sessionValid,
    sessionExpiry,
    refreshSession,
  };
}

// Magic link detection hook
export function useMagicLinkDetection() {
  const [isValidLink, setIsValidLink] = useState(false);
  const [emailLink, setEmailLink] = useState<string | null>(null);

  useEffect(() => {
    const url = window.location.href;
    if (isValidMagicLink(url)) {
      setIsValidLink(true);
      setEmailLink(url);
    }
  }, []);

  return {
    isValidLink,
    emailLink,
  };
}
