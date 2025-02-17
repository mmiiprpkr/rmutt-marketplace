import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";

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

      const products = ctx.db
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

      const [productData] = await Promise.all([products]);

      return productData;
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

      // Randomly shuffle the array and take first 3 items
      const shuffled = allProducts.sort(() => 0.5 - Math.random());
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
      return products;
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

      const isProductOwner = await ctx.db
         .query("products")
         .filter((q) => q.eq(q.field("sellerId"), userId))
         .filter((q) => q.eq(q.field("_id"), args.id))
         .collect()
         .then((results) => results.length > 0);

      if (!isProductOwner) {
         throw new Error("Unauthorized");
      }

      const products = await ctx.db.patch(args.id, {
         status: args.status,
      });

      return products;
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
      const products = await ctx.db.patch(args.id, {
         name: args.name,
         description: args.description,
         image: args.image,
         price: args.price,
         category: args.category,
         quantity: args.quantity,
         productType: args.productType,
         createdAt: new Date().toISOString(),
         sellerId: userId,
      });
      return products;
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
      const products = await ctx.db.delete(args.id);
      return products;
   },
});
