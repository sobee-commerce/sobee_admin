import {z} from 'zod';

export const replyQuestionFormSchema = z.object({
  content: z.string().min(1).max(500),
});

export type ReplyQuestionForm = z.infer<typeof replyQuestionFormSchema>;

export const deleteQuestionFormSchema = z.string();
