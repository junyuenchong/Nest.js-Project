import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTagCommand } from './update-tag.command';
import { Tag } from '../entities/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(UpdateTagCommand)
export class UpdateTagHandler implements ICommandHandler<UpdateTagCommand> {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async execute(command: UpdateTagCommand): Promise<Tag> {
    console.log('UpdateTagHandler: Starting update for tag ID:', command.id, 'with name:', command.name);
    
    // Validate input
    if (!command.id || command.id <= 0) {
      throw new BadRequestException('Invalid tag ID');
    }
    
    if (!command.name || command.name.trim().length === 0) {
      throw new BadRequestException('Tag name cannot be empty');
    }
    
    if (command.name.trim().length < 2 || command.name.trim().length > 50) {
      throw new BadRequestException('Tag name must be between 2 and 50 characters');
    }
    
    // Find the tag to update
    const tag = await this.tagRepository.findOne({ where: { id: command.id } });
    console.log('UpdateTagHandler: Found tag:', tag);
    
    if (!tag) {
      console.log('UpdateTagHandler: Tag not found');
      throw new BadRequestException(`Tag with ID ${command.id} not found`);
    }

    // Check if another tag with the same name already exists (excluding current tag)
      const existingTag = await this.tagRepository.findOne({ 
      where: { name: command.name.trim(), id: Not(command.id) }
      });
    console.log('UpdateTagHandler: Existing tag with same name:', existingTag);
      
      if (existingTag) {
      console.log('UpdateTagHandler: Duplicate name found');
      throw new BadRequestException(`Tag with name '${command.name.trim()}' already exists`);
      }
      
    // Update the tag name
    tag.name = command.name.trim();
    console.log('UpdateTagHandler: Updating tag name to:', tag.name);
    
    try {
      // Save and return the updated tag
      const savedTag = await this.tagRepository.save(tag);
      console.log('UpdateTagHandler: Tag saved successfully:', savedTag);
      return savedTag;
    } catch (error) {
      console.error('UpdateTagHandler: Database save error:', error);
      throw new BadRequestException('Failed to save tag update');
    }
  }
} 