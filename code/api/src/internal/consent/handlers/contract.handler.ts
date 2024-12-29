import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ContractRepository } from 'src/internal/consent/repositories/contract.repository';

@Injectable()
export class ContractHandler {
  constructor(private readonly contractRepository: ContractRepository) {}

  async createConsent(
    consentId: number,
    creatorId: number,
    activities: string[],
  ) {
    return this.contractRepository.createConsent(
      consentId,
      creatorId,
      activities,
    );
  }

  async joinConsent(consentId: number, userId: number, activities: string[]) {
    return this.contractRepository.joinConsent(consentId, userId, activities);
  }

  async rejectConsent(consentId: number, userId: number) {
    return this.contractRepository.rejectConsent(consentId, userId);
  }

  async revokeConsent(consentId: number, userId: number) {
    return this.contractRepository.revokeConsent(consentId, userId);
  }

  async deleteConsent(consentId: number) {
    return this.contractRepository.deleteConsent(consentId);
  }

  async updateActivities(
    consentId: number,
    userId: number,
    activities: string[],
  ) {
    return this.contractRepository.updateActivities(
      consentId,
      userId,
      activities,
    );
  }

  async getConsent(consentId: number) {
    const consent = await this.contractRepository.getConsent(consentId);

    if (consent.id === 0) {
      throw new HttpException('Consent does not exist', HttpStatus.NOT_FOUND);
    }
    return consent;
  }

  async getConsentUsers(consentId: number) {
    return this.contractRepository.getConsentUsers(consentId);
  }

  async getConsentUserById(consentId: number, userId: number) {
    const user = await this.contractRepository.getConsentUserById(
      consentId,
      userId,
    );

    if (user.userId === 0) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async getConsentUserActivities(consentId: number, userId: number) {
    return this.contractRepository.getConsentUserActivities(consentId, userId);
  }

  async getConsentIntegrity(consentId: number) {
    return this.contractRepository.getConsentIntegrity(consentId);
  }
}
