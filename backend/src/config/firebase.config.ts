import { registerAs } from '@nestjs/config';

export const firebaseConfig = registerAs('firebase', () => ({
  projectId: process.env.FIREBASE_PROJECT_ID ?? '',
  // Service account key as JSON string (set in env or mounted as file)
  serviceAccountJson: process.env.FIREBASE_SERVICE_ACCOUNT_JSON ?? '',
  // OR use service account key file path:
  serviceAccountKeyPath: process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH ?? '',
}));
