'use client';

import { OtpLoginForm } from "@/components/features/auth/login-otp-form";

export interface IOtpLogin {
  email: string;
  otp: string;
  options?: {
    onSuccess?: () => void;
    onError?: (error: string) => void;
  };
}

const OtpLoginPage = () => {
  const handleSubmit = ({ email, otp, options }: IOtpLogin) => {
    // TODO: Implement login logic
    console.log('Login attempt', { email, otp });
    console.log('Options', options);
    options?.onSuccess?.();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <OtpLoginForm onSubmit={handleSubmit} />
    </div>
  );
};

export default OtpLoginPage;
