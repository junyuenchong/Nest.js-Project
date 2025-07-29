# Simple Blog Management System

A full-stack blog management application built with **NestJS** (backend) and **React** (frontend), featuring secure authentication, GraphQL API, and modern UI.

## 🚀 Features

### Backend (NestJS)
- **GraphQL API** with Apollo Server
- **JWT Authentication** with httpOnly cookies
- **CSRF Protection** for enhanced security
- **MySQL Database** with TypeORM
- **CQRS Pattern** for command/query separation
- **User Management** with profiles and biographies
- **Blog Post Management** with CRUD operations
- **Tag Management** system
- **Database Migrations** with TypeORM

### Frontend (React)
- **Modern React 19** with TypeScript
- **Apollo GraphQL Client** for data fetching
- **Zod Validation** for form handling
- **Tailwind CSS** for responsive design
- **Secure Authentication** flow
- **User Profile Management** with biography
- **Blog Post Editor** with tag selection
- **Tag Management** interface

## 🛠️ Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **GraphQL** - Query language for APIs
- **TypeORM** - Object-Relational Mapping
- **MySQL** - Database
- **JWT** - JSON Web Tokens
- **bcrypt** - Password hashing
- **class-validator** - Validation decorators

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Apollo Client** - GraphQL client
- **Zod** - Schema validation
- **Tailwind CSS** - Utility-first CSS
- **Vite** - Build tool

## 📁 Project Structure

```
simple-blog-management/
├── backend/                            # NestJS GraphQL API (Backend)
│   ├── src/
│   │   ├── auth/                       # Authentication logic (JWT, guards, strategies)
│   │   ├── posts/                      # Blog post CRUD operations
│   │   ├── tags/                       # Tag management modules
│   │   ├── users/                      # User profiles and management
│   │   ├── database/                   # Database entities & migrations
│   │   └── config/                     # Environment & app configuration
│   ├── package.json
│   └── README.md
│
├── frontend/                           # React 19 + TypeScript (Frontend)
│   ├── src/
│   │   ├── api/                        # Apollo GraphQL client setup
│   │   ├── components/                 # Reusable React components
│   │   ├── pages/                      # Page-level components (routes)
│   │   ├── validators/                 # Zod validation schemas
│   │   └── utils/                      # Utility/helper functions
│   ├── public/                         # Static assets (favicon, index.html)
│   ├── package.json
│   └── README.md
│
└── docs/                               # Project documentation (optional)
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **MySQL** 8.0+
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/junyuenchong/Nest.js-Project.git
cd Nest.js-Project
```

### 2. Setup Backend
```bash
cd backend

# Install dependencies
npm install

# Run database migrations
npm run migration:run

# Start development server
npm run start:dev
```

### 3. Setup Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend GraphQL**: http://localhost:3000/graphql
- **GraphQL Playground**: http://localhost:3000/graphql

## 🔧 Environment Configuration

### Backend (.env)
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_usernmae
DB_PASSWORD=your_password
DB_DATABASE=BLOG

# JWT Configuration
JWT_ACCESS_SECRET=your_secure_secret
JWT_REFRESH_SECRET=your_secure_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CSRF Configuration
CSRF_SECRET=your_secure_secret

# Cookie Configuration
COOKIE_ACCESS_TOKEN_NAME=accessToken
COOKIE_REFRESH_TOKEN_NAME=refreshToken
COOKIE_CSRF_TOKEN_NAME=csrfToken
COOKIE_SAME_SITE=strict

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Environment
NODE_ENV=development
```

### Frontend (.env)
```env
# API Configuration
VITE_API_URL=http://localhost:3000/graphql

# Environment
VITE_NODE_ENV=development
```

## 🔐 Security Features

- **JWT Authentication** with secure httpOnly cookies
- **CSRF Protection** for all mutations
- **Password Hashing** with bcrypt
- **Input Validation** with class-validator and Zod
- **CORS Configuration** for cross-origin requests
- **Environment Variable** management for secrets

## 📊 Database Schema

### Users
- `id` (Primary Key)
- `username` (Unique)
- `email` (Unique)
- `password` (Hashed)
- `profile` (One-to-One with UserProfile)

### UserProfiles
- `id` (Primary Key)
- `bio` (Text, max 500 characters)
- `user` (One-to-One with User)

### Posts
- `id` (Primary Key)
- `title` (String)
- `content` (Text)
- `author` (Many-to-One with User)
- `tags` (Many-to-Many with Tags)

### Tags
- `id` (Primary Key)
- `name` (String, Unique)

## 🎯 API Endpoints

### Authentication
- `POST /graphql` - Register user
- `POST /graphql` - Login user
- `POST /graphql` - Logout user
- `POST /graphql` - Refresh token

### User Management
- `GET /graphql` - Get user profile
- `POST /graphql` - Update user profile

### Posts
- `GET /graphql` - Get all posts
- `GET /graphql` - Get user's posts
- `POST /graphql` - Create post
- `PUT /graphql` - Update post
- `DELETE /graphql` - Delete post

### Tags
- `GET /graphql` - Get all tags
- `POST /graphql` - Create tag
- `PUT /graphql` - Update tag
- `DELETE /graphql` - Delete tag


If you have any questions or need assistance, feel free to contact me through [my portfolio website](https://my-portfolio-x38x.vercel.app/).

---

**Happy Blogging! 🚀** 