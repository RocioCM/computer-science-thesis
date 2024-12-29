import {
  Controller,
  Post,
  Put,
  Body,
  Get,
  Param,
  Delete,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ContractHandler } from 'src/internal/consent/handlers/contract.handler';
import { CONSENT_API_PATH } from 'src/pkg/shared/constants';

@Controller(CONSENT_API_PATH)
export class ContractController {
  constructor(private readonly contractHandler: ContractHandler) {}

  @Post('/')
  async createConsent(
    @Body('consentId', ParseIntPipe) consentId: number,
    @Body('creatorId', ParseIntPipe) creatorId: number,
    @Body('activities') activities: string[],
  ) {
    if (!Array.isArray(activities)) {
      throw new HttpException(
        'Activities must be an array',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.contractHandler.createConsent(consentId, creatorId, activities);
  }

  @Put('/:id/user/:userId/join')
  async joinConsent(
    @Param('id', ParseIntPipe) consentId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body('activities') activities: string[],
  ) {
    if (!Array.isArray(activities)) {
      throw new HttpException(
        'Activities must be an array',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.contractHandler.joinConsent(consentId, userId, activities);
  }

  @Put('/:id/user/:userId/reject')
  async rejectConsent(
    @Param('id', ParseIntPipe) consentId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.contractHandler.rejectConsent(consentId, userId);
  }

  @Put('/:id/user/:userId/revoke')
  async revokeConsent(
    @Param('id', ParseIntPipe) consentId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.contractHandler.revokeConsent(consentId, userId);
  }

  @Delete('/:id')
  async deleteConsent(@Param('id', ParseIntPipe) consentId: number) {
    return this.contractHandler.deleteConsent(consentId);
  }

  @Put('/:id/user/:userId/activities')
  async updateActivities(
    @Param('id', ParseIntPipe) consentId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body('activities') activities: string[],
  ) {
    if (!Array.isArray(activities)) {
      throw new HttpException(
        'Activities must be an array',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.contractHandler.updateActivities(consentId, userId, activities);
  }

  @Get('/:id')
  async getConsent(@Param('id', ParseIntPipe) consentId: number) {
    return this.contractHandler.getConsent(consentId);
  }

  @Get('/:id/users')
  async getConsentUsers(@Param('id', ParseIntPipe) consentId: number) {
    return this.contractHandler.getConsentUsers(consentId);
  }

  @Get('/:id/user/:userId')
  async getConsentUser(
    @Param('id', ParseIntPipe) consentId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.contractHandler.getConsentUserById(consentId, userId);
  }

  @Get('/:id/user/:userId/activities')
  async getConsentUserActivities(
    @Param('id', ParseIntPipe) consentId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.contractHandler.getConsentUserActivities(consentId, userId);
  }

  @Get('/:id/integrity')
  async getConsentIntegrity(@Param('id', ParseIntPipe) consentId: number) {
    return this.contractHandler.getConsentIntegrity(consentId);
  }
}
