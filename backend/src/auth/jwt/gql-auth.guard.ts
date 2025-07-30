
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
// Enables JWT auth for GraphQL resolvers
@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
     // Extract HTTP request for JWT validation
    return GqlExecutionContext.create(context).getContext().req;
  }
}