import { z } from 'zod';

const usernamePattern = /^[a-zA-Z0-9_-]+$/;
const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/;
const updatePasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;

export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be at most 20 characters')
  .regex(usernamePattern, 'Username can only contain letters, numbers, underscores, and hyphens');

export const emailSchema = z
  .string()
  .email('Invalid email address')
  .min(5, 'Email must be at least 5 characters')
  .max(50, 'Email must be at most 50 characters');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(
    passwordPattern,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  );

export const updatePasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(
    updatePasswordPattern,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  );

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const bioSchema = z
  .string()
  .max(500, 'Bio must be at most 500 characters')
  .optional();

export const profileUpdateSchema = z.object({
  username: usernameSchema.optional(),
  email: emailSchema.optional(),
  password: updatePasswordSchema.optional(),
  confirmPassword: z.string().optional(),
  bio: bioSchema,
}).refine((data) => {
  if (data.password && data.password.length > 0) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>; 