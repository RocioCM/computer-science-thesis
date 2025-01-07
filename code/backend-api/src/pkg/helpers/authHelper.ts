import * as firebaseAdmin from 'firebase-admin';
import { getEnv } from './env';

export function initializeAdmin(): Promise<void> {
  try {
    const serviceAccount = JSON.parse(getEnv('FIREBASE_CONFIG', '{}'));

    // Init Firebase Authentication Admin
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(serviceAccount),
    });
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
}

export default firebaseAdmin;
