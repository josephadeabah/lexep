"use client";

import { FormEvent, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ArrowRight, Check, Eye, EyeOff } from "lucide-react";

import { Logo } from "@/components/ui/Logo";
import { useAuthStore } from "@/lib/auth-store";
import { ApiError } from "@/lib/api";

interface AuthFormProps {
  mode: "sign-in" | "sign-up";
}

export function AuthForm({ mode }: AuthFormProps) {
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

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);

    try {
      if (isSignUp) {
        await register(email, fullName, password);

        router.push("/onboarding/choose-role");
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
    <main className="auth-shell">
      <section className="auth-visual" aria-label="Lexep introduction">
        <Link href="/" className="auth-logo">
          <Logo showWordmark />
        </Link>

        <div className="auth-visual-copy">
          <p className="overline">Your next chapter starts here</p>

          <h1>
            {isSignUp ? (
              <>
                Make room for <em>what&apos;s next.</em>
              </>
            ) : (
              <>
                Welcome back to <em>Lexep.</em>
              </>
            )}
          </h1>

          <p>Connect with the people, experience, and support that move your career forward.</p>
        </div>

        <div className="auth-quote">
          <span>“</span>

          <p>Opportunity is not a destination. It is a bridge we build together.</p>

          <small>— The Lexep principle</small>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="auth-mobile-logo">
            <Logo showWordmark />
          </div>

          <p className="auth-kicker">{isSignUp ? "Join the movement" : "Welcome back"}</p>

          <h2>{isSignUp ? "Create your account" : "Sign in to Lexep"}</h2>

          <p className="auth-intro">
            {isSignUp
              ? "Start building your path to meaningful work."
              : "Pick up where your next chapter left off."}
          </p>

          {submitted ? (
            <div className="auth-success">
              <span>
                <Check size={20} />
              </span>

              <strong>{isSignUp ? "You're on your way." : "You're signed in."}</strong>

              <p>
                {isSignUp
                  ? "Your Lexep account is ready to explore."
                  : "Welcome back. Your dashboard is ready."}
              </p>

              <Link className="button button-primary" href="/dashboard">
                Continue to dashboard
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              {isSignUp && (
                <label>
                  Full name
                  <input
                    required
                    name="name"
                    autoComplete="name"
                    placeholder="Your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </label>
              )}

              <label>
                Email address
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>

              <label>
                Password
                <span className="auth-password">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    placeholder="At least 8 characters"
                    minLength={isSignUp ? 8 : undefined}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </span>
              </label>

              {!isSignUp && (
                <div className="auth-options">
                  <label className="auth-check">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />

                    <span>Remember me</span>
                  </label>

                  <Link className="auth-forgot" href="/forgot-password">
                    Forgot password?
                  </Link>
                </div>
              )}

              {isSignUp && (
                <label className="auth-check">
                  <input type="checkbox" required />

                  <span>
                    I agree to the <Link href="#terms">Terms</Link> and{" "}
                    <Link href="#privacy">Privacy Policy</Link>.
                  </span>
                </label>
              )}

              {error && (
                <p className="auth-error" role="alert">
                  {error}
                </p>
              )}

              <button
                className="button button-primary auth-submit"
                type="submit"
                disabled={isLoading}
              >
                {isLoading
                  ? isSignUp
                    ? "Creating account..."
                    : "Signing in..."
                  : isSignUp
                    ? "Create account"
                    : "Sign in"}

                {!isLoading && <ArrowRight size={16} />}
              </button>
            </form>
          )}

          <p className="auth-switch">
            {isSignUp ? "Already have an account?" : "New to Lexep?"}{" "}
            <Link href={isSignUp ? "/sign-in" : "/sign-up"}>
              {isSignUp ? "Sign in" : "Create an account"}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
