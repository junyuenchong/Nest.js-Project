import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UserProfile } from 'src/users/entities/user-profile.entity';
import { UpdateProfileInput } from '../dto/update-profile.input';
import { securityConfig } from '../../config/security.config';

interface TokenPayload {
  username: string;
  sub: number;
  type: 'access' | 'refresh';
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
    private readonly jwtService: JwtService,
  ) {}

  // Check user credentials and verify password
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        return user;
      }
    }
    return null;
  }

  // Hash a password with bcrypt
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  // Issue access token for user
  async issueAccessToken(user: User): Promise<string> {
    const payload: TokenPayload = { 
      username: user.username, 
      sub: user.id,
      type: 'access'
    };
    return this.jwtService.sign(payload, {
      secret: securityConfig.jwt.accessTokenSecret,
      expiresIn: securityConfig.jwt.accessTokenExpiresIn,
    });
  }

  // Issue refresh token for user
  async issueRefreshToken(user: User): Promise<string> {
    const payload: TokenPayload = { 
      username: user.username, 
      sub: user.id,
      type: 'refresh'
    };
    return this.jwtService.sign(payload, {
      secret: securityConfig.jwt.refreshTokenSecret,
      expiresIn: securityConfig.jwt.refreshTokenExpiresIn,
    });
  }

  // Refresh access token using refresh token
  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: securityConfig.jwt.refreshTokenSecret,
      }) as TokenPayload;

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      const user = await this.userRepository.findOne({ where: { id: payload.sub } });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.issueAccessToken(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // Verify access token
  async verifyAccessToken(token: string): Promise<TokenPayload> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: securityConfig.jwt.accessTokenSecret,
      }) as TokenPayload;

      if (payload.type !== 'access') {
        throw new UnauthorizedException('Invalid token type');
      }

      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  // Legacy method for backward compatibility
  async issueJwt(user: User): Promise<string> {
    return this.issueAccessToken(user);
  }

  // Update user profile
  async updateProfile(userId: number, input: UpdateProfileInput): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where: { id: userId },
      relations: ['profile']
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Update username if provided
    if (input.username && input.username.trim()) {
      // Check if username is already taken by another user
      const existingUser = await this.userRepository.findOne({ 
        where: { username: input.username.trim(), id: userId } 
      });
      if (existingUser && existingUser.id !== userId) {
        throw new BadRequestException('Username already exists');
      }
      user.username = input.username.trim();
    }

    // Update email if provided
    if (input.email && input.email.trim()) {
      // Check if email is already taken by another user
      const existingUser = await this.userRepository.findOne({ 
        where: { email: input.email.trim(), id: userId } 
      });
      if (existingUser && existingUser.id !== userId) {
        throw new BadRequestException('Email already exists');
      }
      user.email = input.email.trim();
    }

    // Update password if provided
    if (input.password && input.password.trim()) {
      user.password = await this.hashPassword(input.password.trim());
    }

    // Save updated user
    await this.userRepository.save(user);

    // Update user profile bio if provided
    if (input.bio !== undefined) {
      let userProfile = await this.userProfileRepository.findOne({ 
        where: { user: { id: userId } } 
      });
      
      if (!userProfile) {
        // Create profile if it doesn't exist
        userProfile = this.userProfileRepository.create({
          user: user,
          bio: input.bio || undefined,
        });
      } else {
        // Update existing profile
        userProfile.bio = input.bio || undefined;
      }
      
      await this.userProfileRepository.save(userProfile);
    }

    // Return user with profile loaded
    const updatedUser = await this.userRepository.findOne({ 
      where: { id: userId },
      relations: ['profile']
    });
    
    if (!updatedUser) {
      throw new BadRequestException('User not found after update');
    }
    
    return updatedUser;
  }

  // Get user with profile relationship
  async getUserWithProfile(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where: { id: userId },
      relations: ['profile']
    });
    
    if (!user) {
      throw new BadRequestException('User not found');
    }
    
    return user;
  }
} 