import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as csrf from 'csrf';
import { securityConfig } from '../config/security.config';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  private tokens = new csrf();

  use(req: Request, res: Response, next: NextFunction) {
    // Skip CSRF check for safe methods
    if (securityConfig.csrf.ignoreMethods.includes(req.method)) {
      return next();
    }

    // Skip CSRF check for GraphQL introspection queries
    if (req.body?.query?.includes('IntrospectionQuery')) {
      return next();
    }

    // Skip CSRF check for authentication mutations (register, login)
    if (req.body?.query?.includes('mutation') && 
        (req.body.query.includes('register') || req.body.query.includes('login'))) {
      return next();
    }

    // Skip CSRF check for getCsrfToken query
    if (req.body?.query?.includes('getCsrfToken')) {
      return next();
    }

    // Get CSRF token from header or cookie
    const csrfToken = req.headers['x-csrf-token'] as string || req.cookies[securityConfig.cookies.csrfTokenName];
    
    if (!csrfToken) {
      throw new UnauthorizedException('CSRF token missing');
    }

    // Verify CSRF token
    if (!this.tokens.verify(securityConfig.csrf.secret, csrfToken)) {
      throw new UnauthorizedException('Invalid CSRF token');
    }

    next();
  }

  // Generate new CSRF token
  generateToken(): string {
    return this.tokens.create(securityConfig.csrf.secret);
  }

  // Verify CSRF token
  verifyToken(token: string): boolean {
    return this.tokens.verify(securityConfig.csrf.secret, token);
  }
} 