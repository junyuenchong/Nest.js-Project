# Current User Decorator

## `current-user.decorator.ts`

**Function**: Extracts authenticated user from GraphQL requests

### How it works:
1. **Creates parameter decorator** - Can be used in resolver methods
2. **Extracts GraphQL context** - Gets request from GraphQL execution context
3. **Returns user object** - Returns the authenticated user from `req.user`

### Usage:
```typescript
@Query()
@UseGuards(GqlAuthGuard)
getMyProfile(@CurrentUser() user: User) {
  return user;
}
```

### Flow:
1. JWT strategy validates token and sets `req.user`
2. CurrentUser decorator extracts user from GraphQL context
3. Resolver receives user object automatically

### Benefits:
- Clean, reusable way to get authenticated user
- No need to manually extract from context in each resolver
- Type-safe user object injection 