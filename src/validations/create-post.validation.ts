import { z } from "zod";

export const createPostValidation = z.object({
   title: z.string().min(1, {
      message: "Create a post with a title",
   }),
   image: z.string().optional(),
   gift: z.string().optional(),
});

export type CreatePostValidation = z.infer<typeof createPostValidation>;