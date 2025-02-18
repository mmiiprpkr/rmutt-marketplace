import admin from "firebase-admin";
import { Message } from "firebase-admin/messaging";
import { NextRequest, NextResponse } from "next/server";

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
