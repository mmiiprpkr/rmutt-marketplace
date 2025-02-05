import { Id } from "./_generated/dataModel";
import { QueryCtx } from "./_generated/server";

export const populateUser = async (ctx: QueryCtx, userId: Id<"users">) => {
   const user = await ctx.db.get(userId);
   return user;
};

export const populateCommentCounts = async (
   ctx: QueryCtx,
   postId: Id<"posts">
) => {
   const comments = await ctx.db
      .query("comments")
      .filter((q) => q.eq(q.field("postId"), postId))
      .collect();
   return comments.length;
};

export const populateInteractions = async (
   ctx: QueryCtx,
   postId: Id<"posts">,
   userId: Id<"users">
) => {
   // Check if user liked the post
   const isLiked =
    (await ctx.db
       .query("likes")
       .filter((q) =>
          q.and(q.eq(q.field("postId"), postId), q.eq(q.field("userId"), userId))
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
          q.and(q.eq(q.field("postId"), postId), q.eq(q.field("userId"), userId))
       )
       .unique()) !== null;

   return { isLiked, likeCount: likeCount.length, isSaved };
};
