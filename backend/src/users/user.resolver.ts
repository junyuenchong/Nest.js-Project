import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
// import { CreateUserCommand } from './commands/create-user.command';
import { UpdateUserInput } from './dto/update-user.input';
import { UpdateUserCommand } from './commands/update-user.command';
import { DeleteUserCommand } from './commands/delete-user.command';
import { GetUserQuery } from './queries/get-user.query';
// import { GetUsersQuery } from './queries/get-users.query';
import { GqlAuthGuard } from '../auth/jwt/gql-auth.guard';
import { CurrentUser } from '../auth/getcurrentuser/current-user.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  // Get user by ID
  @Query((returns) => User, { nullable: true})
  async getUser(@Args('id', { type: () => Int }) id: number): Promise<User | null> {
    return this.queryBus.execute(new GetUserQuery(id));
  }

  // Update user
  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async updateUser(
    @Args('input') input: UpdateUserInput,
    @CurrentUser() user: any,
  ): Promise<User> {
    return this.commandBus.execute(
      new UpdateUserCommand(input.id, input.username, input.password, user.id)
    );
  }

  // Delete user
  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteUser(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: any,
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteUserCommand(id, user.userId));
  }
} 