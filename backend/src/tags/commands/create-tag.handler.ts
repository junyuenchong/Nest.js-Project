import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTagCommand } from './create-tag.command';
import { Tag } from '../entities/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Create Tag handler: creates a new tag
@CommandHandler(CreateTagCommand)
export class CreateTagHandler implements ICommandHandler<CreateTagCommand> {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async execute(command: CreateTagCommand): Promise<Tag> {
    // Check if tag with same name already exists
    const existingTag = await this.tagRepository.findOne({ 
      where: { name: command.name } 
    });
    
    if (existingTag) {
      throw new Error(`Tag with name '${command.name}' already exists`);
    }
    
    const tag = this.tagRepository.create({ name: command.name });
    return this.tagRepository.save(tag);
  }
} 