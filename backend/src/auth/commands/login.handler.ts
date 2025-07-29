
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from './login.command';

import { User } from '../../users/entities/user.entity';
import { AuthService } from '../service/auth.service';

// Login handler: authenticates user and returns JWT tokens
@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(private readonly authService: AuthService) {}

  async execute(command: LoginCommand): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    const { email, password } = command;
    const user = await this.authService.validateUser(email, password);
    if (!user) throw new Error('Invalid credentials');
    
    const accessToken = await this.authService.issueAccessToken(user);
    const refreshToken = await this.authService.issueRefreshToken(user);
    
    return { accessToken, refreshToken, user };
  }
} 