import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteTagCommand } from './delete-tag.command';
import { Tag } from '../entities/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(DeleteTagCommand)
export class DeleteTagHandler implements ICommandHandler<DeleteTagCommand> {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async execute(command: DeleteTagCommand): Promise<boolean> {
    // Find the tag to delete
    const tag = await this.tagRepository.findOne({ 
      where: { id: command.id },
      relations: ['posts']
    });
    
    if (!tag) {
      throw new BadRequestException(`Tag with ID ${command.id} not found`);
    }

    // Check if the tag is used by any posts
    if (tag.posts && tag.posts.length > 0) {
      throw new BadRequestException(`Cannot delete tag '${tag.name}' because it is used by ${tag.posts.length} post(s). Please remove it from all posts first.`);
    }

    // Delete the tag
    const result = await this.tagRepository.delete(command.id);
    
    // Return true if deletion was successful
    return (result.affected ?? 0) > 0;
  }
} 