import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
   args: {
      userId: v.id("users"),
      title: v.string(),
      body: v.string(),
      data: v.optional(v.string()),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);

      const notification = {
         userId: args.userId,
         title: args.title,
         body: args.body,
         data: args.data,
      };

      const insertedNotification = await ctx.db.insert(
         "notifications",
         notification,
      );
      return insertedNotification;
   },
});
