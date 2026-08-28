"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Mail, Lock, Github, Linkedin } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useAuthStore } from "@/lib/auth-store";
import { ApiError } from "@/lib/api";
import styles from "./auth-form.module.css";

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
    <main className={styles.shell}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/" className={styles.logo}>
          <Logo showWordmark />
        </Link>
        <h1>{isSignUp ? "Create an account" : "Welcome back"}</h1>
        <p>
          {isSignUp
            ? "Join Lexep and start your journey today."
            : "Please enter your details."}
        </p>
      </div>

      {/* Card */}
      <div className={styles.card}>
        <form className={styles.form} onSubmit={handleSubmit}>
          {isSignUp && (
            <label className={styles.field}>
              <span>Full Name</span>
              <div className={styles.inputWrapper}>
                <input
                  required
                  name="name"
                  autoComplete="name"
                  placeholder="Jane Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </label>
          )}

          <label className={styles.field}>
            <span>Email address</span>
            <div className={styles.inputWrapper}>
              <Mail size={17} className={styles.inputIcon} />
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </label>

          <label className={styles.field}>
            <span>Password</span>
            <div className={styles.passwordWrapper}>
              <Lock size={17} className={styles.inputIconLeft} />
              <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                placeholder="••••••••"
                minLength={isSignUp ? 8 : undefined}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </label>

          {!isSignUp && (
            <div className={styles.options}>
              <label className={styles.check}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Remember me</span>
              </label>

              <Link className={styles.forgot} href="/forgot-password">
                Forgot password?
              </Link>
            </div>
          )}

          {isSignUp && (
            <label className={styles.check}>
              <input type="checkbox" required />
              <span>
                I agree to the <Link href="#terms">Terms</Link> and{" "}
                <Link href="#privacy">Privacy Policy</Link>.
              </span>
            </label>
          )}

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <button className={styles.submit} type="submit" disabled={isLoading}>
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
        <div className={styles.divider}>Or continue with</div>

        {/* Social Buttons */}
        <div className={styles.socialButtons}>
          <button className={styles.socialButton} type="button">
            <Github size={17} />
            Google
          </button>
          <button className={styles.socialButton} type="button">
            <Linkedin size={17} />
            LinkedIn
          </button>
        </div>

        {/* Badge */}
        {isSignUp && (
          <div className={styles.badge}>
            <span>🎉</span> Join 10,000+ African youth shaping the future
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <Link href={isSignUp ? "/sign-in" : "/sign-up"}>
          {isSignUp ? "Log in instead" : "Create an account"}
        </Link>
      </div>
    </main>
  );
}