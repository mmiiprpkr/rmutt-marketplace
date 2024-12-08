'use client';

import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner";

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
import { useState } from "react";

interface OtpLoginFormProps {
  isModal?: boolean;
}

export function OtpLoginForm({ isModal = false }: OtpLoginFormProps) {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Invalid email format');
      return false;
    }
    return true;
  };

  const validateOtp = (otp: string) => {
    if (otp.length < 6) {
      toast.error('OTP must be at least 6 characters');
      return false;
    }
    return true;
  };

  const content = (
    <>
      <CardHeader>
        <CardTitle>Login with OTP</CardTitle>
        <CardDescription>
          {step === "signIn" ? 'Enter your email to receive OTP' : 'Enter the OTP sent to your email'}
        </CardDescription>
      </CardHeader>
      {step === "signIn" ? (
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const email = formData.get("email") as string;

            if (!validateEmail(email)) return;

            setIsLoading(true);
            try {
              await signIn("resend-otp", formData);
              setStep({ email });
              toast.success('OTP sent to your email');
            } catch (error) {
              toast.error('Failed to send OTP');
            } finally {
              setIsLoading(false);
            }
          }}
        >
          <CardContent>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="mr-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </span>
                  Sending...
                </>
              ) : (
                'Send OTP'
              )}
            </Button>
          </CardFooter>
        </form>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const otp = formData.get("code") as string;

            if (!validateOtp(otp)) return;

            setIsLoading(true);
            void signIn("resend-otp", formData).then(() => {
              toast.success('Login successful');
            }).catch(() => {
              setIsLoading(false);
              toast.error('Invalid OTP');
            }).finally(() => {
              setIsLoading(false);
            });
          }}
        >
          <CardContent>
            <div className="grid gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label>Email</Label>
                <Input value={step.email} disabled />
                <Input name="email" value={step.email} type="hidden" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="code">OTP</Label>
                <Input
                  id="code"
                  name="code"
                  placeholder="Enter OTP"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button
              className="w-full"
              type="submit"
              disabled={isLoading}
            >
              Login
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep("signIn")}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </CardFooter>
        </form>
      )}
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