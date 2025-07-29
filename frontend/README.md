# Frontend – Blog Management System

A modern React app for blog management with secure authentication, real-time data, and a responsive UI. Built with TypeScript, Apollo GraphQL Client, and Tailwind CSS.

## Project Overview
- Secure authentication (JWT, httpOnly cookies)
- GraphQL data fetching with Apollo Client
- Form validation with Zod
- Responsive UI with Tailwind CSS
- TypeScript for type safety
- User profile management (with biography)
- Blog post and tag management

## Setup Instructions

### Prerequisites
- Node.js 18+
- Backend server running (see backend README)

### Installation
```bash
npm install
cp env.example .env
```

### Environment Variables
Create a `.env` file:
```env
VITE_API_URL=http://localhost:3000/graphql
VITE_NODE_ENV=development
```

## How to Run the App Locally
1. Start the backend server (see backend/README.md)
2. Start the frontend:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:5173](http://localhost:5173)
4. Register or log in, then manage posts and tags

## Known Issues & Challenges

- **GraphQL Integration:**
  - *Challenge:* Migrating from REST/React Query to Apollo Client and GraphQL.
  - *Solution:* Refactored all data fetching to use Apollo hooks and GraphQL queries/mutations.

- **JWT Token Management:**
  - *Challenge:* Securely handling authentication tokens in the frontend.
  - *Solution:* All tokens are managed as httpOnly cookies by the backend; frontend uses `credentials: 'include'`.

- **CSRF Protection:**
  - *Challenge:* Implementing CSRF protection with GraphQL mutations.
  - *Solution:* Backend issues CSRF tokens; frontend includes them in headers automatically.

- **Form Validation Consistency:**
  - *Challenge:* Keeping frontend and backend validation rules in sync.
  - *Solution:* Used Zod schemas in the frontend to match backend validation logic.

- **TypeScript Errors:**
  - *Challenge:* Type mismatches and missing types after Apollo migration.
  - *Solution:* Updated all hooks and components for proper type inference and safety.

---

**Happy blogging!**
