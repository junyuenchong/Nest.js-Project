# Zod Validators

This directory contains Zod validation schemas for form validation with Apollo Client integration.

## Quick Start

1. **Import schema and hook:**
   ```typescript
   import { profileUpdateSchema } from './auth.validator';
   import { useFormValidation } from './hooks/useFormValidation';
   ```

2. **Use in component with real-time validation:**
   ```typescript
   const { errors, validateField, clearFieldError } = useFormValidation(profileUpdateSchema);
   
   // Handle input changes and validate field
   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const { name, value } = e.target;
     setForm(prev => ({ ...prev, [name]: value }));
     validateField(name as keyof typeof form, value); // Validate on change
   };
   
   // Clear field error on focus
   const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
     clearFieldError(e.target.name as keyof typeof form);
   };
   ```

3. **Display errors with styling:**
   ```typescript
   {errors.username && <p className="text-red-600 text-sm">{errors.username}</p>}
   ```

## Available Validators

### Authentication (`auth.validator.ts`)
- **Login**: Email format validation + password required
- **Register**: Username (3-20 chars) + email format + password (min 8 chars)
- **Profile Update**: Username + optional password/bio + password confirmation

### Posts (`post.validator.ts`)
- **Create/Update**: Title (5-100 chars) + content (10-5000 chars) + tag IDs (at least 1 required)

### Tags (`tag.validator.ts`)
- **Create/Update**: Name (2-50 chars, letters/numbers/spaces/underscores/hyphens)

## Hook Methods

- **`validateField(field, value)`** - Validate single field and update errors
- **`clearFieldError(field)`** - Clear specific field error
- **`errors`** - Current validation errors object
- **`validateForm(data)`** - Validate entire form (legacy, not used)

## Usage Examples

**Login Form with Apollo Client:**
```typescript
const { errors, validateField, clearFieldError } = useFormValidation(loginSchema);
const [loginMutation] = useMutation(LOGIN_MUTATION);

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  // Validation happens in handleChange
  loginMutation({ variables: { email, password } });
};
```

**Post Creation with Real-time Validation:**
```typescript
const { errors, validateField } = useFormValidation(createPostSchema);
const [createPost] = useMutation(CREATE_POST_MUTATION);

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setForm(prev => ({ ...prev, [name]: value }));
  validateField(name as keyof typeof form, value); // Real-time validation
};
```

**Profile Update with Bio Field:**
```typescript
const { errors, validateField } = useFormValidation(profileUpdateSchema);

// Handle bio textarea changes
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  setForm(prev => ({ ...prev, [name]: value }));
  validateField(name as keyof typeof form, value);
};
```

## Apollo Client Integration

Validators work seamlessly with GraphQL mutations:

```typescript
// Apollo mutation with validation
const [updateProfile] = useMutation(UPDATE_PROFILE_MUTATION, {
  onCompleted: () => {
    // Success - validation passed
    setMessage('Profile updated successfully!');
  },
  onError: () => {
    // Error - validation or server error
    setMessage('Update failed.');
  },
});

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  // Real-time validation already happened in handleChange
  updateProfile({ variables: { username, password, bio } });
};
```

## Schema Examples

**Profile Update Schema:**
```typescript
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

**Post Creation Schema:**
```typescript
export const createPostSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters'),
  content: z.string()
    .min(10, 'Content must be at least 10 characters')
    .max(5000, 'Content must be less than 5000 characters'),
  tagIds: z.array(z.number())
    .min(1, 'Select at least one tag'),
});
```

## Notes

- **Zod schemas**: All validation uses Zod for type safety and consistency
- **Real-time validation**: Fields validate as user types for better UX
- **Apollo ready**: Designed to work seamlessly with GraphQL mutations
- **TypeScript support**: Full type inference from Zod schemas
- **Error messages**: Customizable in schema definitions
- **Form integration**: Works with all React form components