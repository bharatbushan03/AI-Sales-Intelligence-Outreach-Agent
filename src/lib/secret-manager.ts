/**
 * Google Secret Manager integration for Cloud Run deployments.
 * Secrets are injected as environment variables by Cloud Run at startup.
 * This module provides runtime validation and fallback for local development.
 */

import { env } from './env';

export interface SecretConfig {
  geminiApiKey: string;
  firebaseClientEmail: string;
  firebasePrivateKey: string;
}

let cachedSecrets: SecretConfig | null = null;

/**
 * Returns validated secrets from environment (injected by Secret Manager on Cloud Run).
 * Caches result for the lifetime of the process.
 */
export function getSecrets(): SecretConfig {
  if (cachedSecrets) {
    return cachedSecrets;
  }

  cachedSecrets = {
    geminiApiKey: env.GEMINI_API_KEY,
    firebaseClientEmail: env.FIREBASE_CLIENT_EMAIL,
    firebasePrivateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  };

  return cachedSecrets;
}

/**
 * Validates that all required secrets are present without exposing values.
 */
export function validateSecretsPresent(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  if (!env.GEMINI_API_KEY || env.GEMINI_API_KEY === 'mock-gemini-key') {
    if (process.env.NODE_ENV === 'production') {
      missing.push('GEMINI_API_KEY');
    }
  }
  if (!env.FIREBASE_CLIENT_EMAIL) missing.push('FIREBASE_CLIENT_EMAIL');
  if (!env.FIREBASE_PRIVATE_KEY) missing.push('FIREBASE_PRIVATE_KEY');

  return { valid: missing.length === 0, missing };
}
