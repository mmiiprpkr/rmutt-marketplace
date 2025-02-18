import admin from "firebase-admin";
import { Message } from "firebase-admin/messaging";
import { NextRequest, NextResponse } from "next/server";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
   const serviceAccount = require("@/keys/fcm-rmutt-marketplace-firebase-adminsdk.json");
   admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

export async function POST(request: NextRequest) {
   const { token, title, message, link } = await request.json();

   const payload: Message = {
      token,
      notification: { title: title, body: message },
      webpush: link && { fcmOptions: { link } },
   };

   try {
      await admin.messaging().send(payload);
   } catch (error) {
      return NextResponse.json({ success: false, error });
   }
}
