# Zod Validators

This directory contains Zod validation schemas and hooks for form validation in the frontend React app.

## Quick Start

1. **Import a schema and the validation hook:**
   ```typescript
   import { profileUpdateSchema } from './auth.validator';
   import { useFormValidation } from './hooks/useFormValidation';
   ```

2. **Use in your component:**
   ```typescript
   const { errors, validateField, clearFieldError } = useFormValidation(profileUpdateSchema);

   // On input change
   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
     const { name, value } = e.target;
     setForm(prev => ({ ...prev, [name]: value }));
     validateField(name as keyof typeof form, value);
   };

   // On input focus
   const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
     clearFieldError(e.target.name as keyof typeof form);
   };
   ```

3. **Display errors:**
   ```typescript
   {errors.username && <p className="text-red-600 text-sm">{errors.username}</p>}
   ```

## Available Validators

- **Authentication (`auth.validator.ts`):**
  - Login: Email + password
  - Register: Username, email, password, confirm password
  - Profile update: Username, optional password/bio, confirm password

- **Posts (`post.validator.ts`):**
  - Create/Update: Title, content, tag IDs

- **Tags (`tag.validator.ts`):**
  - Create/Update: Name

## Hook Methods

- `validateField(field, value)` – Validate a single field
- `clearFieldError(field)` – Clear a specific field error
- `errors` – Current validation errors object
- `validateForm(data)` – Validate the entire form

## Usage Example

**Login Form:**
```typescript
const { errors, validateField, clearFieldError } = useFormValidation(loginSchema);

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setForm(prev => ({ ...prev, [name]: value }));
  validateField(name as keyof typeof form, value);
};
```

**Profile Update with Bio:**
```typescript
const { errors, validateField } = useFormValidation(profileUpdateSchema);

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  setForm(prev => ({ ...prev, [name]: value }));
  validateField(name as keyof typeof form, value);
};
```

## Notes

- All validation uses Zod for type safety and consistency.
- Real-time validation for better UX.
- Designed to work seamlessly with Apollo GraphQL mutations.
- Full TypeScript support and type inference.
- Customizable error messages in schemas.