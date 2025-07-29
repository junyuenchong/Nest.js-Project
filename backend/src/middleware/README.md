# CSRF Middleware

**File location:**
```
src/middleware/csrf.middleware.ts
```

## What does this file do?
This middleware protects your API from CSRF (Cross-Site Request Forgery) attacks. It checks incoming requests for a valid CSRF token before allowing any sensitive actions, like creating or updating data.

## How does it work?
- For most requests, it looks for a CSRF token in the request headers or cookies.
- If the token is missing or invalid, the request is blocked.
- Some requests (like safe GETs, GraphQL introspection, or login/register) are allowed through without a CSRF check.
- The middleware can also generate new CSRF tokens for the frontend to use.

## Where is it used?
This middleware is registered in your main app setup (usually in `main.ts` or a module) so that every incoming request passes through it. It helps keep your API safe from malicious cross-site requests.

---
**In short:**
- Checks for a CSRF token on important requests
- Blocks requests with missing or invalid tokens
- Lets you generate new tokens for the frontend
- Keeps your API safer and more secure 