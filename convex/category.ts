import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
   args: {
      category: v.string(),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }

      const category = await ctx.db.insert("categories", {
         name: args.category,
      });

      return category;
   },
});

export const get = query({
   args: {},
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }
      const categories = await ctx.db.query("categories").collect();
      return categories;
   }
})