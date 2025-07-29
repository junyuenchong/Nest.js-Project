import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards, Logger } from '@nestjs/common';
import { Post } from './entities/post.entity';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { CreatePostCommand } from './commands/create-post.command';
import { UpdatePostCommand } from './commands/update-post.command';
import { DeletePostCommand } from './commands/delete-post.command';
import { GetPostsQuery } from './queries/get-posts.query';
import { GqlAuthGuard } from '../auth/jwt/gql-auth.guard';
import { CurrentUser } from '../auth/getcurrentuser/current-user.decorator';
import { GetMyPostsQuery } from './queries/get-my-posts.query';

@Resolver(() => Post)
export class PostResolver {
  private readonly logger = new Logger(PostResolver.name);

  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  // Get all posts
  @Query(() => [Post])
  async getPosts(): Promise<Post[]> {
    return this.queryBus.execute(new GetPostsQuery());
  }

  // Get posts by current user
  @Query(() => [Post])
  @UseGuards(GqlAuthGuard)
  async myPosts(@CurrentUser() user: any): Promise<Post[]> {
    return this.queryBus.execute(new GetMyPostsQuery(user.id));
  }

  // Create post for user
  @Mutation(() => Post)
  @UseGuards(GqlAuthGuard)
  async createPost(
    @Args('input') input: CreatePostInput,
    @CurrentUser() user: any,
  ): Promise<Post> {
    this.logger.log(`Creating post for user ${user.id} with title "${input.title}"`);
    
    try {
      const result = await this.commandBus.execute(
        new CreatePostCommand(input.title, input.content, user.id, input.tagIds)
      );
      this.logger.log(`Successfully created post with ID ${result.id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to create post: ${error.message}`, error.stack);
      throw error;
    }
  }

  // Update post for user
  @Mutation(() => Post)
  @UseGuards(GqlAuthGuard)
  async updatePost(
    @Args('input') input: UpdatePostInput,
    @CurrentUser() user: any,
  ): Promise<Post> {
    this.logger.log(`Updating post ${input.id} for user ${user.id}`);
    
    try {
      const result = await this.commandBus.execute(
        new UpdatePostCommand(
          input.id,
          input.title ?? '',
          input.content ?? '',
          user.id,
          input.tagIds
        )
      );
      this.logger.log(`Successfully updated post ${input.id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to update post ${input.id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  // Delete post for user
  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deletePost(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: any,
  ): Promise<boolean> {
    this.logger.log(`Deleting post ${id} for user ${user.id}`);
    
    try {
      const result = await this.commandBus.execute(new DeletePostCommand(id, user.id));
      this.logger.log(`Successfully deleted post ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to delete post ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
} 