"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useAuthStore } from "@/lib/auth-store";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

// Inline SVG icons for Google and LinkedIn
function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
        fill="#0077B5"
      />
    </svg>
  );
}

interface AuthFormProps {
  mode: "sign-in" | "sign-up";
  className?: string;
}

export function AuthForm({ mode, className }: AuthFormProps) {
  const router = useRouter();
  const isSignUp = mode === "sign-up";
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      if (isSignUp) {
        await register(email, fullName, password);
        setSuccess(true);
        setTimeout(() => {
          router.push("/onboarding/choose-role");
        }, 1500);
        return;
      }

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
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Card Container - Dark Charcoal */}
      <div className="rounded-xl bg-[#303031] p-8 text-white">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-6 flex items-center gap-2">
            <Logo size={36} showWordmark={false} />
          </div>
          <p className="text-xs font-semibold tracking-[0.16em] text-[#e9c349] uppercase">
            Start here
          </p>
          <h2 className="mt-2 font-sans text-2xl font-semibold tracking-[-0.04em]">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h2>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-lg bg-green-500/20 p-4 text-sm text-green-300">
            <CheckCircle2 size={18} className="flex-shrink-0" />
            Account created successfully! Redirecting...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-500/20 p-4 text-sm text-red-300" role="alert">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp && (
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-[#efeded]">
                Your name
              </label>
              <div className="relative">
                <User
                  size={17}
                  className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[#aaa7a0]"
                />
                <input
                  id="name"
                  required
                  name="name"
                  autoComplete="name"
                  placeholder="e.g. Amina Okafor"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-md border border-[#626263] bg-[#3b3b3c] py-3 pr-4 pl-11 text-sm text-white transition outline-none placeholder:text-[#aaa7a0] focus:border-[#d4af37]"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#efeded]">
              Email address
            </label>
            <div className="relative">
              <Mail
                size={17}
                className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[#aaa7a0]"
              />
              <input
                id="email"
                required
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-[#626263] bg-[#3b3b3c] py-3 pr-4 pl-11 text-sm text-white transition outline-none placeholder:text-[#aaa7a0] focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#efeded]">
              Password
            </label>
            <div className="relative">
              <Lock
                size={17}
                className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[#aaa7a0]"
              />
              <input
                id="password"
                required
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                placeholder="••••••••"
                minLength={isSignUp ? 8 : undefined}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-[#626263] bg-[#3b3b3c] py-3 pr-12 pl-11 text-sm text-white transition outline-none placeholder:text-[#aaa7a0] focus:border-[#d4af37]"
              />
              <button
                type="button"
                className="absolute top-1/2 right-4 -translate-y-1/2 text-[#aaa7a0] transition hover:text-[#e9c349]"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {!isSignUp && (
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-[#aaa7a0]">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-[#626263] bg-[#3b3b3c] text-[#d4af37] focus:ring-[#d4af37]/20"
                />
                Remember me
              </label>
              <Link
                className="text-sm font-medium text-[#e9c349] transition hover:text-[#d4af37]"
                href="/forgot-password"
              >
                Forgot password?
              </Link>
            </div>
          )}

          {isSignUp && (
            <label className="flex items-start gap-2 text-sm text-[#aaa7a0]">
              <input
                type="checkbox"
                required
                className="mt-0.5 h-4 w-4 rounded border-[#626263] bg-[#3b3b3c] text-[#d4af37] focus:ring-[#d4af37]/20"
              />
              <span>
                I agree to the{" "}
                <Link href="#terms" className="text-[#e9c349] transition hover:text-[#d4af37]">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="#privacy" className="text-[#e9c349] transition hover:text-[#d4af37]">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
          )}

          <button
            type="submit"
            disabled={isLoading || success}
            className="w-full rounded-md bg-[#d4af37] py-3.5 text-sm font-semibold text-[#241a00] shadow-[0_4px_20px_rgba(115,92,0,0.12)] transition hover:bg-[#e9c349] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading
              ? isSignUp
                ? "Creating account..."
                : "Signing in..."
              : isSignUp
                ? "Sign Up"
                : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-[#555556]" />
          <span className="text-xs text-[#aaa7a0]">Or continue with</span>
          <div className="h-px flex-1 bg-[#555556]" />
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-md border border-[#626263] bg-[#3b3b3c] py-3 text-sm font-semibold text-white transition hover:bg-[#454546]"
          >
            <GoogleIcon />
            Google
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-md border border-[#626263] bg-[#3b3b3c] py-3 text-sm font-semibold text-white transition hover:bg-[#454546]"
          >
            <LinkedInIcon />
            LinkedIn
          </button>
        </div>

        {/* Badge */}
        {isSignUp && (
          <div className="mt-6 flex items-center gap-2 rounded-lg bg-[#3b3b3c] p-4 text-sm text-[#aaa7a0]">
            <span className="text-lg">🎉</span> Join the growing African youth shaping the future
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-sm text-[#aaa7a0]">
        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <Link
          href={isSignUp ? "/sign-in" : "/sign-up"}
          className="font-semibold text-[#e9c349] transition hover:text-[#d4af37]"
        >
          {isSignUp ? "Log in instead" : "Create an account"}
        </Link>
      </div>
    </div>
  );
}
