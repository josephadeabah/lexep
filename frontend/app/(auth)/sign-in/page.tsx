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
      if (user.role === "admin") router.push("/admin/applications");
      else if (!user.role) router.push("/onboarding/choose-role");
      else if (!user.onboarding_completed) router.push(`/onboarding/${user.role}`);
      else router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="gap-lg flex flex-col items-center">
      <div className="text-center">
        <div className="flex justify-center">
          <Logo variant="light" size={64} />
        </div>
        <p className="text-body-md text-on-surface-variant mt-2">
          Welcome back. Please enter your details.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card-level1 gap-md p-md flex w-full flex-col">
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
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="text-label-sm text-on-surface-variant hover:text-primary -mt-2 self-end"
        >
          <span className="inline-flex items-center gap-1">
            {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showPassword ? "Hide password" : "Show password"}
          </span>
        </button>

        <div className="flex items-center justify-between">
          <Checkbox
            label="Remember me"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <Link href="/forgot-password" className="text-label-md text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        {error && <p className="text-label-sm text-error">{error}</p>}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Signing in…" : "Sign In"}
        </Button>

        <div className="text-label-sm text-on-surface-variant relative my-1 text-center">
          <span className="bg-surface-container-lowest relative px-3">Or continue with</span>
          <div className="bg-outline-variant absolute top-1/2 right-0 left-0 -z-10 h-px" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setError("Google sign-in isn't configured yet.")}
          >
            Google
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setError("LinkedIn sign-in isn't configured yet.")}
          >
            LinkedIn
          </Button>
        </div>
      </form>

      <p className="text-body-md text-on-surface-variant">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="font-label-md text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
