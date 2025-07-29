import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMyPostsQuery } from './get-my-posts.query';
import { Post } from '../entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@QueryHandler(GetMyPostsQuery)
export class GetMyPostsHandler implements IQueryHandler<GetMyPostsQuery> {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async execute(query: GetMyPostsQuery): Promise<Post[]> {
    return this.postRepository.find({ where: { author: { id: query.userId } }, relations: ['tags', 'author'] });
  }
} 