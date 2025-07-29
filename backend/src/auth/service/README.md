# Auth Service

## `auth.service.ts`

**Function**: Core authentication logic for user validation, password hashing, JWT token management, and user profile operations

### Main Features:

#### User Authentication
- **`validateUser()`** - Check email/password and return user if valid
- **`hashPassword()`** - Hash passwords with bcrypt (salt rounds: 10)

#### JWT Token Management
- **`issueAccessToken()`** - Create short-lived access tokens (15min)
- **`issueRefreshToken()`** - Create long-lived refresh tokens (7 days)
- **`refreshAccessToken()`** - Generate new access token using refresh token
- **`verifyAccessToken()`** - Validate and decode access tokens

#### User Profile Management
- **`updateProfile()`** - Update user profile including bio information
- **`getUserWithProfile()`** - Load user with profile relationship for bio access
- **`createUserProfile()`** - Create UserProfile entry for new users

### Where AuthService is Used:

#### 1. Auth Resolver (`auth.resolver.ts`)
```typescript
// Refresh access tokens
const newAccessToken = await this.authService.refreshAccessToken(refreshToken);

// Update user profile with bio
const updatedUser = await this.authService.updateProfile(userId, input);

// Get user with profile loaded
const userWithProfile = await this.authService.getUserWithProfile(userId);
```

#### 2. Register Handler (`commands/register.handler.ts`)
```typescript
// Hash user passwords during registration
const hashedPassword = await this.authService.hashPassword(password);

// Create user profile automatically
const userProfile = this.userProfileRepository.create({
  user: user,
  bio: undefined, // Default empty bio
});
```

#### 3. Login Handler (`commands/login.handler.ts`)
```typescript
// Validate user credentials
const user = await this.authService.validateUser(email, password);

// Issue JWT tokens
const accessToken = await this.authService.issueAccessToken(user);
const refreshToken = await this.authService.issueRefreshToken(user);
```

#### 4. Auth Module (`auth.module.ts`)
- Registered as provider in AuthModule
- Injected with UserProfile repository for bio operations

### Security Features:
- **Password Hashing**: bcrypt with salt rounds
- **Token Types**: Separate access/refresh token validation
- **Token Expiration**: Configurable via security config
- **Error Handling**: Proper unauthorized exceptions
- **Profile Security**: Only authenticated users can update their own profile

### Profile Management Features:
- **Bio Updates**: Users can set and update their bio
- **Automatic Profile Creation**: UserProfile created during registration
- **Relationship Loading**: Proper loading of UserProfile relationships
- **Data Validation**: Bio length validation (0-500 characters)

### Token Flow:
1. User registers → password hashed → UserProfile created
2. User logs in → credentials validated → tokens issued
3. Access token expires → refresh token used → new access token
4. Invalid tokens → proper error responses
5. Profile updates → bio saved to UserProfile table 