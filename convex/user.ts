import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const updateFcmToken = mutation({
   args: {
      fcmToken: v.string(),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);
      if (!userId) throw new Error("Unauthorized");

      return await ctx.db.patch(userId, { fcmToken: args.fcmToken });
   },
});

export const currentUser = query({
   args: {},
   handler: async (ctx) => {
      const userId = await getAuthUserId(ctx);

      if (userId === null) {
         return null;
      }

      return await ctx.db.get(userId);
   },
});

export const getUserById = query({
   args: {
      userId: v.id("users"),
   },
   handler: async (ctx, args) => {
      const user = await ctx.db.get(args.userId);
      if (!user) {
         throw new Error("User not found");
      }
      return user;
   },
});

export const updateProfileImage = mutation({
   args: {
      image: v.string(),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }

      return await ctx.db.patch(userId, { image: args.image });
   },
});

export const profileStats = query({
   args: {},
   handler: async (ctx) => {
      const userId = await getAuthUserId(ctx);
      if (!userId) throw new Error("Unauthorized");

      // Get communities user has joined
      const userCommunities = await ctx.db
         .query("userCommunities")
         .filter((q) => q.eq(q.field("userId"), userId))
         .collect();

      // Get communities user has created
      const createdCommunities = await ctx.db
         .query("communities")
         .filter((q) => q.eq(q.field("userId"), userId))
         .collect();

      // Get user's posts
      const posts = await ctx.db
         .query("posts")
         .filter((q) => q.eq(q.field("userId"), userId))
         .collect();

      // Get user's comments
      const comments = await ctx.db
         .query("comments")
         .filter((q) => q.eq(q.field("author"), userId))
         .collect();

      // Get posts user has liked
      const likedPosts = await ctx.db
         .query("likes")
         .filter((q) =>
            q.and(
               q.eq(q.field("userId"), userId),
               q.neq(q.field("postId"), null),
            ),
         )
         .collect();

      // Get saved posts
      const savedPosts = await ctx.db
         .query("savedPosts")
         .filter((q) => q.eq(q.field("userId"), userId))
         .collect();

      return {
         communities: {
            joined: userCommunities.length,
            created: createdCommunities.length,
            total: userCommunities.length + createdCommunities.length,
         },
         engagement: {
            posts: posts.length,
            comments: comments.length,
            likes: likedPosts.length,
            saved: savedPosts.length,
            totalInteractions:
               posts.length + comments.length + likedPosts.length,
         },
      };
   },
});
