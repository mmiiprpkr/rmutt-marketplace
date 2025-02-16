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

export const populateProductCounts = async (
   ctx: QueryCtx,
   userId1: Id<"users">,
   userId2: Id<"users">
) => {
   const orders = await ctx.db.query("orders")
      .filter((q) => q.or(
         q.and(
            q.eq(q.field("buyerId"), userId1),
            q.eq(q.field("sellerId"), userId2),
            q.or(
               q.eq(q.field("status"), "accepted"),
               q.eq(q.field("status"), "pending")
            )
         ),
         q.and(
            q.eq(q.field("buyerId"), userId2),
            q.eq(q.field("sellerId"), userId1),
            q.or(
               q.eq(q.field("status"), "accepted"),
               q.eq(q.field("status"), "pending")
            )
         )
      ))
      .collect();

   console.log("orders", orders);

   return orders.length;
}

export const populateProduct = async (
   ctx: QueryCtx,
   productId: Id<"products">
) => {
   const product = await ctx.db.get(productId);
   return product;
}
