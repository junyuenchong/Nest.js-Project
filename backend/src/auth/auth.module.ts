import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UserProfile } from '../users/entities/user-profile.entity';
import { AuthResolver } from './auth.resolver';

import { JwtStrategy } from './jwt/jwt.strategy';
import { GqlAuthGuard } from './jwt/gql-auth.guard';
import { CqrsModule } from '@nestjs/cqrs';
import { RegisterHandler } from './commands/register.handler';
import { LoginHandler } from './commands/login.handler';

import { AuthService } from './service/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProfile]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecret',
      signOptions: { expiresIn: '1d' },
    }),
    CqrsModule,
  ],
  providers: [AuthResolver, AuthService, JwtStrategy, GqlAuthGuard, RegisterHandler, LoginHandler],
})
export class AuthModule {} 