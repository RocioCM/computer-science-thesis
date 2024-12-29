import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BlockchainModule } from 'src/internal/consent/infrastructure/blockchain.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), BlockchainModule],
})
export class AppModule {}
