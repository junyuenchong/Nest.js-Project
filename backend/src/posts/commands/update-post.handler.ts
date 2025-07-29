import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePostCommand } from './update-post.command';
import { Post } from '../entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Tag } from '../../tags/entities/tag.entity';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

// Update Post handler: updates a post
@CommandHandler(UpdatePostCommand)
export class UpdatePostHandler implements ICommandHandler<UpdatePostCommand> {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async execute(command: UpdatePostCommand): Promise<Post> {
    const { id, title, content, authorId, tagIds } = command;
    console.log('UpdatePostHandler: postId', id, 'authorId', authorId, 'tagIds', tagIds);
    
    // Find post with author relation
    const post = await this.postRepository.findOne({ 
      where: { id }, 
      relations: ['author', 'tags'] 
    });
    
    if (!post) {
      throw new NotFoundException(`Post not found (id: ${id})`);
    }
    
    // Check if current user is the author
    if (post.author.id !== authorId) {
      throw new UnauthorizedException('You can only update your own posts');
    }
    
    // Update basic fields if provided
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    
    // Update tags if provided
    if (tagIds && tagIds.length > 0) {
      const tags = await this.tagRepository.findBy({ id: In(tagIds) });
      
      // Check if all tags were found
      if (tags.length !== tagIds.length) {
        const foundTagIds = tags.map(tag => tag.id);
        const missingTagIds = tagIds.filter(id => !foundTagIds.includes(id));
        console.warn(`Some tags were not found: ${missingTagIds.join(', ')}`);
      }
      
      post.tags = tags;
    }
    
    // Save and return updated post
    return this.postRepository.save(post);
  }
} 