import { Module } from '@nestjs/common';
import { FirebaseModule } from './infrastructure/firebase/firebase.module';
import { AuthHandler } from './useCases/authHandler.service';
import { AuthRouter } from './presentation/authRouter.controller';
import { UserRepository } from './infrastructure/repositories/userRepository.service';
import { FirebaseAuthRepository } from './infrastructure/repositories/firebaseAuthRepository.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './infrastructure/domain/user';
import { Role } from './infrastructure/domain/role';
import { Watchers } from 'src/pkg/shared/domain/watchers';
import { Owners } from 'src/pkg/shared/domain/owners';

@Module({
  imports: [
    FirebaseModule,
    TypeOrmModule.forFeature([User, Role, Watchers, Owners]),
  ],
  controllers: [AuthRouter],
  providers: [AuthHandler, FirebaseAuthRepository, UserRepository],
})
export class AuthModule {}
