import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContractController } from 'src/internal/consent/presentation/controllers/contract.controller';
import { ContractHandler } from 'src/internal/consent/handlers/contract.handler';
import { ContractRepository } from 'src/internal/consent/repositories/contract.repository';
import { EthersProvider } from './ethers.module';
import blockchainConfig from './config/blockchain.config';

@Module({
  imports: [ConfigModule.forFeature(blockchainConfig)],
  controllers: [ContractController],
  providers: [ContractHandler, ContractRepository, EthersProvider],
})
export class BlockchainModule {}
