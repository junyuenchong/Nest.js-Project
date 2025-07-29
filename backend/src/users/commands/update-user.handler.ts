import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from './update-user.command';
import { User } from '../entities/user.entity';
import { UserProfile } from '../entities/user-profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

// Update User handler: updates a user
@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
  ) {}

  // Update user profile, securely hash new password if provided
  async execute(command: UpdateUserCommand): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: command.userId } });

    if (!user) throw new Error('User not found');

    if (command.username !== undefined) {
      user.username = command.username;
    }

    if (command.password !== undefined) {
      // Only hash if a new password is provided
      user.password = await bcrypt.hash(command.password, 10);
    }

    // Save updated user
    await this.userRepository.save(user);

    // Update user profile bio if provided
    if (command.bio !== undefined) {
      let userProfile = await this.userProfileRepository.findOne({ 
        where: { user: { id: command.userId } } 
      });
      
      if (!userProfile) {
        // Create profile if it doesn't exist
        userProfile = this.userProfileRepository.create({
          user: user,
          bio: command.bio || undefined,
        });
      } else {
        // Update existing profile
        userProfile.bio = command.bio || undefined;
      }
      
      await this.userProfileRepository.save(userProfile);
    }

    return user;
  }
} 