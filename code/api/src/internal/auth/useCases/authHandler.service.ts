import { Injectable } from '@nestjs/common';
import { FirebaseAuthRepository } from '../infrastructure/repositories/firebaseAuthRepository.service';
import { UserRepository } from '../infrastructure/repositories/userRepository.service';
import { User } from '../infrastructure/domain/user';
import { logger } from 'src/pkg/shared/helpers/logger';

@Injectable()
export class AuthHandler {
  constructor(
    private readonly firebaseAuthRepository: FirebaseAuthRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async register(
    email: string,
    password: string,
    roleId: number,
  ): Promise<any> {
    try {
      const firebaseUser = await this.firebaseAuthRepository.createUser(
        email,
        password,
      );
      logger('Firebase User', firebaseUser);
      await this.firebaseAuthRepository.setUserRole(firebaseUser.uid, roleId);
      logger('Firebase User Role Set', firebaseUser.uid, roleId);
      const blockchainId = await this.userRepository.getAvailableBlockchainId();

      const user = new User();
      user.email = email;
      user.roleId = roleId;
      user.firebaseUid = firebaseUser.uid;
      user.blockchainId = blockchainId;

      const createdUser = await this.userRepository.createUser(user);
      logger('User saved', user);

      return createdUser;
    } catch (error) {
      logger('Error', error);
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async getUser(firebaseUid: string): Promise<any> {
    return this.userRepository.getUserByFirebaseUid(firebaseUid);
  }

  async updateUser(user: User): Promise<any> {
    this.userRepository.updateUser(user);
  }
}
