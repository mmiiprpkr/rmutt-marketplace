import { z } from "zod";

export const createPostCommunityValidation = z.object({
   communityId: z.string().min(1, {
      message: "Please select a community",
   }),
   title: z.string().min(1, {
      message: "Create a post with a title",
   }),
   image: z.string().optional(),
   gift: z.string().optional(),
});

export type CreatePostCommunityValidation = z.infer<
   typeof createPostCommunityValidation
>;
