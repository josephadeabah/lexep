"use client";

import { FormEvent, useState } from "react";

import Link from "next/link";

import { ArrowLeft, ArrowRight, Check, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Replace this with the real password reset API call later
    setSent(true);
  }

  return (
    <main className="auth-shell auth-shell-simple">
      <section className="auth-panel auth-panel-full">
        <div className="auth-card auth-card-reset">
          <Link
            href="/sign-in"
            className="auth-back"
            aria-label="Back to sign in"
          >
            <ArrowLeft size={16} />
            Back to sign in
          </Link>

          <div className="auth-reset-header">
            <div className="auth-reset-icon">
              <Mail size={22} />
            </div>

            <p className="auth-kicker">Password recovery</p>

            <h1>Reset your password</h1>

            <p className="auth-intro">
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </p>
          </div>

          {sent ? (
            <div className="auth-success">
              <span>
                <Check size={20} />
              </span>

              <strong>Check your inbox.</strong>

              <p>
                We&apos;ve sent password reset instructions to{" "}
                <strong>{email}</strong>.
              </p>

              <Link
                href="/sign-in"
                className="button button-primary auth-submit"
              >
                Back to sign in
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              <label>
                Email address

                <span className="auth-input-icon">
                  <Mail size={17} />

                  <input
                    required
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </span>
              </label>

              <button
                className="button button-primary auth-submit"
                type="submit"
              >
                Send reset link
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {!sent && (
            <p className="auth-switch">
              Remember your password?{" "}
              <Link href="/sign-in">Sign in</Link>
            </p>
          )}
        </div>
      </section>
    </main>
  );
}