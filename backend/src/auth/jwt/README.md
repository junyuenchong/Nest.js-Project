# JWT Authentication

## Files Overview

### `jwt.strategy.ts`
**Function**: Validates JWT tokens and loads user data
- Checks if token is valid (not expired)
- Extracts user ID from token
- Finds user in database
- Returns user object for authenticated requests

**Token Sources**:
- HTTP cookies (primary)
- Authorization header (fallback)

### `gql-auth.guard.ts`
**Function**: Protects GraphQL endpoints
- Extracts request from GraphQL context
- Uses JWT strategy to validate authentication
- Blocks unauthorized access to protected resolvers

## Where JWT Strategy is Used

### 1. Auth Module (`auth.module.ts`)
```typescript
import { JwtStrategy } from './jwt/jwt.strategy';
// Registered as provider in AuthModule
```

### 2. GraphQL Guards
- `GqlAuthGuard` uses JWT strategy internally
- Applied to protected GraphQL resolvers

### 3. Protected Endpoints
- User profile queries
- Post management (create, update, delete)
- Tag management
- User management

## Flow
1. Client sends request with JWT token
2. `GqlAuthGuard` extracts request from GraphQL context
3. `JwtStrategy` validates token and loads user
4. If valid, request proceeds; if not, access denied 