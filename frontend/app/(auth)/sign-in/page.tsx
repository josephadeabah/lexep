"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { Logo } from "@/components/ui/Logo";
import { useAuthStore } from "@/lib/auth-store";
import { ApiError } from "@/lib/api";

export default function SignInPage() {
  const router = useRouter();

  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const user = await login(email, password);

      if (user.role === "admin") {
        router.push("/admin/applications");
      } else if (!user.role) {
        router.push("/onboarding/choose-role");
      } else if (!user.onboarding_completed) {
        router.push(`/onboarding/${user.role}`);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-lg">
      {/* Header */}
      <div className="w-full text-center">
        <div className="flex justify-center">
          <Logo variant="light" size={32} />
        </div>

        <p className="mt-2 text-body-md text-on-surface-variant">
          Welcome back. Please enter your details.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="card-level1 flex w-full flex-col gap-md p-md"
      >
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          icon={<Mail className="h-4 w-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          icon={<Lock className="h-4 w-4" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="pr-10"
        />

        {/* Show / hide password */}
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="-mt-2 self-end text-label-sm text-on-surface-variant hover:text-primary"
        >
          <span className="inline-flex items-center gap-1">
            {showPassword ? (
              <EyeOff className="h-3.5 w-3.5" />
            ) : (
              <Eye className="h-3.5 w-3.5" />
            )}

            {showPassword ? "Hide password" : "Show password"}
          </span>
        </button>

        {/* Remember / Forgot */}
        <div className="flex items-center justify-between gap-4">
          <Checkbox
            label="Remember me"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />

          <Link
            href="/forgot-password"
            className="text-label-md text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Error */}
        {error && (
          <p className="text-label-sm text-error" role="alert">
            {error}
          </p>
        )}

        {/* Submit */}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Signing in…" : "Sign In"}
        </Button>

        {/* Divider */}
        <div className="relative my-1 text-center text-label-sm text-on-surface-variant">
          <span className="relative bg-surface-container-lowest px-3">
            Or continue with
          </span>

          <div className="absolute left-0 right-0 top-1/2 -z-10 h-px bg-outline-variant" />
        </div>

        {/* Social buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              setError("Google sign-in isn't configured yet.")
            }
          >
            Google
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              setError("LinkedIn sign-in isn't configured yet.")
            }
          >
            LinkedIn
          </Button>
        </div>
      </form>

      {/* Sign up */}
      <p className="text-center text-body-md text-on-surface-variant">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="text-label-md text-primary hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}