import { z } from 'zod';

export const postTitleSchema = z
  .string()
  .refine(val => val !== null, { message: 'Title cannot be empty or null' })
  .nonempty('Title cannot be empty or null')
  .min(5, 'Title must be at least 5 characters')
  .max(100, 'Title must be at most 100 characters');

export const postContentSchema = z
  .string()
  .refine(val => val !== null, { message: 'Content cannot be empty or null' })
  .nonempty('Content cannot be empty or null')
  .min(10, 'Content must be at least 10 characters')
  .max(5000, 'Content must be at most 5000 characters');

export const createPostSchema = z.object({
  title: postTitleSchema.refine((val) => val !== null, { message: 'Title cannot be null' }),
  content: postContentSchema.refine((val) => val !== null, { message: 'Content cannot be null' }),
  tagIds: z.array(z.number()).min(1, 'At least one tag must be selected'),
});

export const updatePostSchema = createPostSchema.extend({
  id: z.number(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>; 