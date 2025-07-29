import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { Post } from './entities/post.entity';
import { Tag } from '../tags/entities/tag.entity';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { PostResolver } from './post.resolver';
import { CreatePostHandler } from './commands/create-post.handler';
import { GetPostsHandler } from './queries/get-posts.handler';
import { UpdatePostHandler } from './commands/update-post.handler';
import { DeletePostHandler } from './commands/delete-post.handler';
import { GetMyPostsHandler } from './queries/get-my-posts.handler';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, Tag]), UsersModule, CqrsModule],
  providers: [PostResolver, CreatePostHandler, GetPostsHandler, UpdatePostHandler, DeletePostHandler, GetMyPostsHandler],
})
export class PostsModule {} 