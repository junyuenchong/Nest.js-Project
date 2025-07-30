# JWT Authentication

## File Overview

### `jwt.strategy.ts`
- **Purpose:** Validates JWT tokens and loads user data for authentication
- Checks if token is valid and not expired
- Extracts user ID from token payload
- Finds user in the database
- Returns user object for authenticated requests
- **Token sources:**
  - HTTP cookies (primary)
  - Authorization header (fallback)

### `gql-auth.guard.ts`
- **Purpose:** Enables JWT authentication for GraphQL resolvers
- Extracts HTTP request from GraphQL context for JWT validation
- Uses JWT strategy to validate authentication
- Blocks unauthorized access to protected resolvers
- **Short comment example:**
  - `// Enables JWT auth for GraphQL resolvers`
  - `// Extract HTTP request for JWT validation`

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

## Authentication Flow
1. Client sends request with JWT token (in cookie or Authorization header)
2. `GqlAuthGuard` extracts HTTP request from GraphQL context
3. `JwtStrategy` validates token and loads user
4. If valid, request proceeds; if not, access denied

---

**Tip:**
- Use string-based entity references in TypeORM to avoid circular dependencies.
- Always keep your JWT secrets secure and unique per environment.
- For silent refresh, ensure your frontend handles token refresh automatically on authentication errors. 