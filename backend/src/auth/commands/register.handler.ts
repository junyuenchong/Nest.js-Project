import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommand } from './register.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { UserProfile } from '../../users/entities/user-profile.entity';
import { AuthService } from '../service/auth.service';
import { BadRequestException } from '@nestjs/common';

// Register handler: creates a new user if username and email are unique
@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
    private readonly authService: AuthService,
  ) {}

  async execute(command: RegisterCommand): Promise<User> {
    const { username, email, password } = command;
    const existingUser = await this.userRepository.findOne({ where: { username } });
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }
    const existingEmail = await this.userRepository.findOne({ where: { email } });
    if (existingEmail) {
      throw new BadRequestException('Email already exists');
    }
    const hashedPassword = await this.authService.hashPassword(password);
    const user = this.userRepository.create({ username, email, password: hashedPassword });
    await this.userRepository.save(user);
    
    // Create user profile
    const userProfile = this.userProfileRepository.create({
      user: user,
      bio: undefined, // Default empty bio
    });
    await this.userProfileRepository.save(userProfile);
    
    return user;
  }
} 