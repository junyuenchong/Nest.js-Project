import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from './delete-user.command';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Delete User handler: deletes a user
@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: DeleteUserCommand): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id: command.id } });
    if (!user) throw new Error('User not found');
    if (user.id !== command.userId) throw new Error('You can only delete your own account');
    const result = await this.userRepository.delete(command.id);
    return !!result.affected;
  }
} 