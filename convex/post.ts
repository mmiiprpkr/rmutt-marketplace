import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
   populateCommentCounts,
   populateUser,
   populateInteractions,
} from "./helper";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getFeed = query({
   args: {
      communityId: v.optional(v.id("communities")),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);
      if (!userId) {
         throw new Error("Unauthorized");
      }

      const userCommunities = await ctx.db
         .query("userCommunities")
         .filter((q) => q.eq(q.field("userId"), userId))
         .collect();

      const userCommunityIds = userCommunities.map((uc) => uc.communityId);

      let posts;

      if (args.communityId) {
         if (!userCommunityIds.includes(args.communityId)) {
            throw new Error("Not a member of this community");
         }

         posts = await ctx.db
            .query("posts")
            .filter((q) => q.eq(q.field("communityId"), args.communityId))
            .order("desc")
            .take(100);
      } else {
         posts = await ctx.db
            .query("posts")
            .filter((q) =>
               q.or(
                  q.eq(q.field("communityId"), undefined),
                  ...userCommunityIds.map((communityId) =>
                     q.eq(q.field("communityId"), communityId)
                  )
               )
            )
            .order("desc")
            .take(100);
      }

      const refactoredPosts = await Promise.all(
         posts.map(async (post) => {
            const interactions = await populateInteractions(ctx, post._id, userId);
            return {
               ...post,
               image: post.image ? await ctx.storage.getUrl(post.image) : null,
               user: await populateUser(ctx, post.userId),
               commentCount: await populateCommentCounts(ctx, post._id),
               ...interactions,
            };
         })
      );

      return refactoredPosts;
   },
});

export const getMyPosts = query({
   args: {},
   handler: async (ctx) => {
      const userId = await getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }

      const posts = await ctx.db
         .query("posts")
         .filter((q) => q.eq(q.field("userId"), userId))
         .collect();

      const refactoredPosts = await Promise.all(
         posts.map(async (post) => {
            const interactions = await populateInteractions(ctx, post._id, userId);
            return {
               ...post,
               image: post.image ? await ctx.storage.getUrl(post.image) : null,
               user: await populateUser(ctx, post.userId),
               commentCount: await populateCommentCounts(ctx, post._id),
               ...interactions,
            };
         })
      );

      return refactoredPosts;
   }
});

export const getSavedPosts = query({
   args: {},
   handler: async (ctx) => {
      const userId = await getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }

      const savedPosts = await ctx.db
         .query("savedPosts")
         .filter((q) => q.eq(q.field("userId"), userId))
         .collect();

      const refactoredPosts = await Promise.all(
         savedPosts.map(async (savedPost) => {
            const post = await ctx.db.get(savedPost.postId);

            if (!post) {
               return null;
            }

            const interactions = await populateInteractions(
               ctx,
               post._id,
               userId
            );

            return {
               ...post,
               image: post.image ? await ctx.storage.getUrl(post.image) : null,
               user: await populateUser(ctx, post.userId),
               commentCount: await populateCommentCounts(ctx, post._id),
               ...interactions,
            };
         })
      );

      // Filter out null values and assert the type
      return refactoredPosts.filter(
         (post): post is NonNullable<typeof post> => post !== null
      );
   },
});

export const likePost = mutation({
   args: {
      postId: v.id("posts"),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }

      const post = await ctx.db.get(args.postId);

      if (!post) {
         throw new Error("Post not found");
      }

      const existingLike = await ctx.db
         .query("likes")
         .filter((q) =>
            q.and(
               q.eq(q.field("postId"), args.postId),
               q.eq(q.field("userId"), userId)
            )
         )
         .first();

      if (existingLike) {
         await ctx.db.delete(existingLike._id);
         return;
      }

      await ctx.db.insert("likes", {
         postId: args.postId,
         userId,
         createdAt: new Date().toISOString(),
      });
   },
});

export const savePost = mutation({
   args: {
      postId: v.id("posts"),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }

      const post = await ctx.db.get(args.postId);

      if (!post) {
         throw new Error("Post not found");
      }

      const existingSave = await ctx.db
         .query("savedPosts")
         .filter((q) =>
            q.and(
               q.eq(q.field("postId"), args.postId),
               q.eq(q.field("userId"), userId)
            )
         )
         .first();

      if (existingSave) {
         await ctx.db.delete(existingSave._id);
         return;
      }

      await ctx.db.insert("savedPosts", {
         postId: args.postId,
         userId,
         createdAt: new Date().toISOString(),
      });
   },
});

export const createPost = mutation({
   args: {
      title: v.string(),
      postType: v.optional(v.union(v.literal("image"), v.literal("gift"))),
      image: v.optional(v.id("_storage")),
      gift: v.optional(v.string()),
      communityId: v.optional(v.id("communities")),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }

      const post = await ctx.db.insert("posts", {
         userId,
         title: args.title,
         createdAt: new Date().toISOString(),
         ...(args.postType && { postType: args.postType }),
         ...(args.image && { image: args.image }),
         ...(args.gift && { gift: args.gift }),
         ...(args.communityId && { communityId: args.communityId }),
      });

      return post;
   },
});