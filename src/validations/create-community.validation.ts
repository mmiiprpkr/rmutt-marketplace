import { z } from "zod";

export const createCommunitySchema = z.object({
   name: z.string({
      required_error: "Name is required"
   }).min(3, {
      message: "Name must be at least 3 characters"
   }).max(255, {
      message: "Name must be at most 255 characters"
   }),
   description: z.string({
      required_error: "Description is required"
   }).min(1, {
      message: "Description is required"
   }).max(255, {
      message: "Description must be at most 255 characters"
   }),
   image: z.string({
      required_error: "Image is required"
   }).min(1, {
      message: "Image is required"
   })
});

export type CreateCommunitySchema = z.infer<typeof createCommunitySchema>;