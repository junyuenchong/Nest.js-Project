import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostCommand } from './create-post.command';
import { Post } from '../entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { Tag } from '../../tags/entities/tag.entity';

// Create Post handler: Handles the creation of a new post, associating it with an author and tags.
@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}
   
  async execute(command: CreatePostCommand): Promise<Post> {
    const { title, content, authorId, tagIds } = command;
    console.log('CreatePostHandler: authorId', authorId, 'tagIds', tagIds);
    
    // Find the author by ID and log details if not found
    const author = await this.userRepository.findOne({ where: { id: authorId } });
    
   //  logs if author was found (true/false) for debugging: console.log('CreatePostHandler: found author?', !!author);
    
    // Check if user exists
    if (!author) {

     // Author not found for debugging: console.error(`Author not found with ID ${authorId}. Available users:`);
      const users = await this.userRepository.find();

     // log all users in the database for troubleshooting missing author for debugging: console.log(users.map(u => ({ id: u.id, username: u.username })));
      throw new NotFoundException(`Author not found (id: ${authorId})`);
      
    }
    
    // Find tags if any tag IDs provided
    let tags: Tag[] = [];
    if (tagIds && tagIds.length > 0) {
      tags = await this.tagRepository.findBy({ id: In(tagIds) });
      
      // Check if all tags were found
      if (tags.length !== tagIds.length) {
        const foundTagIds = tags.map(tag => tag.id);
        const missingTagIds = tagIds.filter(id => !foundTagIds.includes(id));
        console.warn(`Some tags were not found: ${missingTagIds.join(', ')}`);
      }
    }
    
    // Create and save post with author and tags
    const post = this.postRepository.create({ 
      title, 
      content, 
      author,
      tags 
    });
    
    return this.postRepository.save(post);
  }
} 