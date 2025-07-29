import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { TagsModule } from './tags/tags.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { UserProfile } from './users/entities/user-profile.entity';
import { Tag } from './tags/entities/tag.entity';
import { Post } from './posts/entities/post.entity';
import { CsrfMiddleware } from './middleware/csrf.middleware';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
      context: ({ req, res }) => ({ req, res }),
      playground: true,
      introspection: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'admin',
      database: process.env.DB_DATABASE || 'BLOG',
      entities: [User, UserProfile, Post, Tag],
      // synchronize: true,
      // dropSchema: true, 
    }),
    UsersModule,
    PostsModule,
    TagsModule,
    AuthModule,
    CqrsModule,
  ],
  controllers: [],
  providers: [],
})
// Main app module: sets up CSRF middleware and routes
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CsrfMiddleware)
      .exclude(
        { path: 'graphql', method: RequestMethod.GET }, // Allow GraphQL introspection
        { path: 'graphql', method: RequestMethod.OPTIONS }, // Allow preflight requests
      )
      .forRoutes('*');
  }
}
