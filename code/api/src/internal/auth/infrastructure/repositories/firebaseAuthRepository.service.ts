import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthRepository {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseApp: admin.app.App,
  ) {}

  async createUser(
    email: string,
    password: string,
  ): Promise<admin.auth.UserRecord> {
    return this.firebaseApp.auth().createUser({
      email,
      password,
    });
  }

  async setUserRole(uid: string, roleId: number): Promise<void> {
    return this.firebaseApp.auth().setCustomUserClaims(uid, { role: roleId });
  }
}
