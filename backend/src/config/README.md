# Configuration Guide

## Overview
Central place for all security-related settings: JWT, cookies, CORS, and CSRF protection.

---

## File: `security.config.ts`
- **Purpose:** Single source of truth for backend security configuration
- Reads environment variables from `.env` file
- Provides safe defaults if env vars are missing
- Exports a config object for use throughout the backend

---

## Main Configuration Sections

### JWT Settings
- **Access tokens:** Short-lived (default: 15 min) for API requests
- **Refresh tokens:** Long-lived (default: 7 days) for silent refresh
- **Secrets:** Keys to sign and verify tokens

### Cookie Settings
- **Token cookies:** Store JWT tokens securely (`httpOnly`, `secure`)
- **CSRF cookies:** Store CSRF tokens for form protection
- **Options:** SameSite, domain, and path settings for security

### CORS Settings
- **Origin:** Which frontend URLs can access the backend
- **Credentials:** Allow cookies to be sent with requests
- **Methods/Headers:** Allowed HTTP methods and headers

### CSRF Protection
- **Secret:** Key to generate and verify CSRF tokens
- **Ignore methods:** GET/HEAD/OPTIONS do not require CSRF check

---

## Usage Example
```typescript
import { securityConfig } from './config/security.config';

// Use in JWT strategy
secretOrKey: securityConfig.jwt.accessTokenSecret

// Use in cookie settings
cookieName: securityConfig.cookies.accessTokenName
```

---

## Environment Variables
| Variable              | Purpose                        | Used In                        |
|-----------------------|--------------------------------|--------------------------------|
| `JWT_ACCESS_SECRET`   | Sign access tokens             | `auth.service.ts`, `jwt.strategy.ts` |
| `JWT_REFRESH_SECRET`  | Sign refresh tokens            | `auth.service.ts`              |
| `CSRF_SECRET`         | Generate/verify CSRF tokens    | `csrf.middleware.ts`           |
| `COOKIE_*`            | Cookie names & settings        | `auth.resolver.ts`, `jwt.strategy.ts` |
| `FRONTEND_URL`        | CORS origin                    | `main.ts`                      |
| `NODE_ENV`            | Environment behavior           | `security.config.ts`           |

---

**Tip:**
- Always keep your secrets unique and secure for each environment.
- Adjust CORS and cookie settings for production vs. development as needed.

