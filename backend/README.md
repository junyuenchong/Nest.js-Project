# Backend – Blog Management System

A secure NestJS GraphQL API for blog management, with JWT authentication, CSRF protection, and MySQL database.

## Features
- GraphQL API (Apollo Server)
- JWT authentication (httpOnly cookies)
- CSRF protection
- MySQL with TypeORM
- CQRS pattern (commands/queries)
- User, post, and tag management
- Database migrations

## Tech Stack
- NestJS
- GraphQL
- TypeORM (MySQL)
- JWT, bcrypt
- class-validator

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8.0+

### Installation
```bash
npm install
cp env.example .env
```

### Database Setup
1. Edit `.env` with your MySQL credentials.
2. Run migrations:
   ```bash
   npm run migration:run
   ```

### Start Server
```bash
npm run start:dev
```
- GraphQL Playground: [http://localhost:3000/graphql](http://localhost:3000/graphql)

## Environment Variables
Example `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=BLOG
JWT_ACCESS_SECRET=your_secure_secret
JWT_REFRESH_SECRET=your_secure_secret
CSRF_SECRET=your_secure_secret
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

## Project Structure
```
backend/
├── src/
│   ├── auth/      # Auth logic
│   ├── posts/     # Blog posts
│   ├── tags/      # Tags
│   ├── users/     # Users & profiles
│   ├── database/  # Migrations
│   ├── middleware/# Middleware
│   └── config/    # Config files
├── package.json
└── README.md
```

## Scripts
- `npm run start:dev` – Start dev server
- `npm run build` – Build for production
- `npm run migration:run` – Run DB migrations
- `npm run test` – Run tests

## API Usage
- All endpoints are available via GraphQL at `/graphql`.
- Use the Playground to explore queries and mutations.

### Example Queries
```graphql
# Register
mutation { register(input: { username: "user", email: "a@b.com", password: "pass" }) { id } }

# Login
mutation { login(input: { email: "a@b.com", password: "pass" }) { accessToken user { id } } }

# Get Profile
query { profile { id username email bio } }

# Create Post
mutation { createPost(input: { title: "Title", content: "Content", tagIds: [] }) { id title } }
```

## Security
- JWT tokens in httpOnly cookies
- CSRF token validation
- Passwords hashed with bcrypt
- Input validation with class-validator

## Contributing
- Use TypeScript best practices
- Keep validation and security in mind
- Write clear, concise code and comments

---

**See the main project README for full-stack setup.**
