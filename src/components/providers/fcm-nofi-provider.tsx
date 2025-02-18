"use client";

import { useEffect } from "react";
import {
   messaging,
   requestNotificationPermission,
} from "@/lib/firebase/firebase";
import { onMessage } from "firebase/messaging";
import { useUpdateFcmToken } from "@/api/use-update-fcm-token";
import { toast } from "sonner";

export default function FCMNotificationProvider({
   children,
}: {
   children: React.ReactNode;
}) {
   const { mutateAsync: updateFcmToken } = useUpdateFcmToken();

   useEffect(() => {
      const initializeFCM = async () => {
         try {
            const token = await requestNotificationPermission();

            if (token) {
               console.log("FCM Token obtained:", token);
               await updateFcmToken({ fcmToken: token });
            }

            if (messaging) {
               onMessage(messaging, (payload) => {
                  console.log("Foreground message received:", payload);

                  // Show notification using toast
                  toast.info(payload.notification?.title, {
                     description: payload.notification?.body,
                     duration: 5000,
                  });

               });
            }
         } catch (error) {
            console.error("FCM initialization failed:", error);
         }
      };

      initializeFCM();
   }, [updateFcmToken]);

   return (
      <html lang="en">
         <body>
            {children}
            <div id="modal-root" />
         </body>
      </html>
   );
}
