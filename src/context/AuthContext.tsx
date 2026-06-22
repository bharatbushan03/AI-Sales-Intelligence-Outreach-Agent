'use client';

import React, { createContext, useContext } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { User } from '../types/auth';
import { useAuth as useAuthHook } from '../hooks/useAuth';

interface AuthContextType {
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
  signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerWithEmail: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  sendMagicLink: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyMagicLink: (emailLink: string) => Promise<{ success: boolean; error?: string; isNewUser?: boolean }>;
  sendPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  resendEmailVerification: () => Promise<{ success: boolean; error?: string }>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: (password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  
  // Utility functions
  isEmailVerified: boolean;
  hasPasswordProvider: boolean;
  hasGoogleProvider: boolean;
  setActiveWorkspace: (workspaceId: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateActivity: () => Promise<void>;
  
  // Legacy compatibility
  logout: () => Promise<void>;
  setActiveWorkspaceId: (id: string | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthHook();

  // Legacy compatibility methods
  const logout = auth.signOut;
  const setActiveWorkspaceId = (id: string | null) => {
    if (id) {
      auth.setActiveWorkspace(id);
    }
  };

  const contextValue: AuthContextType = {
    ...auth,
    logout,
    setActiveWorkspaceId,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
