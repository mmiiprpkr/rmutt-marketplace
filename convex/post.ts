import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
   populateCommentCounts,
   populateUser,
   populateInteractions,
   populateCommunity,
} from "./helper";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";

export const getFeed = query({
   args: {
      communityId: v.optional(v.id("communities")),
      paginationOpts: paginationOptsValidator,
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
         posts = await ctx.db
            .query("posts")
            .filter((q) => q.eq(q.field("communityId"), args.communityId))
            .order("desc")
            .paginate(args.paginationOpts);
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
            .paginate(args.paginationOpts);
      }

      const refactoredPosts = await Promise.all(
         posts.page.map(async (post) => {
            const interactions = await populateInteractions(ctx, post._id, userId);
            return {
               ...post,
               user: await populateUser(ctx, post.userId),
               commentCount: await populateCommentCounts(ctx, post._id),
               community: post?.communityId
                  ? await populateCommunity(ctx, post.communityId)
                  : null,
               ...interactions,
            };
         })
      );

      return {
         ...posts,
         page: refactoredPosts,
      };
   },
});

export const getMyPosts = query({
   args: {
      userId: v.optional(v.id("users")),
      paginationOpts: paginationOptsValidator,
   },
   handler: async (ctx, args) => {
      const userId = args.userId || await getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }

      const posts = await ctx.db
         .query("posts")
         .filter((q) => q.eq(q.field("userId"), userId))
         .order("desc")
         .paginate(args.paginationOpts);

      const refactoredPosts = await Promise.all(
         posts.page.map(async (post) => {
            const interactions = await populateInteractions(ctx, post._id, userId);
            return {
               ...post,
               user: await populateUser(ctx, post.userId),
               commentCount: await populateCommentCounts(ctx, post._id),
               community: post?.communityId
                  ? await populateCommunity(ctx, post.communityId)
                  : null,
               ...interactions,
            };
         })
      );

      return {
         ...posts,
         page: refactoredPosts,
      };
   }
});

export const getPostById = query({
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

      return post;
   },
});

export const updatePost = mutation({
   args: {
      postId: v.id("posts"),
      content: v.string(),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }

      const post = await ctx.db.query("posts")
         .filter(q =>
            q.and(
               q.eq(q.field("userId"), userId),
               q.eq(q.field("_id"), args.postId)
            )
         )
         .first();

      if (!post) {
         throw new Error("Post not found");
      }

      return await ctx.db.patch(post._id, {
         title: args.content,
      });
   }
})

export const deletePost = mutation({
   args: {
      postId: v.id("posts"),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }

      const post = await ctx.db.query("posts")
         .filter(q =>
            q.and(
               q.eq(q.field("userId"), userId),
               q.eq(q.field("_id"), args.postId)
            )
         )
         .first();

      if (!post) {
         throw new Error("Post not found");
      }

      await ctx.db.delete(post._id);
   }
})

export const getSavedPosts = query({
   args: {
      paginationOpts: paginationOptsValidator,
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }

      const savedPosts = await ctx.db
         .query("savedPosts")
         .filter((q) => q.eq(q.field("userId"), userId))
         .paginate(args.paginationOpts);

      const refactoredPosts = await Promise.all(
         savedPosts.page.map(async (savedPost) => {
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
               user: await populateUser(ctx, post.userId),
               commentCount: await populateCommentCounts(ctx, post._id),
               community: post?.communityId ? await populateCommunity(ctx, post.communityId) : null,
               ...interactions,
            };
         })
      );

      // Filter out null values and assert the type
      return {
         ...savedPosts,
         page: refactoredPosts,
      }
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
      image: v.optional(v.string()),
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
         ...(args.image && { image: args.image }),
         ...(args.gift && { gift: args.gift }),
         ...(args.communityId && { communityId: args.communityId }),
      });

      return post;
   },
});
