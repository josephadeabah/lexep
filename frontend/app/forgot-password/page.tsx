"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="px-gutter flex min-h-screen items-center justify-center bg-surface py-xl">
      <div className="w-full max-w-md">
        <div className="card-level1 p-md text-center">
          <h1 className="text-headline-lg text-on-background">Reset your password</h1>
          <p className="mt-2 text-body-md text-on-surface-variant">
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>
          {sent ? (
            <p className="mt-md text-body-md text-primary">Check your inbox for a reset link.</p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="mt-md flex flex-col gap-md text-left"
            >
              <Input
                label="Email"
                type="email"
                icon={<Mail className="h-4 w-4" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="w-full">
                Send reset link
              </Button>
            </form>
          )}
          <Link
            href="/sign-in"
            className="mt-md inline-block text-label-md text-primary hover:underline"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
