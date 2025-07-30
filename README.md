# Simple Blog Management System

A full-stack blog management application built with **NestJS** (backend) and **React** (frontend), featuring secure authentication, GraphQL API, and a modern UI.

## 🚀 Features

### Backend (NestJS)
- GraphQL API (Apollo Server)
- JWT authentication (httpOnly cookies)
- CSRF protection
- MySQL with TypeORM
- CQRS pattern (commands/queries)
- User management with profiles and biographies
- Blog post CRUD
- Tag management
- Database migrations

### Frontend (React)
- React 19 + TypeScript
- Apollo GraphQL Client for data fetching
- Zod validation for forms
- Tailwind CSS for responsive design
- Secure authentication flow
- User profile management (with biography)
- Blog post editor with tag selection
- Tag management interface

## 🛠️ Tech Stack

### Backend
- NestJS (latest)
- Apollo Server (GraphQL)
- TypeORM (MySQL 8+)
- JWT (httpOnly cookies), bcrypt
- class-validator
- CQRS pattern

### Frontend
- React 19
- TypeScript
- Apollo Client
- Zod
- Tailwind CSS
- Vite

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/junyuenchong/Nest.js-Project.git
cd Nest.js-Project
```

### 2. Setup Backend
```bash
cd backend
npm install
npm run migration:run
npm run start:dev
```
### 3. Import Database Schema (Optional)

To quickly set up your MySQL database, you can import the prebuilt SQL schema files located in the `schema` directory. This will create all necessary tables and relationships for the application.

### 4. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```


### 5. Access the Application
- Frontend: http://localhost:5173
- Backend GraphQL: http://localhost:3000/graphql

## 🔧 Environment Configuration

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=BLOG
JWT_ACCESS_SECRET=your_secure_secret
JWT_REFRESH_SECRET=your_secure_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CSRF_SECRET=your_secure_secret
COOKIE_ACCESS_TOKEN_NAME=accessToken
COOKIE_REFRESH_TOKEN_NAME=refreshToken
COOKIE_CSRF_TOKEN_NAME=csrfToken
COOKIE_SAME_SITE=strict
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/graphql
VITE_NODE_ENV=development
```

## 🔐 Security Features
- JWT authentication with httpOnly cookies
- CSRF protection for all mutations
- Password hashing with bcrypt
- Input validation with class-validator and Zod
- CORS configuration for cross-origin requests
- Environment variable management for secrets

## 🛡️ What are XSS and CSRF? How Do We Prevent Them?

### What is XSS (Cross-Site Scripting)?
- XSS is an attack where malicious scripts are injected into trusted web pages.
- Attackers use XSS to steal cookies, session tokens, or run unwanted actions as the user.

**How we prevent XSS:**
- All user input is validated and sanitized before saving to the database.
- Sensitive cookies use `httpOnly` and `SameSite=strict` so JavaScript cannot access them.
- The frontend (React) escapes all content by default, preventing script injection.
- Never use `dangerouslySetInnerHTML` unless absolutely necessary and always sanitize content.

### What is CSRF (Cross-Site Request Forgery)?
- CSRF tricks a logged-in user’s browser into sending unwanted requests to a web application.
- This can result in actions being performed as the user without their consent.

**How we prevent CSRF:**
- All sensitive mutations require a valid CSRF token, which is checked by backend middleware.
- CSRF tokens are stored in secure cookies and sent in request headers.
- The backend uses `SameSite=strict` cookies and validates CSRF tokens on every mutation.
- The frontend automatically includes CSRF tokens in requests.

    
## 🎯 API Endpoints

All endpoints are available via GraphQL at `/graphql`.
Use the Playground to explore queries and mutations.

---

**Happy Blogging! 🚀** 
