"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";
import { useAuthStore } from "@/lib/auth-store";
import { ApiError } from "@/lib/api";

export default function SignUpPage() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await register(email, fullName, password);
      router.push("/onboarding/choose-role");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="gap-lg flex flex-col items-center">
      <div className="card-level1 gap-md p-md flex w-full flex-col">
        <div className="text-center">
          <div className="flex justify-center">
            <Logo variant="light" size={64} />
          </div>
          <p className="text-body-md text-on-surface-variant mt-1">Create an account</p>
        </div>

        <form onSubmit={handleSubmit} className="gap-md flex flex-col">
          <Input
            label="Full Name"
            placeholder="Jane Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Input
            label="Email address"
            type="email"
            placeholder="jane@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />

          {error && <p className="text-label-sm text-error">{error}</p>}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Creating account…" : "Sign Up"}
          </Button>

          <div className="text-label-sm text-on-surface-variant relative my-1 text-center">
            <span className="bg-surface-container-lowest relative px-3">Or continue with</span>
            <div className="bg-outline-variant absolute top-1/2 right-0 left-0 -z-10 h-px" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setError("Google sign-up isn't configured yet.")}
            >
              Google
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setError("LinkedIn sign-up isn't configured yet.")}
            >
              LinkedIn
            </Button>
          </div>

          <p className="text-body-md text-on-surface-variant text-center">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-label-md text-primary hover:underline">
              Log in instead
            </Link>
          </p>
        </form>
      </div>

      <p className="text-label-sm text-on-surface-variant flex items-center gap-2">
        <Users className="text-primary h-4 w-4" />
        Join 10,000+ African youth shaping the future
      </p>
    </div>
  );
}
