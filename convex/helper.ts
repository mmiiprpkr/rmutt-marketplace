import { Id } from "./_generated/dataModel";
import { QueryCtx } from "./_generated/server";

export const populateUser = async (ctx: QueryCtx, userId: Id<"users">) => {
   const user = await ctx.db.get(userId);
   return user;
};

export const populateCommentCounts = async (
   ctx: QueryCtx,
   postId: Id<"posts">,
) => {
   const comments = await ctx.db
      .query("comments")
      .filter((q) => q.eq(q.field("postId"), postId))
      .collect();
   return comments.length;
};

export const populateLikeProduct = async (
   ctx: QueryCtx,
   productId: Id<"products">,
   userId: Id<"users">,
) => {
   const isLiked =
      (await ctx.db
         .query("likes")
         .filter((q) =>
            q.and(
               q.eq(q.field("productId"), productId),
               q.eq(q.field("userId"), userId),
            ),
         )
         .unique()) !== null;

   return isLiked;
};

export const populateInteractions = async (
   ctx: QueryCtx,
   postId: Id<"posts">,
   userId: Id<"users">,
) => {
   // Check if user liked the post
   const isLiked =
      (await ctx.db
         .query("likes")
         .filter((q) =>
            q.and(
               q.eq(q.field("postId"), postId),
               q.eq(q.field("userId"), userId),
            ),
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
               q.eq(q.field("userId"), userId),
            ),
         )
         .unique()) !== null;

   return { isLiked, likeCount: likeCount.length, isSaved };
};

export const populateProductCounts = async (
   ctx: QueryCtx,
   userId1: Id<"users">,
   userId2: Id<"users">,
) => {
   const orders = await ctx.db
      .query("orders")
      .filter((q) =>
         q.or(
            q.and(
               q.eq(q.field("buyerId"), userId1),
               q.eq(q.field("sellerId"), userId2),
               q.or(
                  q.eq(q.field("status"), "accepted"),
                  q.eq(q.field("status"), "pending"),
               ),
            ),
            q.and(
               q.eq(q.field("buyerId"), userId2),
               q.eq(q.field("sellerId"), userId1),
               q.or(
                  q.eq(q.field("status"), "accepted"),
                  q.eq(q.field("status"), "pending"),
               ),
            ),
         ),
      )
      .collect();

   console.log("orders", orders);

   return orders.length;
};

export const populateProduct = async (
   ctx: QueryCtx,
   productId: Id<"products">,
) => {
   const product = await ctx.db.get(productId);
   return product;
};

export const populateProductWithOrder = async (
   ctx: QueryCtx,
   productId: Id<"products">,
   userId1: Id<"users">,
   userId2: Id<"users">,
) => {
   const product = await ctx.db.get(productId);
   const [orders] = await ctx.db
      .query("orders")
      .filter((q) => q.eq(q.field("productId"), productId))
      .filter((q) =>
         q.or(
            q.and(
               q.eq(q.field("buyerId"), userId1),
               q.eq(q.field("sellerId"), userId2),
            ),
            q.and(
               q.eq(q.field("buyerId"), userId2),
               q.eq(q.field("sellerId"), userId1),
            ),
         ),
      )
      .collect();

   return { product, orders };
};

export const populateOrderWithProduct = async (
   ctx: QueryCtx,
   orderId: Id<"orders">,
) => {
   const order = await ctx.db.get(orderId);

   if (!order) return null;

   const product = await ctx.db.get(order.productId);

   return { order, product };
};

// Helper function to get top selling products
export async function getTopProducts(
   ctx: QueryCtx,
   userId: string,
   start: string,
   end: string,
   limit: number = 5
) {
   const orders = await ctx.db
      .query("orders")
      .filter((q) =>
         q.and(
            q.eq(q.field("sellerId"), userId),
            q.eq(q.field("status"), "completed"),
         )
      )
      .collect();

   // Group orders by product
   const productStats = new Map();

   for (const order of orders) {
      const stats = productStats.get(order.productId) || {
         totalOrders: 0,
         totalRevenue: 0,
         totalQuantity: 0
      };

      stats.totalOrders++;
      stats.totalRevenue += order.totalPrice;
      stats.totalQuantity += order.quantity;
      productStats.set(order.productId, stats);
   }

   // Get product details and sort by revenue
   const topProducts = await Promise.all(
      Array.from(productStats.entries()).map(async ([productId, stats]) => {
         const product = await ctx.db.get(productId);
         return {
            ...product,
            ...stats
         };
      })
   );

   return topProducts
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, limit);
}
