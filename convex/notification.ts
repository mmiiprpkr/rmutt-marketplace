import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";
import { populateUser } from "./helper";

export const create = mutation({
   args: {
      senderId: v.id("users"),
      recieverId: v.id("users"),
      title: v.string(),
      body: v.string(),
      data: v.optional(v.string()),
   },
   handler: async (ctx, args) => {
      const insertedNotification = await ctx.db.insert("notifications", {
         body: args.body,
         data: args.data,
         recieverId: args.recieverId,
         senderId: args.senderId,
         title: args.title,
         isRead: false,
      });
      return insertedNotification;
   },
});

export const get = query({
   args: {
      paginationOpts: paginationOptsValidator,
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }

      const notifications = await ctx.db
         .query("notifications")
         .filter((q) => q.eq(q.field("recieverId"), userId))
         .order("desc")
         .paginate(args.paginationOpts);

      const notificationWithSender = await Promise.all(
         notifications.page.map(async (notification) => {
            const user = await populateUser(ctx, notification.senderId);

            return {
               ...notification,
               sender: user,
            };
         }),
      );

      return {
         ...notifications,
         page: notificationWithSender,
      };
   },
});

export const markAsRead = mutation({
   args: {},
   handler: async (ctx) => {
      const userId = await getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }

      const notiUnread = await ctx.db
         .query("notifications")
         .filter((q) =>
            q.and(
               q.eq(q.field("recieverId"), userId),
               q.eq(q.field("isRead"), false),
            ),
         )
         .collect();

      if (notiUnread.length > 0) {
         await Promise.all(
            notiUnread.map((notification) =>
               ctx.db.patch(notification._id, { isRead: true }),
            ),
         );
      }
   },
});
