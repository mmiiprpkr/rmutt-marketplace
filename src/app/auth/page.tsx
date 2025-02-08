"use client";

import { OtpLoginForm } from "@/components/features/auth/login-otp-form";

const OtpLoginPage = () => {
   return (
      <div className="flex items-center justify-center min-h-screen bg-secondary">
         <OtpLoginForm />
      </div>
   );
};

export default OtpLoginPage;
