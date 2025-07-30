# Auth Service

## Overview
Handles all authentication logic: user validation, password hashing, JWT token management, and user profile operations.

---

## Main Features

### User Authentication
- **validateUser(email, password):** Check credentials and return user if valid
- **hashPassword(password):** Hash passwords securely with bcrypt

### JWT Token Management
- **issueAccessToken(user):** Create short-lived access tokens (default: 15 min)
- **issueRefreshToken(user):** Create long-lived refresh tokens (default: 7 days)
- **refreshAccessToken(refreshToken):** Generate new access token using a valid refresh token
- **verifyAccessToken(token):** Validate and decode access tokens

### User Profile Management
- **updateProfile(userId, input):** Update user profile (e.g., bio)
- **getUserWithProfile(userId):** Load user with profile relationship
- **createUserProfile(user):** Create UserProfile for new users

---

## Where AuthService is Used

- **Auth Resolver (`auth.resolver.ts`):**
  - Refresh tokens, update profile, get user with profile
- **Register Handler (`commands/register.handler.ts`):**
  - Hash password, create user profile
- **Login Handler (`commands/login.handler.ts`):**
  - Validate credentials, issue tokens
- **Auth Module (`auth.module.ts`):**
  - Registered as a provider and injected with repositories

---

## Security Highlights
- Passwords hashed with bcrypt (salt rounds: 10)
- Separate access and refresh token validation
- Token expiration configurable in security config
- Unauthorized exceptions for invalid credentials or tokens
- Only authenticated users can update their own profile

---

## Profile Management
- Users can set and update their bio (0-500 characters)
- UserProfile automatically created during registration
- Proper loading of UserProfile relationships

---

## Token Flow
1. **Register:** Password hashed, UserProfile created
2. **Login:** Credentials validated, tokens issued
3. **Access token expires:** Refresh token used to get new access token
4. **Invalid tokens:** Proper error responses
5. **Profile updates:** Bio saved to UserProfile table

---

**Tip:**
- Keep JWT secrets secure and unique per environment
- Use string-based entity references in TypeORM to avoid circular dependencies
- For silent refresh, ensure the frontend handles token refresh automatically on authentication errors 