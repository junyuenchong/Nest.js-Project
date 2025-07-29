# Frontend - Blog Management System

## Project Overview

A modern React application for blog management with secure authentication and real-time data management. Built with TypeScript, Apollo GraphQL Client, and Tailwind CSS.

### Key Features
- **Secure Authentication**: Backend-managed JWT tokens with httpOnly cookies
- **GraphQL Integration**: Real-time data fetching with Apollo Client
- **Form Validation**: Zod schemas matching backend validation rules
- **Responsive Design**: Modern UI with Tailwind CSS
- **Type Safety**: Full TypeScript implementation

### Tech Stack
- **React 19** with TypeScript
- **Apollo GraphQL Client** for data fetching and state management
- **Zod** for form validation
- **Tailwind CSS** for styling
- **Vite** for build tooling

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- Backend server running (see backend README)

### Installation
```bash
# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Start development server
npm run dev
```

### Environment Configuration
Create `.env` file in frontend directory:
```env
# API Configuration
VITE_API_URL=http://localhost:3000/graphql

# Environment
VITE_NODE_ENV=development
```

## How to Run Locally

### 1. Start Backend Server
```bash
cd ../backend
npm install
npm run start:dev
```
Backend runs on `http://localhost:3000`

### 2. Start Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

### 3. Access Application
- Open `http://localhost:5173`
- Register new account or login
- Start creating posts and tags

## GraphQL Integration

### Apollo Client Setup
```typescript
// src/api/graphqlClient.ts
const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
});
```

### Apollo Provider Setup
```typescript
// src/main.tsx
import { ApolloProvider } from '@apollo/client';
import client from './api/graphqlClient';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
)
```

### Sample Queries and Mutations

#### Login User
```graphql
mutation Login($email: String!, $password: String!) {
  login(input: { email: $email, password: $password }) {
    accessToken
    user {
      id
      username
      email
    }
  }
}
```

#### Register User
```graphql
mutation Register($username: String!, $email: String!, $password: String!) {
  register(input: { username: $username, email: $email, password: $password }) {
    user {
      id
      username
      email
    }
  }
}
```

#### Get User Profile
```graphql
query Profile {
  profile {
    id
    username
    email
    bio
  }
}
```

#### Update Profile
```graphql
mutation UpdateProfile($username: String, $password: String, $bio: String) {
  updateProfile(input: { username: $username, password: $password, bio: $bio }) {
    id
    username
    email
    bio
  }
}
```

#### Get User Posts
```graphql
query MyPosts {
  myPosts {
    id
    title
    content
    tags { 
      id 
      name 
    }
  }
}
```

#### Create Post
```graphql
mutation CreatePost($title: String!, $content: String!, $tagIds: [Int!]!) {
  createPost(input: { title: $title, content: $content, tagIds: $tagIds }) {
    id
    title
    content
    tags { id name }
  }
}
```

#### Update Post
```graphql
mutation UpdatePost($id: Int!, $title: String!, $content: String!, $tagIds: [Int!]!) {
  updatePost(input: { id: $id, title: $title, content: $content, tagIds: $tagIds }) {
    id
    title
    content
    tags { id name }
  }
}
```

#### Delete Post
```graphql
mutation DeletePost($id: Int!) {
  deletePost(id: $id)
}
```

#### Get Tags
```graphql
query GetTags {
  tags {
    id
    name
  }
}
```

#### Create Tag
```graphql
mutation CreateTag($name: String!) {
  createTag(input: { name: $name }) {
    id
    name
  }
}
```

### Apollo Hooks Usage

#### Using useQuery
```typescript
const { data, loading, error, refetch } = useQuery(PROFILE_QUERY, {
  context: { headers: { Authorization: `Bearer ${token}` } },
  fetchPolicy: 'network-only',
});
```

#### Using useMutation
```typescript
const [updateProfile, { loading, error }] = useMutation(UPDATE_PROFILE_MUTATION, {
  context: { headers: { Authorization: `Bearer ${token}` } },
  onCompleted: () => {
    // Handle success
  },
  onError: () => {
    // Handle error
  },
});
```

### Form Validation with Zod
```typescript
// src/validators/auth.validator.ts
export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

export const profileUpdateSchema = z.object({
  username: z.string().min(1, 'Username required'),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
}).refine((data) => {
  if (data.password || data.confirmPassword) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
```

## Challenges Faced & Solutions

### 1. **Migration from React Query to Apollo Client**
**Challenge**: Complete migration from React Query to Apollo Client for GraphQL operations
**Solution**: 
- Replaced all React Query hooks with Apollo's `useQuery` and `useMutation`
- Updated all API calls to use GraphQL queries and mutations
- Removed all React Query dependencies and configurations
- Maintained same functionality with better GraphQL integration

### 2. **JWT Token Management**
**Challenge**: Managing JWT tokens securely in frontend
**Solution**: 
- Removed all frontend JWT handling
- Backend sets secure httpOnly cookies
- Frontend uses `credentials: 'include'` for automatic cookie sending

### 3. **CSRF Protection**
**Challenge**: Implementing CSRF protection with GraphQL
**Solution**:
- Backend generates CSRF tokens
- Frontend includes tokens in headers automatically
- Middleware validates tokens on mutations

### 4. **Form Validation Consistency**
**Challenge**: Keeping frontend and backend validation in sync
**Solution**:
- Used Zod schemas matching backend class-validator rules
- Aligned all validation rules (length, patterns, types)
- Single source of truth for validation logic

### 5. **GraphQL Schema Updates**
**Challenge**: Schema not reflecting backend changes
**Solution**:
- Backend auto-generates schema on startup
- Frontend queries match backend resolver structure
- Proper TypeScript types for all operations

### 6. **Authentication State Management**
**Challenge**: Managing authentication without token storage
**Solution**:
- Simple boolean state for authentication
- Backend handles all token lifecycle
- Automatic cookie-based authentication

### 7. **TypeScript Error Resolution**
**Challenge**: Multiple TypeScript errors after Apollo migration
**Solution**:
- Systematically removed unused imports and variables
- Fixed interface mismatches between components
- Updated prop types to match actual usage
- Ensured all Apollo hooks are properly typed

## Project Structure
```
frontend/
├── src/
│   ├── api/           # Apollo Client setup & GraphQL operations
│   │   ├── graphqlClient.ts  # Apollo Client configuration
│   │   ├── auth.ts           # Legacy API functions (unused)
│   │   ├── postApi.ts        # Legacy API functions (unused)
│   │   └── tagApi.ts         # Legacy API functions (unused)
│   ├── components/    # React components
│   │   ├── Auth/     # Login, Register, Profile forms
│   │   ├── Posts/    # Post creation and listing
│   │   ├── Tags/     # Tag management
│   │   └── Navigation/
│   ├── validators/   # Zod validation schemas
│   │   └── hooks/    # Custom validation hooks
│   └── utils/        # Utility functions
├── public/           # Static assets
└── package.json
```

## Security Features
- **httpOnly Cookies**: Backend manages all tokens securely
- **CSRF Protection**: Automatic token validation
- **Form Validation**: Client-side validation with Zod
- **Type Safety**: Full TypeScript implementation
- **XSS Protection**: No client-side token storage

## Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
npx tsc --noEmit    # TypeScript type checking
```

## Migration Summary

### From React Query to Apollo Client
- **Removed**: All React Query dependencies and configurations
- **Added**: Apollo Client setup with proper caching
- **Updated**: All data fetching to use GraphQL queries
- **Improved**: Better GraphQL integration and type safety

### Key Changes
1. **Data Fetching**: `useQuery` from React Query → `useQuery` from Apollo Client
2. **Mutations**: `useMutation` from React Query → `useMutation` from Apollo Client
3. **Caching**: React Query cache → Apollo Client InMemoryCache
4. **Error Handling**: React Query error handling → Apollo Client error handling
5. **Type Safety**: Enhanced with proper GraphQL types

## Known Issues
- None currently - all major challenges resolved
- Backend handles all security concerns
- Frontend focuses purely on UI/UX
- All TypeScript errors resolved

## Contributing
1. Follow TypeScript best practices
2. Use Zod for all form validation
3. Keep GraphQL queries optimized
4. Maintain responsive design with Tailwind
5. Test authentication flows thoroughly
6. Use Apollo Client hooks for all data operations
