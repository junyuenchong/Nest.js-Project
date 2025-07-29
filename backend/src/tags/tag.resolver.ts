import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Tag } from './entities/tag.entity';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateTagInput } from './dto/create-tag.input';
import { UpdateTagInput } from './dto/update-tag.input';
import { CreateTagCommand } from './commands/create-tag.command';
import { UpdateTagCommand } from './commands/update-tag.command';
import { DeleteTagCommand } from './commands/delete-tag.command';
import { GetTagsQuery } from './queries/get-tags.query';

@Resolver(() => Tag)
export class TagResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Query(() => [Tag])
  async getTags(): Promise<Tag[]> {
    return this.queryBus.execute(new GetTagsQuery());
  }

  @Query(() => [Tag])
  async tags(): Promise<Tag[]> {
    return this.queryBus.execute(new GetTagsQuery());
  }

  @Mutation(() => Tag)
  async createTag(@Args('input') input: CreateTagInput): Promise<Tag> {
    return this.commandBus.execute(new CreateTagCommand(input.name));
  }

  @Mutation(() => Tag)
  async updateTag(@Args('input') input: UpdateTagInput): Promise<Tag> {
    try {
      console.log('TagResolver: updateTag called with input:', input);
      const result = await this.commandBus.execute(new UpdateTagCommand(input.id, input.name));
      console.log('TagResolver: updateTag result:', result);
      return result;
    } catch (error) {
      console.error('TagResolver: updateTag error:', error);
      throw error;
    }
  }

  @Mutation(() => Boolean)
  async deleteTag(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    return this.commandBus.execute(new DeleteTagCommand(id));
  }
} 