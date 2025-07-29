import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeletePostCommand } from './delete-post.command';
import { Post } from '../entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';

// Delete Post handler: removes a post
@CommandHandler(DeletePostCommand)
export class DeletePostHandler implements ICommandHandler<DeletePostCommand> {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async execute(command: DeletePostCommand): Promise<boolean> {
    // Validate input
    if (!command.id || command.id <= 0) {
      throw new BadRequestException('Invalid post ID');
    }

    if (!command.userId || command.userId <= 0) {
      throw new BadRequestException('User ID is required');
    }

    // Find the post with author relation
    const post = await this.postRepository.findOne({ 
      where: { id: command.id }, 
      relations: ['author'] 
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${command.id} not found`);
    }

    // Check if user owns the post
    if (post.author.id !== command.userId) {
      throw new UnauthorizedException('You are not the owner of this post');
    }

    // Delete the post
    const result = await this.postRepository.delete(command.id);
    
    if (!result.affected || result.affected === 0) {
      throw new BadRequestException('Failed to delete post');
    }

    return true;
  }
} 