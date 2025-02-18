"use server";

import { fetchMutation, fetchQuery } from "convex/nextjs";
import { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import { sendNotification } from "./send-notification";

interface createCommentNotificationProps {
   parentCommentId: Id<"comments">;
   currentUserId: Id<"users">;
}

export const createCommentNotification = async (props: createCommentNotificationProps) => {
   try {
      if (!props.parentCommentId) return;

      const comment = await fetchQuery(api.comment.getCommentById, {
         commentId: props.parentCommentId,
      });

      if (props.currentUserId === comment.author) return;

      await sendNotification({
         senderId: props.currentUserId,
         message: "commented on your comment",
         recieverId: comment.author,
         title: "New Comment",
      })
   } catch (error) {
      console.error("Error creating comment notification", error);
   }
}
