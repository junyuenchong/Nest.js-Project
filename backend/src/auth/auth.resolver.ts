import { Resolver, Mutation, Args, Query, ObjectType, Field, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './service/auth.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { User } from '../users/entities/user.entity';
import { CommandBus } from '@nestjs/cqrs';
import { LoginCommand } from './commands/login.command';
import { RegisterCommand } from './commands/register.command';
import { GqlAuthGuard } from './jwt/gql-auth.guard';
import { CurrentUser } from './getcurrentuser/current-user.decorator';
import { securityConfig } from '../config/security.config';
import { CsrfMiddleware } from '../middleware/csrf.middleware';


@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => User)
  user: User;
}

@ObjectType()
class RefreshResponse {
  @Field()
  accessToken: string;
}

@ObjectType()
class CsrfResponse {
  @Field()
  csrfToken: string;
}

@Resolver()
export class AuthResolver {
  private csrfMiddleware: CsrfMiddleware;

  constructor(
    private readonly authService: AuthService,
    private readonly commandBus: CommandBus,
  ) {
    this.csrfMiddleware = new CsrfMiddleware();
  }

  // Register new user
  @Mutation(() => User)
  async register(@Args('input') input: RegisterInput): Promise<User> {
    return this.commandBus.execute(new RegisterCommand(input.username, input.email, input.password));
  }

  // Login user and set security cookies
  @Mutation(() => LoginResponse)
  async login(
    @Args('input') input: LoginInput,
    @Context() context: { res: Response },
  ): Promise<LoginResponse> {
    const result = await this.commandBus.execute(new LoginCommand(input.email, input.password));
    
    const csrfToken = this.csrfMiddleware.generateToken();
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    // Set access token (1 hour in development, 15min in production)
    context.res.cookie(securityConfig.cookies.accessTokenName, result.accessToken, {
      ...securityConfig.cookies.options,
      maxAge: isDevelopment ? 60 * 60 * 1000 : 15 * 60 * 1000, // 1 hour in dev, 15min in prod
    });
    
    // Set refresh token (30 days in development, 7 days in production)
    context.res.cookie(securityConfig.cookies.refreshTokenName, result.refreshToken, {
      ...securityConfig.cookies.options,
      maxAge: isDevelopment ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000, // 30 days in dev, 7 days in prod
    });
    
    // Set CSRF token (30 days in development, 24 hours in production)
    context.res.cookie(securityConfig.cookies.csrfTokenName, csrfToken, {
      ...securityConfig.cookies.csrfOptions,
      maxAge: isDevelopment ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000, // 30 days in dev, 24 hours in prod
    });
    
    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    };
  }

  // Refresh access token using refresh token
  @Mutation(() => RefreshResponse)
  async refreshToken(@Context() context: { res: Response; req: any }): Promise<RefreshResponse> {
    try {
      const refreshToken = context.req.cookies[securityConfig.cookies.refreshTokenName];
      
      if (!refreshToken) {
        throw new Error('No refresh token provided');
      }
      
      const newAccessToken = await this.authService.refreshAccessToken(refreshToken);
      
      // Update access token cookie
      context.res.cookie(securityConfig.cookies.accessTokenName, newAccessToken, {
        ...securityConfig.cookies.options,
        maxAge: 15 * 60 * 1000, // 15 minutes
      });
      
      return { accessToken: newAccessToken };
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  }

  // Generate new CSRF token
  @Query(() => CsrfResponse)
  async getCsrfToken(@Context() context: { res: Response }): Promise<CsrfResponse> {
    const csrfToken = this.csrfMiddleware.generateToken();
    
    // Set CSRF token in cookie
    context.res.cookie(securityConfig.cookies.csrfTokenName, csrfToken, {
      ...securityConfig.cookies.csrfOptions,
    });
    
    return { csrfToken };
  }

  // Logout and clear all cookies
  @Mutation(() => Boolean)
  async logout(@Context() context: { res: Response }): Promise<boolean> {
    context.res.clearCookie(securityConfig.cookies.accessTokenName);
    context.res.clearCookie(securityConfig.cookies.refreshTokenName);
    context.res.clearCookie(securityConfig.cookies.csrfTokenName);
    
    return true;
  }

  // Get current user profile (protected)
  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async profile(@CurrentUser() user: User): Promise<User> {
    // Load user with profile relationship
    return this.authService.getUserWithProfile(user.id);
  }

  // Update current user profile (protected)
  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async updateProfile(
    @Args('input') input: UpdateProfileInput,
    @CurrentUser() user: User,
  ): Promise<User> {
    return this.authService.updateProfile(user.id, input);
  }
} 