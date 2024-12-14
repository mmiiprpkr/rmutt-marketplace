import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
   ...authTables,
   communities: defineTable({
      name: v.string(),
      description: v.optional(v.string()),
      createdAt: v.string(),
      userId: v.id("users"),
   }),
   posts: defineTable({
      userId: v.id("users"),
      title: v.string(),
      likes: v.optional(v.number()),
      postType: v.optional(v.union(v.literal("image"), v.literal("gift"))),
      image: v.optional(v.id("_storage")),
      createdAt: v.string(),
      communityId: v.optional(v.id("communities")),
   }),
   comments: defineTable({
      postId: v.id("posts"),
      content: v.string(),
      author: v.id("users"),
      createdAt: v.string(),
      parentId: v.optional(v.id("comments")),
   }),
   userCommunities: defineTable({
      userId: v.id("users"),
      communityId: v.id("communities"),
   }),
   // Your other tables...
});

export default schema;