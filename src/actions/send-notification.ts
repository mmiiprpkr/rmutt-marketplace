"use server";
"use server";

import admin from "firebase-admin";
import { Message } from "firebase-admin/messaging";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
   const serviceAccount = require("@/keys/fcm-rmutt-marketplace-firebase-adminsdk.json");
   admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
   });
}

interface SendNotificationProps {
   userId: Id<"users">;
   title: string;
   message: string;
   link?: string;
}

export async function sendNotification({
   userId,
   title,
   message,
   link,
}: SendNotificationProps) {
   try {
      const user = await fetchQuery(api.user.getUserById, { userId: userId });
      const token = user?.fcmToken;

      if (!token) {
         return { success: false, message: "User does not have FCM token" };
      }

      const payload: Message = {
         token,
         notification: {
            title,
            body: message,
         },
         webpush: link
            ? {
                 fcmOptions: {
                    link,
                 },
              }
            : undefined,
      };

      const test = await fetchMutation(api.notification.create, {
         userId: userId,
         title: title,
         body: message,
         data: JSON.stringify({}),
      });

      console.log("test", test);

      await admin.messaging().send(payload);
      return { success: true, message: "Notification sent!" };
   } catch (error) {
      console.error("Error sending notification:", error);
      return { success: false, error };
   }
}
