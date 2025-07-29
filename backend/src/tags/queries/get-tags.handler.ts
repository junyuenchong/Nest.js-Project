import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTagsQuery } from './get-tags.query';
import { Tag } from '../entities/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Get Tags handler: gets  all tags
@QueryHandler(GetTagsQuery)
export class GetTagsHandler implements IQueryHandler<GetTagsQuery> {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async execute(query: GetTagsQuery): Promise<Tag[]> {
    return this.tagRepository.find({ relations: ['posts'] });
  }
} 