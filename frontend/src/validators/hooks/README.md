# Custom React Hooks

This directory contains reusable React hooks for form validation and data management.

## useFormValidation

A form validation hook that uses Zod schemas for type-safe validation with Apollo Client integration.

### Basic Usage

```typescript
import { useFormValidation } from './useFormValidation';
import { profileUpdateSchema } from '../auth.validator';

function ProfileForm() {
  // Initialize validation with Zod schema
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

  return (
    <form onSubmit={handleSubmit}>
      <input 
        name="username" 
        onChange={handleChange}
        onFocus={handleFocus}
      />
      {errors.username && <p className="text-red-600">{errors.username}</p>}
    </form>
  );
}
```

### Available Methods

- **`validateField(field, value)`**: Validates a single field and updates errors
- **`clearFieldError(field)`**: Clears error for a specific field
- **`errors`**: Object containing current validation errors
- **`validateForm(data)`**: Validates entire form (legacy, not used in current implementation)

### Key Features

- **Real-time validation**: Fields validate as user types
- **Zod integration**: Type-safe validation with detailed error messages
- **Apollo Client ready**: Works seamlessly with GraphQL mutations
- **Error management**: Automatic error state handling
- **TypeScript support**: Full type inference from Zod schemas

### Current Validation Schemas

#### Authentication (`auth.validator.ts`)
- **Login**: Email format, password required
- **Register**: Username (3-20 chars), email format, password (min 8 chars)
- **Profile Update**: Username, optional password/bio, password confirmation

#### Posts (`post.validator.ts`)
- **Title**: 5-100 characters, required
- **Content**: 10-5000 characters, required
- **Tag IDs**: Array of numbers, at least one required

#### Tags (`tag.validator.ts`)
- **Tag Name**: 2-50 chars, letters/numbers/spaces/underscores/hyphens

### Where it's used

- **LoginForm.tsx**: Email/password validation
- **RegisterForm.tsx**: Username/email/password validation
- **ProfileForm.tsx**: Profile update validation with bio field
- **PostForm.tsx**: Post title/content/tags validation
- **TagForm.tsx**: Tag name validation

### Apollo Client Integration

The hook works seamlessly with Apollo Client mutations:

```typescript
// Apollo mutation with validation
const [updateProfile] = useMutation(UPDATE_PROFILE_MUTATION, {
  onCompleted: () => {
    // Success - validation passed
  },
  onError: () => {
    // Error - validation or server error
  },
});

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  // Validation happens in handleChange
  updateProfile({ variables: { username, password, bio } });
};
```

### Adding a New Schema

1. **Create schema** in `validators/` (e.g., `newFeature.validator.ts`)
2. **Export Zod schema** with proper validation rules
3. **Import and use** with `useFormValidation` in your component

### Example Schema

```typescript
import { z } from 'zod';

// Define validation schema
export const commentSchema = z.object({
  content: z.string()
    .min(1, 'Comment cannot be empty')
    .max(500, 'Comment too long'),
  rating: z.number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),
});

// TypeScript type from schema
export type CommentInput = z.infer<typeof commentSchema>;
```

### Notes

- **Zod schemas**: All validation uses Zod for consistency
- **Real-time UX**: Fields validate as user types for better experience
- **Error messages**: Customizable in Zod schema definitions
- **Type safety**: Full TypeScript support with inferred types
- **Apollo ready**: Designed to work with GraphQL mutations 