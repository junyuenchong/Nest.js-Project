import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { securityConfig } from './config/security.config';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const logger = new Logger('Bootstrap');

    app.use(cookieParser());

    // Add security headers for XSS protection
    app.use((req, res, next) => {
      // XSS Protection
      res.setHeader('X-XSS-Protection', '1; mode=block');
      
      // Content Security Policy
      res.setHeader('Content-Security-Policy', 
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://cdn.jsdelivr.net https://cdn.jsdelivr.net http://gc.kis.v2.scr.kaspersky-labs.com; " +
        "style-src 'self' 'unsafe-inline' fonts.googleapis.com http://cdn.jsdelivr.net https://cdn.jsdelivr.net; " +
        "img-src 'self' data: https: http://cdn.jsdelivr.net https://cdn.jsdelivr.net; " +
        "font-src 'self' fonts.gstatic.com; " +
        "connect-src 'self' http://localhost:3000 http://localhost:5173/; " +
        "frame-ancestors 'none';"
      );
      
      // Prevent MIME type sniffing
      res.setHeader('X-Content-Type-Options', 'nosniff');
      
      // Prevent clickjacking
      res.setHeader('X-Frame-Options', 'DENY');
      
      next();
    });

    // Use global validation pipe for request validation
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        disableErrorMessages: false,
        enableDebugMessages: true,
        skipMissingProperties: false,
        skipNullProperties: false,
        skipUndefinedProperties: false,
        forbidUnknownValues: false,
        stopAtFirstError: false,
      })
    );

    // Enable CORS with custom config
    app.enableCors(securityConfig.cors);

    // Start server
    const port = process.env.PORT || 3000;
    await app.listen(port);

    logger.log(`Application is running on: http://localhost:${port}/graphql`);
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();
