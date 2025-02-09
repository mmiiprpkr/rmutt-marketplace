import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { populateUser } from "./helper";

export const get = query({
   args: {},
   handler: async (ctx) => {
      const userId = await getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }

      const order = await ctx.db
         .query("orders")
         .filter((q) => q.eq(q.field("sellerId"), userId))
         .collect();

      const orderWithProductWithUser = await Promise.all(
         order.map(async (order) => {
            const product = await ctx.db.get(order.productId);
            return {
               ...order,
               seller: await populateUser(ctx, order.sellerId),
               buyer: await populateUser(ctx, order.buyerId),
               product,
            };
         }),
      );

      return orderWithProductWithUser;
   },
});

export const create = mutation({
   args: {
      sellerId: v.id("users"),
      productId: v.id("products"),
      quantity: v.number(),
      totalPrice: v.number(),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }

      const product = await ctx.db.get(args.productId);

      if (!product) {
         throw new Error("Product not found");
      }

      const order = await ctx.db.insert("orders", {
         buyerId: userId,
         sellerId: args.sellerId,
         productId: args.productId,
         quantity: args.quantity,
         totalPrice: args.totalPrice,
         status: "pending",
         createdAt: Date.now().toLocaleString(),
      });

      if (product.productType === "goods") {
         if (product.quantity! < args.quantity) {
            throw new Error("Not enough quantity");
         }

         if (product.quantity! === args.quantity) {
            await ctx.db.patch(args.productId, {
               status: "unavailable",
               quantity: 0,
            });
            return;
         }

         await ctx.db.patch(args.productId, {
            quantity: product.quantity! - args.quantity,
         });
      }

      return order;
   },
});

export const update = mutation({
   args: {
      orderId: v.id("orders"),
      status: v.union(
         v.literal("pending"), // รอยืนยัน (ลด quantity แล้ว)
         v.literal("accepted"), // ยืนยันแล้ว สร้าง conversation
         v.literal("rejected"), // ปฏิเสธ (เพิ่ม quantity กลับ)
         v.literal("completed"), // ส่งของแล้ว
         v.literal("cancelled"), // ยกเลิก (เพิ่ม quantity กลับ)
      ),
   },
   handler: async (ctx, args) => {
      const userId = getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }

      const order = await ctx.db.patch(args.orderId, {
         status: args.status,
      });
      return order;
   },
});

export const deleteOrder = mutation({
   args: {
      orderId: v.id("orders"),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);

      const existingOrder = await ctx.db.get(args.orderId);
      if (!existingOrder) {
         throw new Error("Order not found");
      }

      if (existingOrder.status !== "cancelled") {
         throw new Error("Order is not cancelled");
      }

      const product = await ctx.db
         .query("products")
         .filter((q) => q.eq(q.field("sellerId"), userId))
         .collect();

      if (!product) {
         throw new Error("Product not found");
      }

      await ctx.db.delete(args.orderId);

      return;
   },
});

export const cancel = mutation({
   args: {
      orderId: v.id("orders"),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }

      const order = await ctx.db.get(args.orderId);

      if (!order) {
         throw new Error("Order not found");
      }

      if (order.status !== "pending") {
         throw new Error("Order is not pending");
      }

      const product = await ctx.db.get(order.productId);

      if (!product) {
         throw new Error("Product not found");
      }

      if (product.productType === "goods") {
         if (product.quantity === 0) {
            await ctx.db.patch(product._id, {
               status: "available",
            });
         }
         await ctx.db.patch(product._id, {
            quantity: product.quantity! + order.quantity,
         });
      }
      await ctx.db.patch(args.orderId, {
         status: "cancelled",
      });

      return order;
   },
});
