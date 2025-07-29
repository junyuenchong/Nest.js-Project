// JWT strategy: checks token and loads user
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { securityConfig } from '../../config/security.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      // Get JWT from cookie or Authorization header
      jwtFromRequest: (request) => {
        const token = request.cookies[securityConfig.cookies.accessTokenName];
        if (token) {
          return token;
        }
        return ExtractJwt.fromAuthHeaderAsBearerToken()(request);
      },
      ignoreExpiration: false,
      secretOrKey: securityConfig.jwt.accessTokenSecret,
    });
  }

  // Validate JWT payload and return user
  async validate(payload: any) {
    if (payload.type !== 'access') {
      return null;
    }
    const user = await this.userRepository.findOne({ where: { id: payload.sub } });
    if (!user) {
      return null;
    }
    return user;
  }
} 