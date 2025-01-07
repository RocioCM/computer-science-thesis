import { Injectable } from '@nestjs/common';
import { User } from '../domain/user';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUserById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async getUserByBlockchainId(blockchainId: string): Promise<User> {
    return this.userRepository.findOne({ where: { blockchainId } });
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User> {
    return this.userRepository.findOne({ where: { firebaseUid } });
  }

  async getAvailableBlockchainId(): Promise<string> {
    let addressInUse = true;
    let randomAddress = '';
    while (addressInUse) {
      randomAddress = '0x' + crypto.randomBytes(16).toString('hex'); // Create a random 32-hex-character string. 16 bytes = 32 hex characters
      const userWithAddress = await this.userRepository.findOne({
        where: { blockchainId: randomAddress },
      });
      if (!userWithAddress?.id) {
        addressInUse = false;
      }
    }
    return randomAddress;
  }

  async updateUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
