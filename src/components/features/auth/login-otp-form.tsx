'use client';

import { useState, useTransition } from 'react';

import { sendEmail } from '@/lib/nodemailer';

import { Button } from "@/components/common/ui/button";
import { Input } from "@/components/common/ui/input";
import { Label } from "@/components/common/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/common/ui/card";

import { IOtpLogin } from '@/app/(auth)/otp/page';
import { toast } from 'sonner';

interface OtpLoginFormProps {
  onSubmit: (data: IOtpLogin) => void;
  isModal?: boolean;
}

export function OtpLoginForm({ onSubmit, isModal = false }: OtpLoginFormProps) {
  const [isPending, startTransition] = useTransition();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email format');
      return;
    }
    setError(null);
    // TODO: Implement OTP sending logic
    startTransition(() => {
      sendEmail({
        to: email,
        subject: 'OTP for login',
        html: `Your OTP is ${otp}`
      }).then((res) => {
        if (!res.success) {
          setError('Failed to send OTP');
        }

        setIsOtpSent(true);
        toast.success('OTP sent to email');
      });
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      email,
      otp,
      options: {
        onSuccess: () => {
          toast.success('Login successful');
        }
      }
    });
  };

  const content = (
    <>
      <CardHeader>
        <CardTitle>Login with OTP</CardTitle>
        <CardDescription>
          {isOtpSent ? 'Enter the OTP sent to your email' : 'Enter your email to receive OTP'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={isOtpSent ? handleSubmit : handleSendOtp}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isOtpSent || isPending}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
          </div>
          {isOtpSent && (
            <div className="grid w-full items-center gap-4 mt-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="otp">OTP</Label>
                <Input
                  id="otp"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button disabled={isPending} className="w-full" type="submit">
            {isOtpSent ? 'Login' : 'Send OTP'}
          </Button>
        </CardFooter>
      </form>
    </>
  );

  if (isModal) {
    return content;
  }

  return (
    <Card className="w-[350px]">
      {content}
    </Card>
  );
}

