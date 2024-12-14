"use server";

import nodemailer from "nodemailer";

if (!process.env.NODEMAILER_EMAIL || !process.env.NODEMAILER_PASSWORD) {
   throw new Error("Missing Nodemailer credentials in environment variables");
}

const transporter = nodemailer.createTransport({
   service: "gmail",
   auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
   },
});

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(payload: EmailPayload) {
   const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      ...payload,
   };

   try {
      await transporter.sendMail(mailOptions);
      return { success: true };
   } catch (error) {
      console.error("Error sending email:", error);
      return { success: false, error };
   }
}
