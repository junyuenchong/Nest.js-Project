// Security configuration for JWT, cookies, CORS, and CSRF.
// Edit environment variables to change settings for production or development.

const isDevelopment = process.env.NODE_ENV !== 'production';

export const securityConfig = {
  // JWT token settings
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_SECRET || 'your-access-secret-key', // Secret for access tokens
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key', // Secret for refresh tokens
    accessTokenExpiresIn: isDevelopment ? '1h' : (process.env.JWT_ACCESS_EXPIRES_IN || '15m'), // Longer in development
    refreshTokenExpiresIn: isDevelopment ? '30d' : (process.env.JWT_REFRESH_EXPIRES_IN || '7d'), // Longer in development
  },

  // Cookie settings for tokens and CSRF
  cookies: {
    accessTokenName: process.env.COOKIE_ACCESS_TOKEN_NAME || 'accessToken', // Name for access token cookie
    refreshTokenName: process.env.COOKIE_REFRESH_TOKEN_NAME || 'refreshToken', // Name for refresh token cookie
    csrfTokenName: process.env.COOKIE_CSRF_TOKEN_NAME || 'csrfToken', // Name for CSRF token cookie
    options: {
      httpOnly: true, // Cookie not accessible by JS
      secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
      sameSite: (process.env.COOKIE_SAME_SITE as 'strict' | 'lax' | 'none') || 'lax', // Use 'lax' for development
      maxAge: isDevelopment ? 30 * 24 * 60 * 60 * 1000 : parseInt(process.env.COOKIE_MAX_AGE || '604800000'), // 30 days in development
      path: process.env.COOKIE_PATH || '/', // Cookie path
      domain: process.env.NODE_ENV === 'production' ? process.env.DOMAIN : undefined, // Set domain in production
    },
    csrfOptions: {
      httpOnly: false, // CSRF token accessible by JS
      secure: process.env.NODE_ENV === 'production',
      sameSite: (process.env.COOKIE_SAME_SITE as 'strict' | 'lax' | 'none') || 'lax',
      maxAge: isDevelopment ? 30 * 24 * 60 * 60 * 1000 : parseInt(process.env.COOKIE_CSRF_MAX_AGE || '86400000'), // 30 days in development
      path: process.env.COOKIE_PATH || '/',
      domain: process.env.NODE_ENV === 'production' ? process.env.DOMAIN : undefined,
    },
  },

  // CORS settings for frontend-backend communication
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Allowed frontend URL
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'], // Allowed headers
  },

  // CSRF protection settings
  csrf: {
    secret: process.env.CSRF_SECRET || 'your-csrf-secret-key', // Secret for CSRF token generation
    ignoreMethods: ['GET', 'HEAD', 'OPTIONS'], // Methods that skip CSRF check
  },
};