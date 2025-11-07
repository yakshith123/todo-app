import { z } from 'zod';

export const todoSchema = z.object({
  text: z.string().min(1, 'To-Do text is required'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
});

export type TodoFormData = z.infer<typeof todoSchema>;
