import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";

import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";

const populateUser = async (ctx: QueryCtx, userId: Id<"users">) => {
   const user = await ctx.db.get(userId);
   return user;
};

const populateCommentCounts = async (ctx: QueryCtx, postId: Id<"posts">) => {
   const comments = await ctx.db
      .query("comments")
      .filter((q) => q.eq(q.field("postId"), postId))
      .collect();
   return comments.length;
};

const populateInteractions = async (
   ctx: QueryCtx,
   postId: Id<"posts">,
   userId: Id<"users">
) => {
   // Check if user liked the post
   const isLiked =
      (await ctx.db
         .query("likes")
         .filter((q) =>
            q.and(
               q.eq(q.field("postId"), postId),
               q.eq(q.field("userId"), userId)
            )
         )
         .unique()) !== null;

   // Get total like count
   const likeCount = await ctx.db
      .query("likes")
      .filter((q) => q.eq(q.field("postId"), postId))
      .collect();

   // Check if user saved the post
   const isSaved =
      (await ctx.db
         .query("savedPosts")
         .filter((q) =>
            q.and(
               q.eq(q.field("postId"), postId),
               q.eq(q.field("userId"), userId)
            )
         )
         .unique()) !== null;

   return { isLiked, likeCount: likeCount.length, isSaved };
};

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

export const getComments = query({
   args: {
      postId: v.id("posts"),
   },
   handler: async (ctx, args) => {
      console.log("args", args);

      async function getReplies(
         parentId: Id<"comments">
      ): Promise<Doc<"comments">[]> {
         const replies = await ctx.db
            .query("comments")
            .filter((q) => q.eq(q.field("parentId"), parentId))
            .collect();

         console.log("replies", replies);

         const repliesWithNested: Doc<"comments">[] = await Promise.all(
            replies.map(async (reply) => ({
               ...reply,
               user: await populateUser(ctx, reply.author),
               replies: await getReplies(reply._id),
            }))
         );

         console.log("repliesWithNested", repliesWithNested);

         return repliesWithNested;
      }

      const parentComments = await ctx.db
         .query("comments")
         .filter((q) =>
            q.and(
               q.eq(q.field("postId"), args.postId),
               q.eq(q.field("parentId"), undefined)
            )
         )
         .collect();

      console.log("parentComments", parentComments);

      const commentsWithNestedReplies = await Promise.all(
         parentComments.map(async (comment) => ({
            ...comment,
            replies: await getReplies(comment._id),
         }))
      );

      return commentsWithNestedReplies;
   },
});

export const createComment = mutation({
   args: {
      postId: v.id("posts"),
      parentId: v.union(v.id("comments"), v.null()),
      content: v.string(),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }

      console.log("Creating comment with:", {
         postId: args.postId,
         parentId: args.parentId,
         content: args.content,
         author: userId,
      });

      const comment = await ctx.db.insert("comments", {
         postId: args.postId,
         parentId: args.parentId ?? undefined,
         content: args.content,
         author: userId,
         createdAt: new Date().toISOString(),
      });

      console.log("Created comment:", comment);
      return comment;
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

const getCommunityUserCount = async (
   ctx: QueryCtx,
   communityId: Id<"communities">
) => {
   const count = await ctx.db
      .query("userCommunities")
      .filter((q) => q.eq(q.field("communityId"), communityId))
      .collect();

   if (Array.isArray(count)) {
      return count.length;
   }

   return 0;
};

export const getCommunities = query({
   args: {},
   handler: async (ctx) => {
      const userId = await getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }

      const communities = await ctx.db.query("communities").collect();

      const userCommunities = await ctx.db
         .query("userCommunities")
         .filter((q) => q.eq(q.field("userId"), userId))
         .collect();

      const joinedCommunityIds = new Set(
         userCommunities.map((uc) => uc.communityId.toString())
      );

      const refactoredCommunities = await Promise.all(
         communities
            .filter(
               (community) => !joinedCommunityIds.has(community._id.toString())
            )
            .map(async (community) => ({
               ...community,
               image: community.image
                  ? await ctx.storage.getUrl(community.image)
                  : null,
               userCount: await getCommunityUserCount(ctx, community._id),
            }))
      );

      return refactoredCommunities;
   },
});

export const getCommunity = query({
   args: {
      communityId: v.id("communities"),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }

      const community = await ctx.db.get(args.communityId);

      if (!community) {
         throw new Error("Community not found");
      }

      return {
         ...community,
         image: community.image
            ? await ctx.storage.getUrl(community.image)
            : null,
      };
   },
});

const populateCommunities = async (
   ctx: QueryCtx,
   communityId: Id<"communities">
) => {
   const communities = await ctx.db
      .query("communities")
      .filter((q) => q.eq(q.field("_id"), communityId))
      .first();

   return {
      ...communities,
      image: communities?.image
         ? await ctx.storage.getUrl(communities.image)
         : null,
   };
};

export const getMyCommunities = query({
   args: {},
   handler: async (ctx) => {
      const userId = await getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }

      const communities = await ctx.db
         .query("userCommunities")
         .filter((q) => q.eq(q.field("userId"), userId))
         .collect();

      const refactoredCommunities = await Promise.all(
         communities.map(async (community) => ({
            ...community,
            community: await populateCommunities(ctx, community.communityId),
            userCount: await getCommunityUserCount(ctx, community.communityId),
         }))
      );

      return refactoredCommunities;
   },
});

export const createCommunity = mutation({
   args: {
      name: v.string(),
      description: v.optional(v.string()),
      image: v.id("_storage"),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }

      const community = await ctx.db.insert("communities", {
         name: args.name,
         image: args.image,
         description: args.description,
         createdAt: new Date().toISOString(),
         userId,
      });

      await ctx.db.insert("userCommunities", {
         userId,
         communityId: community,
      });

      return community;
   },
});

export const joinCommunity = mutation({
   args: {
      communityId: v.id("communities"),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }

      const existingMembership = await ctx.db
         .query("userCommunities")
         .filter((q) =>
            q.and(
               q.eq(q.field("userId"), userId),
               q.eq(q.field("communityId"), args.communityId)
            )
         )
         .first();

      if (existingMembership) {
         await ctx.db.delete(existingMembership._id);
         return { success: true };
      }

      await ctx.db.insert("userCommunities", {
         userId,
         communityId: args.communityId,
      });
      return { success: true };
   },
});

export const leaveCommunity = mutation({
   args: {
      communityId: v.id("communities"),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }

      const community = await ctx.db
         .query("communities")
         .filter((q) => q.eq(q.field("_id"), args.communityId))
         .first();

      if (community?.userId === userId) {
         throw new Error("Community owner cannot leave their own community");
      }

      const membershipToDelete = await ctx.db
         .query("userCommunities")
         .filter((q) =>
            q.and(
               q.eq(q.field("userId"), userId),
               q.eq(q.field("communityId"), args.communityId)
            )
         )
         .first();

      if (!membershipToDelete) {
         throw new Error("You are not a member of this community");
      }

      await ctx.db.delete(membershipToDelete._id);

      return { success: true };
   },
});
