import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";
import {
   populateOrderWithProduct,
   populateProduct,
   populateProductCounts,
   populateProductWithOrder,
} from "./helper";
import { paginationOptsValidator } from "convex/server";

const populateUser = async (ctx: QueryCtx, userId: Id<"users">) => {
   const user = await ctx.db.get(userId);
   return user;
};

export const getConversationById = query({
   args: {
      conversationId: v.id("conversations"),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }

      const conversation = await ctx.db.get(args.conversationId);

      if (!conversation) {
         throw new Error("Conversation not found");
      }

      const compare = conversation.userId1 === userId;
      const otherUser = compare ? conversation.userId2 : conversation.userId1;
      const currentUser = compare ? conversation.userId1 : conversation.userId2;

      return {
         otherUser,
         currentUser,
      };
   },
})

export const conversations = mutation({
   args: {
      userId1: v.id("users"),
      userId2: v.id("users"),
   },
   handler: async (ctx, args) => {
      const conversations = await ctx.db
         .query("conversations")
         .filter((q) =>
            q.or(
               q.and(
                  q.eq(q.field("userId1"), args.userId1),
                  q.eq(q.field("userId2"), args.userId2),
               ),
               q.and(
                  q.eq(q.field("userId1"), args.userId2),
                  q.eq(q.field("userId2"), args.userId1),
               ),
            ),
         )
         .collect();

      if (conversations.length === 0) {
         const conversations = await ctx.db.insert("conversations", {
            userId1: args.userId1,
            userId2: args.userId2,
            createdAt: Date.now().toLocaleString(),
         });

         return conversations;
      }

      return conversations[0]._id as Id<"conversations">;
   },
});

export const getConversations = query({
   args: {},
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }

      const conversations = await ctx.db
         .query("conversations")
         .filter((q) =>
            q.or(
               q.eq(q.field("userId1"), userId),
               q.eq(q.field("userId2"), userId),
            ),
         )
         .collect();

      const conversationsWithUsers = await Promise.all(
         conversations.map(async (conversation) => {
            const user1 = await populateUser(ctx, conversation.userId1);
            const user2 = await populateUser(ctx, conversation.userId2);
            const countOrder = await populateProductCounts(
               ctx,
               conversation.userId1,
               conversation.userId2,
            );

            const currentUser = user1?._id === userId;

            return {
               ...conversation,
               user: currentUser ? user1 : user2,
               otherUser: currentUser ? user2 : user1,
               countOrder,
            };
         }),
      );

      return conversationsWithUsers;
   },
});

export const createMessage = mutation({
   args: {
      conversationId: v.id("conversations"),
      senderId: v.id("users"),
      content: v.string(),
      image: v.optional(v.string()),
      orderId: v.optional(v.id("orders")),
   },
   handler: async (ctx, args) => {
      const userId = getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }

      const message = await ctx.db.insert("messages", {
         conversationId: args.conversationId,
         senderId: args.senderId,
         content: args.content,
         image: args.image,
         orderId: args.orderId,
         createdAt: Date.now().toLocaleString(),
      });

      return message;
   },
});

export const getMessage = query({
   args: {
     conversationId: v.id("conversations"),
     paginationOpts: paginationOptsValidator
   },
   handler: async (ctx, args) => {
     const userId = getAuthUserId(ctx);
     if (!userId) throw new Error("Unauthorized");

     const messages = await ctx.db
       .query("messages")
       .filter((q) => q.eq(q.field("conversationId"), args.conversationId))
       .order("desc")
       .paginate(args.paginationOpts);

     const messagesWithUsers = await Promise.all(
       messages.page.map(async (message) => {
         const user = await populateUser(ctx, message.senderId);
         const product = message?.orderId
           ? await populateOrderWithProduct(ctx, message.orderId)
           : undefined;

         return {
           ...message,
           sender: user,
           product: product?.product,
           order: product?.order,
         };
       })
     );

     return {
       ...messages,
       page: messagesWithUsers,
     };
   },
 });

export const deleteMessage = mutation({
   args: {
      conversationId: v.id("conversations"),
      messageId: v.id("messages"),
   },
   handler: async (ctx, args) => {
      if (!getAuthUserId(ctx)) {
         throw new Error("Unauthorized");
      }

      const message = await ctx.db.delete(args.messageId);

      return message;
   },
});

export const updateMessage = mutation({
   args: {
      conversationId: v.id("conversations"),
      messageId: v.id("messages"),
      content: v.string(),
   },
   handler: async (ctx, args) => {
      if (!getAuthUserId(ctx)) {
         throw new Error("Unauthorized");
      }

      const message = await ctx.db.patch(args.messageId, {
         content: args.content,
      });

      return message;
   },
});
