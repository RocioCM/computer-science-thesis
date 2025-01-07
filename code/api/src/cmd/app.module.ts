import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BlockchainModule } from 'src/internal/consent/infrastructure/blockchain.module';
import { AuthModule } from 'src/internal/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/internal/auth/infrastructure/domain/user';
import { Role } from 'src/internal/auth/infrastructure/domain/role';
import { Watchers } from 'src/pkg/shared/domain/watchers';
import { Owners } from 'src/pkg/shared/domain/owners';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BlockchainModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'test.lila.com.ar',
      port: 3306,
      username: 'lila',
      password: 'wenatomilus123',
      database: 'blockchain_test',
      entities: [User, Role, Watchers, Owners],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
