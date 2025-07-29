# Configuration Guide

## `security.config.ts`

**Function**: Central security settings for JWT, cookies, CORS, and CSRF protection

### How it works:
1. **Reads environment variables** - Gets settings from `.env` file
2. **Provides defaults** - Uses safe defaults if env vars not set
3. **Exports config object** - Single source for all security settings

### Configuration Sections:

#### JWT Settings
- **Access tokens**: Short-lived (15min) for API requests
- **Refresh tokens**: Long-lived (7 days) for getting new access tokens
- **Secrets**: Keys to sign/verify tokens

#### Cookie Settings
- **Token cookies**: Store JWT tokens securely (httpOnly, secure)
- **CSRF cookies**: Store CSRF tokens for form protection
- **Security options**: SameSite, domain, path settings

#### CORS Settings
- **Origin**: Which frontend URLs can access backend
- **Credentials**: Allow cookies to be sent with requests
- **Methods/Headers**: What HTTP methods and headers are allowed

#### CSRF Protection
- **Secret**: Key to generate/verify CSRF tokens
- **Ignore methods**: GET/HEAD/OPTIONS don't need CSRF check

### Usage:
```typescript
import { securityConfig } from './config/security.config';

// Use in JWT strategy
secretOrKey: securityConfig.jwt.accessTokenSecret

// Use in cookie settings
cookieName: securityConfig.cookies.accessTokenName
```

### Environment Variables:
| Variable | Purpose | Used In |
|----------|---------|---------|
| `JWT_ACCESS_SECRET` | Sign access tokens | `auth.service.ts`, `jwt.strategy.ts` |
| `JWT_REFRESH_SECRET` | Sign refresh tokens | `auth.service.ts` |
| `CSRF_SECRET` | Generate/verify CSRF tokens | `csrf.middleware.ts` |
| `COOKIE_*` | Cookie names & settings | `auth.resolver.ts`, `jwt.strategy.ts` |
| `FRONTEND_URL` | CORS origin | `main.ts` |
| `NODE_ENV` | Environment behavior | `security.config.ts` |

