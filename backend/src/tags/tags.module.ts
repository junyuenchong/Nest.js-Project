import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { Tag } from './entities/tag.entity';
import { Post } from '../posts/entities/post.entity';
import { TagResolver } from './tag.resolver';
import { CreateTagHandler } from './commands/create-tag.handler';
import { GetTagsHandler } from './queries/get-tags.handler';
import { UpdateTagHandler } from './commands/update-tag.handler';
import { DeleteTagHandler } from './commands/delete-tag.handler';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, Post]), CqrsModule],
  providers: [TagResolver, CreateTagHandler, GetTagsHandler, UpdateTagHandler, DeleteTagHandler],
})
export class TagsModule {} 