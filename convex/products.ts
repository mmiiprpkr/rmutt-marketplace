import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";
import { getTopProducts, populateLikeProduct } from "./helper";
import {
   getAll,
   getOneFrom,
   getManyFrom,
   getManyVia,
} from "convex-helpers/server/relationships";
import { asyncMap } from "convex-helpers";

export const brows = query({
   args: {
      name: v.optional(v.string()),
      category: v.optional(v.string()),
      minPrice: v.optional(v.number()),
      maxPrice: v.optional(v.number()),
      type: v.optional(v.union(v.literal("food"), v.literal("goods"))),
      paginationOpts: paginationOptsValidator,
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }

      const products = await ctx.db
         .query("products")
         .filter((q) =>
            q.and(
               // กรองสินค้าที่ available
               q.eq(q.field("status"), "available"),

               // กรองตามชื่อ
               args.name !== undefined
                  ? q.eq(q.field("name"), args.name)
                  : q.eq(q.field("status"), "available"),

               // กรองตาม category
               args.category !== undefined
                  ? q.eq(q.field("category"), args.category)
                  : q.eq(q.field("status"), "available"),

               // กรองตามราคาขั้นต่ำ
               args.minPrice !== undefined
                  ? q.gte(q.field("price"), args.minPrice)
                  : q.eq(q.field("status"), "available"),

               // กรองตามราคาสูงสุด
               args.maxPrice !== undefined
                  ? q.lte(q.field("price"), args.maxPrice)
                  : q.eq(q.field("status"), "available"),

               args.type !== undefined
                  ? q.eq(q.field("productType"), args.type)
                  : q.eq(q.field("status"), "available"),
            ),
         )
         .order("desc")
         .paginate(args.paginationOpts);

      const productsWithLikes = await Promise.all(
         products.page?.map(async (product) => ({
            ...product,
            isLiked: await populateLikeProduct(ctx, product._id, userId),
         })) || [],
      );

      return {
         ...products,
         page: productsWithLikes,
      };
   },
});

export const myProduct = query({
   args: {
      name: v.optional(v.string()),
      category: v.optional(v.string()),
      minPrice: v.optional(v.number()),
      maxPrice: v.optional(v.number()),
      type: v.optional(v.union(v.literal("food"), v.literal("goods"))),
      userId: v.id("users"),
      paginationOpts: paginationOptsValidator,
   },
   handler: async (ctx, args) => {
      const userId = args.userId;

      if (!userId) {
         throw new Error("Unauthorized");
      }

      const products = await ctx.db
         .query("products")
         .filter((q) =>
            q.and(
               q.eq(q.field("sellerId"), userId),

               // กรองสินค้าที่ available
               q.eq(q.field("status"), "available"),

               // กรองตามชื่อ
               args.name !== undefined
                  ? q.eq(q.field("name"), args.name)
                  : q.eq(q.field("status"), "available"),

               // กรองตาม category
               args.category !== undefined
                  ? q.eq(q.field("category"), args.category)
                  : q.eq(q.field("status"), "available"),

               // กรองตามราคาขั้นต่ำ
               args.minPrice !== undefined
                  ? q.gte(q.field("price"), args.minPrice)
                  : q.eq(q.field("status"), "available"),

               // กรองตามราคาสูงสุด
               args.maxPrice !== undefined
                  ? q.lte(q.field("price"), args.maxPrice)
                  : q.eq(q.field("status"), "available"),

               args.type !== undefined
                  ? q.eq(q.field("productType"), args.type)
                  : q.eq(q.field("status"), "available"),
            ),
         )
         .order("desc")
         .paginate(args.paginationOpts);

      const productsWithLikes = await Promise.all(
         products.page?.map(async (product) => ({
            ...product,
            isLiked: await populateLikeProduct(ctx, product._id, userId),
         })) || [],
      );

      return {
         ...products,
         page: productsWithLikes,
      };
   },
});

export const recommend = query({
   args: {
      productType: v.union(v.literal("food"), v.literal("goods")),
      productId: v.id("products"),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);
      if (!userId) {
         throw new Error("Unauthorized");
      }

      // Get all available products of the specified type
      const allProducts = await ctx.db
         .query("products")
         .filter((q) =>
            q.and(
               q.eq(q.field("status"), "available"),
               q.eq(q.field("productType"), args.productType),
               q.neq(q.field("_id"), args.productId),
            ),
         )
         .collect();

      const productWithLikes = await Promise.all(
         allProducts.map(async (p) => {
            return {
               ...p,
               isLiked: await populateLikeProduct(ctx, p._id, userId),
            };
         }),
      );

      // Randomly shuffle the array and take first 3 items
      const shuffled = productWithLikes.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 10);
   },
});

export const get = query({
   args: {
      page: v.number(),
      limit: v.number(),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);
      if (!userId) {
         throw new Error("Unauthorized");
      }

      const [products, totalCount] = await Promise.all([
         ctx.db
            .query("products")
            .filter((q) => q.eq(q.field("sellerId"), userId))
            .order("desc")
            .collect()
            .then((results) => {
               const startIndex = (args.page - 1) * args.limit;
               const endIndex = startIndex + args.limit;
               return results.slice(startIndex, endIndex);
            }),
         ctx.db
            .query("products")
            .filter((q) => q.eq(q.field("sellerId"), userId))
            .collect()
            .then((results) => results.length),
      ]);

      return {
         products,
         totalPages: Math.ceil(totalCount / args.limit),
         currentPage: args.page,
      };
   },
});

export const getFavorites = query({
   args: {},
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);
      if (!userId) throw new Error("Unauthorized");

      // Get all likes for the user
      const likes = await ctx.db
         .query("likes")
         .filter((q) => q.eq(q.field("userId"), userId))
         .collect();

      const likedProduct = likes.map((like) => like.productId)?.filter(Boolean);

      if (!likedProduct.length) return [];

      // Get all products that the user liked
      const products = await Promise.all(
         likedProduct.map(async (productId) => {
            if (!productId) return;

            const product = await ctx.db.get(productId);
            return {
               ...product,
               isLiked: true,
            };
         }),
      );

      return products;
   },
});

export const getById = query({
   args: {
      id: v.id("products"),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);
      if (!userId) {
         throw new Error("Unauthorized");
      }
      const products = await ctx.db.get(args.id);

      const isLiked = await populateLikeProduct(ctx, args.id, userId);

      return { products, isLiked };
   },
});

export const like = mutation({
   args: {
      productId: v.id("products"),
      action: v.union(v.literal("like"), v.literal("unlike")),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);
      if (!userId) throw new Error("Unauthorized");

      const existingLike = await ctx.db
         .query("likes")
         .filter((q) =>
            q.and(
               q.eq(q.field("userId"), userId),
               q.eq(q.field("productId"), args.productId),
            ),
         )
         .first();

      if (args.action === "like" && !existingLike) {
         // Add like
         await ctx.db.insert("likes", {
            userId,
            productId: args.productId,
            createdAt: new Date().toISOString(),
         });
      } else if (args.action === "unlike" && existingLike) {
         // Remove like
         await ctx.db.delete(existingLike._id);
      }

      return true;
   },
});

export const create = mutation({
   args: {
      name: v.string(),
      description: v.string(),
      image: v.string(),
      price: v.number(),
      category: v.string(),
      quantity: v.optional(v.number()),
      productType: v.union(v.literal("food"), v.literal("goods")),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }

      const products = await ctx.db.insert("products", {
         name: args.name,
         description: args.description,
         image: args.image,
         price: args.price,
         category: args.category,
         quantity: args.quantity,
         productType: args.productType,
         createdAt: new Date().toISOString(),
         sellerId: userId,
         status: "available",
      });

      return products;
   },
});

export const updateStatus = mutation({
   args: {
      id: v.id("products"),
      status: v.union(v.literal("available"), v.literal("unavailable")),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);
      if (!userId) {
         throw new Error("Unauthorized");
      }

      // Check if the product exists and user is the owner
      const product = await ctx.db.get(args.id);
      if (!product || product.sellerId !== userId) {
         throw new Error("Product not found or unauthorized");
      }

      // Check for active orders if trying to make product unavailable
      const activeOrders = await ctx.db
         .query("orders")
         .filter((q) =>
            q.and(
               q.eq(q.field("productId"), args.id),
               q.or(
                  q.eq(q.field("status"), "pending"),
                  q.eq(q.field("status"), "accepted"),
               ),
            ),
         )
         .collect();

      if (activeOrders.length > 0) {
         throw new Error(
            "Cannot make product unavailable while it has pending or accepted orders",
         );
      }

      // If checks pass, update the status
      const updatedProduct = await ctx.db.patch(args.id, {
         status: args.status,
      });

      return updatedProduct;
   },
});

export const update = mutation({
   args: {
      id: v.id("products"),
      name: v.string(),
      description: v.string(),
      image: v.string(),
      price: v.number(),
      category: v.string(),
      quantity: v.optional(v.number()),
      productType: v.union(v.literal("food"), v.literal("goods")),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);
      if (!userId) {
         throw new Error("Unauthorized");
      }

      // Check if the product exists and user is the owner
      const product = await ctx.db.get(args.id);
      if (!product || product.sellerId !== userId) {
         throw new Error("Product not found or unauthorized");
      }

      // Check for active orders
      const activeOrders = await ctx.db
         .query("orders")
         .filter((q) =>
            q.and(
               q.eq(q.field("productId"), args.id),
               q.or(
                  q.eq(q.field("status"), "pending"),
                  q.eq(q.field("status"), "accepted"),
               ),
            ),
         )
         .collect();

      if (activeOrders.length > 0) {
         throw new Error(
            "Cannot update product with pending or accepted orders",
         );
      }

      // If no active orders, proceed with update
      const updatedProduct = await ctx.db.patch(args.id, {
         name: args.name,
         description: args.description,
         image: args.image,
         price: args.price,
         category: args.category,
         quantity: args.quantity,
         productType: args.productType,
      });

      return updatedProduct;
   },
});

export const deleteProduct = mutation({
   args: {
      id: v.id("products"),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);
      if (!userId) {
         throw new Error("Unauthorized");
      }

      // Check if the product exists and user is the owner
      const product = await ctx.db.get(args.id);
      if (!product || product.sellerId !== userId) {
         throw new Error("Product not found or unauthorized");
      }

      // Check for active orders
      const activeOrders = await ctx.db
         .query("orders")
         .filter((q) =>
            q.and(
               q.eq(q.field("productId"), args.id),
               q.or(
                  q.eq(q.field("status"), "pending"),
                  q.eq(q.field("status"), "accepted"),
               ),
            ),
         )
         .collect();

      if (activeOrders.length > 0) {
         throw new Error(
            "Cannot delete product with pending or accepted orders",
         );
      }

      // Get all related data
      const [likes, completedOrders] = await Promise.all([
         // Get all likes
         ctx.db
            .query("likes")
            .filter((q) => q.eq(q.field("productId"), args.id))
            .collect(),

         // Get completed/cancelled orders
         ctx.db
            .query("orders")
            .filter((q) =>
               q.and(
                  q.eq(q.field("productId"), args.id),
                  q.or(
                     q.eq(q.field("status"), "completed"),
                     q.eq(q.field("status"), "cancelled"),
                  ),
               ),
            )
            .collect(),
      ]);

      // Delete all related data
      await Promise.all([
         // Delete likes
         ...likes.map((like) => ctx.db.delete(like._id)),
         // Delete completed/cancelled orders
         ...completedOrders.map((order) => ctx.db.delete(order._id)),
      ]);

      // Finally delete the product
      const deletedProduct = await ctx.db.delete(args.id);
      return deletedProduct;
   },
});

export const stats = query({
   args: {
      start: v.optional(v.string()),
      end: v.optional(v.string()),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);
      if (!userId) throw new Error("Unauthorized");

      // Set default date range to current month if not provided
      const now = new Date();
      const start = args.start
         ? new Date(args.start)
         : new Date(now.getFullYear(), now.getMonth(), 1);
      const end = args.end
         ? new Date(args.end)
         : new Date(now.getFullYear(), now.getMonth() + 1, 0);

      // Convert to ISO string for comparison
      const startISO = start.toISOString();
      const endISO = end.toISOString();

      // Get all orders
      const orders = await ctx.db
         .query("orders")
         .filter((q) =>
            q.eq(q.field("sellerId"), userId)
         )
         .collect();

      // แยกออเดอร์ตามช่วงเวลา
      const ordersInRange = orders.filter(order => {
         const orderDate = new Date(order.createdAt);
         return orderDate >= start && orderDate <= end;
      });

      // Calculate statistics
      const stats = {
         totalOrders: orders.length, // รวมทั้งหมด
         ordersInRange: ordersInRange.length, // เฉพาะช่วงเวลา
         totalRevenue: 0,
         ordersByStatus: {
            pending: 0,
            accepted: 0,
            completed: 0,
            cancelled: 0
         },
         revenueByStatus: {
            pending: 0,
            accepted: 0,
            completed: 0,
            cancelled: 0
         }
      };

      // Calculate totals จากทุกออเดอร์
      orders.forEach(order => {
         const status = order.status;
         stats.ordersByStatus[status]++;
         stats.revenueByStatus[status] += order.totalPrice;

         if (status === "completed") {
            stats.totalRevenue += order.totalPrice;
         }
      });

      // Get all products
      const products = await ctx.db
         .query("products")
         .filter((q) =>
            q.eq(q.field("sellerId"), userId)
         )
         .collect();

      // แยกสินค้าตามช่วงเวลา
      const productsInRange = products.filter(product => {
         const productDate = new Date(product.createdAt);
         return productDate >= start && productDate <= end;
      });

      const productStats = {
         total: products.length, // รวมทั้งหมด
         productsInRange: productsInRange.length, // เฉพาะช่วงเวลา
         byType: {
            food: products.filter(p => p.productType === "food").length,
            goods: products.filter(p => p.productType === "goods").length
         },
         byStatus: {
            available: products.filter(p => p.status === "available").length,
            unavailable: products.filter(p => p.status === "unavailable").length
         }
      };

      // Get top products based on completed orders
      const topProducts = await getTopProducts(ctx, userId, startISO, endISO);

      return {
         dateRange: {
            start: startISO,
            end: endISO
         },
         orders: stats,
         products: productStats,
         topProducts
      };
   }
});

