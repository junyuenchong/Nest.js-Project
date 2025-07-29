import { z } from 'zod';

export const tagNameSchema = z
  .string()
  .min(2, 'Tag name must be at least 2 characters')
  .max(50, 'Tag name must be at most 50 characters')
  .regex(/^[a-zA-Z0-9\s_-]+$/, 'Tag name can only contain letters, numbers, spaces, underscores, and hyphens');

export const createTagSchema = z.object({
  name: tagNameSchema,
});

export const updateTagSchema = z.object({
  id: z.number(),
  name: tagNameSchema.optional(),
});

export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>; 