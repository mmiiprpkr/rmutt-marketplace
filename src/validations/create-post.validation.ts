import { z } from "zod";

export const createPostValidation = z.object({
   title: z
      .string({
         required_error: "Title is required",
      })
      .min(1, {
         message: "Create a post with a title",
      }),
   image: z.string().optional(),
   gift: z.string().optional(),
});

export type CreatePostValidation = z.infer<typeof createPostValidation>;
