import { firebaseConfig } from "@/config/firebase-config";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const app = initializeApp(firebaseConfig);
export const messaging =
   typeof window !== "undefined" ? getMessaging(app) : null;

export async function requestNotificationPermission() {
   try {
      if (!messaging) return null;

      if ("serviceWorker" in navigator) {
         const permission = await Notification.requestPermission();
         if (permission !== "granted") {
            console.log("Permission denied");
            return null;
         }

         const token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY!,
         });

         return token;
      }
      return null;
   } catch (error) {
      console.error("An error occurred while retrieving token. ", error);
      return null;
   }
}
