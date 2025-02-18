"use server";

import admin from "firebase-admin";
import { Message } from "firebase-admin/messaging";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
   admin.initializeApp({
      credential: admin.credential.cert({
         projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
         privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
         clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      }),
   });
}

interface SendNotificationProps {
   senderId: Id<"users">;
   recieverId: Id<"users">;
   title: string;
   message: string;
   link?: string;
}

interface NotificationResponse {
   success: boolean;
   message: string;
   error?: { message: string };
}

export async function sendNotification({
   senderId,
   recieverId,
   title,
   message,
   link,
}: SendNotificationProps): Promise<NotificationResponse> {
   try {
      const user = await fetchQuery(api.user.getUserById, { userId: recieverId });
      const token = user?.fcmToken;

      if (!token) {
         return {
            success: false,
            message: "User does not have FCM token"
         };
      }

      // Create notification in database first
      await fetchMutation(api.notification.create, {
         senderId,
         recieverId,
         title,
         body: message,
         data: JSON.stringify({ link }),
      });

      // Send FCM notification
      const payload: Message = {
         token,
         notification: {
            title,
            body: message,
         },
         webpush: link ? {
            fcmOptions: {
               link,
            }
         } : undefined,
         data: {
            link: link || "",
         },
      };

      await admin.messaging().send(payload);

      return {
         success: true,
         message: "Notification sent successfully"
      };
   } catch (error) {
      console.error("Error sending notification:", error);
      return {
         success: false,
         message: "Failed to send notification",
         error: {
            message: error instanceof Error ? error.message : "Unknown error"
         }
      };
   }
}
