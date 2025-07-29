import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';
import { UserResolver } from './user.resolver';
import { GetUserHandler } from './queries/get-user.handler';
// import { GetUsersHandler } from './queries/get-users.handler';
import { UpdateUserHandler } from './commands/update-user.handler';
import { DeleteUserHandler } from './commands/delete-user.handler';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserProfile]), CqrsModule],
  providers: [UserResolver, GetUserHandler, UpdateUserHandler, DeleteUserHandler],
})
export class UsersModule {}