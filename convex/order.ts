import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const get = mutation({
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

      return order;
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
