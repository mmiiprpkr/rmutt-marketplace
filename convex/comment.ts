import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { populateUser } from "./helper";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getComments = query({
   args: {
      postId: v.id("posts"),
   },
   handler: async (ctx, args) => {
      console.log("args", args);

      type Comment = Doc<"comments"> &{
         user: Doc<"users"> | undefined;
      }

      async function getReplies(
         parentId: Id<"comments">
      ): Promise<Comment[]> {
         const replies = await ctx.db
            .query("comments")
            .filter((q) => q.eq(q.field("parentId"), parentId))
            .collect();

         console.log("replies", replies);

         const repliesWithNested: Comment[] = await Promise.all(
            replies.map(async (reply) => ({
               ...reply,
               user: await populateUser(ctx, reply.author) as Doc<"users">,
               replies: await getReplies(reply._id),
            }))
         );

         console.log("repliesWithNested", repliesWithNested);

         return repliesWithNested;
      }

      const parentComments = await ctx.db
         .query("comments")
         .filter((q) =>
            q.and(
               q.eq(q.field("postId"), args.postId),
               q.eq(q.field("parentId"), undefined)
            )
         )
         .collect();

      console.log("parentComments", parentComments);

      const commentsWithNestedReplies = await Promise.all(
         parentComments.map(async (comment) => ({
            ...comment,
            replies: await getReplies(comment._id),
            user: await populateUser(ctx, comment.author) as Doc<"users">,
         }))
      );

      return commentsWithNestedReplies;
   },
});

export const createComment = mutation({
   args: {
      postId: v.id("posts"),
      parentId: v.union(v.id("comments"), v.null()),
      content: v.string(),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }

      console.log("Creating comment with:", {
         postId: args.postId,
         parentId: args.parentId,
         content: args.content,
         author: userId,
      });

      const comment = await ctx.db.insert("comments", {
         postId: args.postId,
         parentId: args.parentId ?? undefined,
         content: args.content,
         author: userId,
         createdAt: new Date().toISOString(),
      });

      console.log("Created comment:", comment);
      return comment;
   },
});