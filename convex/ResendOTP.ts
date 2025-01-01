import { Email } from "@convex-dev/auth/providers/Email";
import { Resend as ResendAPI } from "resend";
import { alphabet, generateRandomString } from "oslo/crypto";

export const ResendOTP = Email({
   id: "resend-otp",
   apiKey: process.env.AUTH_RESEND_KEY,
   maxAge: 15 * 24 * 60 * 60, // 15 days
   async generateVerificationToken() {
      return generateRandomString(6, alphabet("0-9"));
   },
   async sendVerificationRequest({ identifier: email, provider, token }) {
      const resend = new ResendAPI(provider.apiKey);
      const { error } = await resend.emails.send({
         from: "no-reply@community-marketplace.store",
         to: [email],
         subject: "Sign in to RMUTT Marketplace",
         html: generateEmailTemplate(token),
      });

      if (error) {
         throw new Error(JSON.stringify(error));
      }
   },
});

export const generateEmailTemplate = (code: string) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>RMUTT Marketplace - Verification Code</title>
    <style>
      .email-wrapper {
        background-color: #f6f9fc;
        padding: 40px 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      }
      .email-content {
        background-color: white;
        border-radius: 12px;
        max-width: 600px;
        margin: 0 auto;
        padding: 40px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }
      .logo {
        text-align: center;
        margin-bottom: 30px;
      }
      .logo img {
        height: 130px;
      }
      .header {
        text-align: center;
        margin-bottom: 30px;
      }
      .header h1 {
        color: #1a1a1a;
        font-size: 24px;
        font-weight: 600;
        margin: 0;
      }
      .code-box {
        background-color: #f8fafc;
        border-radius: 8px;
        padding: 24px;
        text-align: center;
        margin: 24px 0;
      }
      .code {
        font-size: 32px;
        font-weight: 700;
        letter-spacing: 6px;
        color: #4F46E5;
        margin: 0;
      }
      .message {
        color: #4a5568;
        font-size: 16px;
        line-height: 24px;
        margin-bottom: 24px;
      }
      .footer {
        text-align: center;
        color: #718096;
        font-size: 14px;
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid #e2e8f0;
      }
      .warning {
        color: #718096;
        font-size: 14px;
        font-style: italic;
      }
    </style>
  </head>
  <body>
    <div class="email-wrapper">
      <div class="email-content">
        <div class="logo">
          <!-- แทนที่ URL ด้วย logo จริงของคุณ -->
          <img src="https://utfs.io/f/TFjKKLMX2OwRnquP9zQPuLxvtl0NdrHS3B8cqgD1UFZRkKVX" alt="RMUTT Marketplace Logo" />
        </div>
        
        <div class="header">
          <h1>Verify Your Email</h1>
        </div>

        <div class="message">
          Hi there,<br><br>
          Thank you for using RMUTT Marketplace. Please use the verification code below to complete your sign-in process:
        </div>

        <div class="code-box">
          <div class="code">${code}</div>
        </div>

        <div class="message">
          This code will expire in 15 minutes. If you didn't request this code, you can safely ignore this email.
        </div>

        <div class="warning">
          For security reasons, never share this code with anyone.
        </div>

        <div class="footer">
          © ${new Date().getFullYear()} RMUTT Marketplace. All rights reserved.<br>
          This is an automated email, please do not reply.
        </div>
      </div>
    </div>
  </body>
  </html>
`;
