import { z } from 'zod';

const clientSchema = z.object({
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1, 'Firebase API Key is required'),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1, 'Firebase Auth Domain is required'),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1, 'Firebase Project ID is required'),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1, 'Firebase Storage Bucket is required'),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1, 'Firebase Messaging Sender ID is required'),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1, 'Firebase App ID is required'),
});

const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  GEMINI_API_KEY: z.string().min(1, 'Gemini API Key is required'),
  FIREBASE_CLIENT_EMAIL: z.string().email('Valid client email is required'),
  FIREBASE_PRIVATE_KEY: z.string().min(1, 'Firebase private key is required'),
  CLOUD_RUN_URL: z.string().url().optional().or(z.string().length(0)).transform((val) => val || 'http://localhost:3000'),
});

const combinedSchema = clientSchema.merge(serverSchema);

let env: z.infer<typeof combinedSchema>;

const isServer = typeof window === 'undefined';

if (process.env.SKIP_ENV_VALIDATION === 'true' || process.env.NODE_ENV === 'test') {
  // Pre-populate with dummy values to bypass verification in testing or CI/CD pipelines
  env = {
    NODE_ENV: 'test',
    GEMINI_API_KEY: 'mock-gemini-key',
    NEXT_PUBLIC_FIREBASE_API_KEY: 'mock-firebase-key',
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'mock-project.firebaseapp.com',
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'mock-project',
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: 'mock-project.appspot.com',
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: '1234567890',
    NEXT_PUBLIC_FIREBASE_APP_ID: '1:1234567890:web:1234567890',
    FIREBASE_CLIENT_EMAIL: 'firebase-adminsdk-mock@mock-project.iam.gserviceaccount.com',
    FIREBASE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\nmock-private-key\n-----END PRIVATE KEY-----',
    CLOUD_RUN_URL: 'http://localhost:3000',
  };
} else if (isServer) {
  const parsed = combinedSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    CLOUD_RUN_URL: process.env.CLOUD_RUN_URL,
  });

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    throw new Error('Environment validation failed. Please check your environment configuration.');
  }
  env = parsed.data;
} else {
  // Validate client subset on the frontend browser runtime
  const parsed = clientSchema.safeParse({
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  });

  if (!parsed.success) {
    console.error('❌ Invalid client environment variables:', parsed.error.flatten().fieldErrors);
    throw new Error('Client environment validation failed.');
  }
  // Assign dummy strings for server-only variables for frontend type safety
  env = {
    ...parsed.data,
    NODE_ENV: (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test',
    GEMINI_API_KEY: '',
    FIREBASE_CLIENT_EMAIL: '',
    FIREBASE_PRIVATE_KEY: '',
    CLOUD_RUN_URL: '',
  };
}

export { env };
export type EnvType = z.infer<typeof combinedSchema>;
