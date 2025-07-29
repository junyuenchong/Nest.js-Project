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
<<<<<<< HEAD
<<<<<<< HEAD
```bash
npm install
=======
      ```bash
      npm install
=======
```bash
npm install
>>>>>>> fedd2f8 (UpdateReadmen)
cp env.example .env
>>>>>>> ce7e1ad (UpdateNewV)
```

### Database Setup
1. Edit `.env` with your MySQL credentials.
2. Run migrations:
   ```bash
   npm run migration:run
   ```

## How to Run the API Locally

<<<<<<< HEAD
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
=======
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
>>>>>>> fedd2f8 (UpdateReadmen)

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
