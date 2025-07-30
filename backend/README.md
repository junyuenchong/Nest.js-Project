# Backend – Blog Management System

A secure NestJS GraphQL API for blog management, with JWT authentication, CSRF protection, and MySQL database.

## Project Overview
- GraphQL API (Apollo Server)
- JWT authentication (httpOnly cookies)
- CSRF protection
- MySQL with TypeORM
- CQRS pattern (commands/queries)
- User, post, and tag management
- Database migrations

## Setup Instructions

### Prerequisites
- Node.js 18+
- MySQL 8.0+

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy the example environment file:
     ```bash
     cp env.example .env
     ```
   - Open `.env` and fill in your configuration (see the "Environment Variables" section below for details).

### Environment Setup

1. **Configure MySQL connection:**
   - In your `.env` file, set `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, and `DB_DATABASE` to match your MySQL setup.

2. **Run database migrations:**
   > **Note:** Make sure the `migration:run` script is present in the `scripts` section of your `backend/package.json` file. If not, add:
   > ```json
   > "migration:run": "ts-node -r tsconfig-paths/register ./src/database/migrations/data-source.ts migration:run"
   > ```
   ```bash
   npm run migration:run
   ```
3. Generate a secure secret for JWT or CSRF in your terminal:
   ```bash
   openssl rand -base64 32
   ```
   Copy the generated string and use it for:
   - `JWT_ACCESS_SECRET`
   - `JWT_REFRESH_SECRET`
   - `CSRF_SECRET`
   in your `.env` file.
   
## Environment Variables
Example `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=BLOG
JWT_ACCESS_SECRET=your_secure_secret
JWT_REFRESH_SECRET=your_secure_secret
CSRF_SECRET=your_secure_secret
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

## Scripts
- `npm run start:dev` – Start dev server
- `npm run build` – Build for production
- `npm run migration:run` – Run DB migrations
- `npm run test` – Run tests

## How to Run the API Locally

- **Development mode:**
  ```bash
  npm run start:dev
  ```
- **Production mode:**
  ```bash
  npm run build
  npm run start:prod
  ```
- **API Playground:**
  - Open [http://localhost:3000/graphql](http://localhost:3000/graphql) in your browser.

## 📋 Sample GraphQL Queries & Mutations

### Register User
```graphql
mutation {
  register(input: { username: "alice", email: "alice@email.com", password: "Password123!" }) {
    id
    username
    email
  }
}
```

### Login
```graphql
mutation {
  login(input: { email: "alice@email.com", password: "Password123!" }) {
    accessToken
    user {
      id
      username
      email
    }
  }
}
```

### Get Profile
```graphql
query {
  profile {
    id
    username
    email
    bio
  }
}
```

### Update Profile (with bio)
```graphql
mutation {
  updateProfile(input: { bio: "I love blogging!" }) {
    id
    username
    email
    bio
  }
}
```

### Create Post
```graphql
mutation {
  createPost(input: { title: "My First Post", content: "Hello world!", tagIds: [1,2] }) {
    id
    title
    content
    tags { id name }
  }
}
```

### Get All Posts
```graphql
query {
  posts {
    id
    title
    content
    author { username }
    tags { name }
  }
}
```

### Create Tag
```graphql
mutation {
  createTag(input: { name: "Tech" }) {
    id
    name
  }
}
```

### Get All Tags
```graphql
query {
  tags {
    id
    name
  }
}
```

## Known Issues & Challenges

- **Switching from REST to GraphQL:**
  - *Challenge:* Adapting to GraphQL's single endpoint and query structure.
  - *Solution:* Used GraphQL Playground, tutorials, and best practices for resolver and CQRS structure.

- **JWT Token Management:**
  - *Challenge:* Handling both access and refresh tokens securely.
  - *Solution:* Used separate secrets, HTTP-only cookies, and automatic token refresh.

- **CSRF Protection:**
  - *Challenge:* Implementing CSRF in GraphQL.
  - *Solution:* Token-based CSRF protection and middleware to validate tokens.

- **Cookie Security:**
  - *Challenge:* Secure cookies for both dev and prod.
  - *Solution:* Used environment-based settings, SameSite, Secure flags, and domain restrictions.

- **TypeORM Relationships:**
  - *Challenge:* Many-to-many setup for posts and tags, and one-to-one for user profiles.
  - *Solution:* Used join tables, cascade options, and string-based references to avoid circular dependencies.

- **User Profile Implementation:**
  - *Challenge:* Implementing one-to-one relationship between User and UserProfile.
  - *Solution:* Created separate UserProfile entity with bio field, automatic profile creation during registration, and proper relationship loading.

- **Environment Variables:**
  - *Challenge:* Managing secrets and config for different environments.
  - *Solution:* `.env` file with unique secrets for each component.

- **Authentication Guard Integration:**
  - *Challenge:* JWT with GraphQL guards.
  - *Solution:* Custom GqlAuthGuard and CurrentUser decorator.

- **CORS Configuration:**
  - *Challenge:* Allowing frontend communication securely.
  - *Solution:* Configured allowed origins and credentials in CORS settings.

- **Migration Generation Issues:**
  - *Challenge:* Circular dependency errors during TypeORM migration generation.
  - *Solution:* Used string-based entity references and manually created migrations when needed.

---

**See the main project README for full-stack setup.**
