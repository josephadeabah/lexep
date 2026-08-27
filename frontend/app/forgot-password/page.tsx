"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Mail } from "lucide-react";
import styles from "./forgot-password.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Replace this with the real password reset API call later
    setSent(true);
  }

  return (
    <main className={styles.shell}>
      <section className={styles.panel}>
        <div className={styles.card}>
          <Link
            href="/sign-in"
            className={styles.back}
            aria-label="Back to sign in"
          >
            <ArrowLeft size={16} />
            Back to sign in
          </Link>

          <div className={styles.header}>
            <div className={styles.icon}>
              <Mail size={22} />
            </div>

            <p className={styles.kicker}>Password recovery</p>

            <h1>Reset your password</h1>

            <p className={styles.intro}>
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </p>
          </div>

          {sent ? (
            <div className={styles.success}>
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
                className={styles.submit}
              >
                Back to sign in
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <label className={styles.field}>
                <span>Email address</span>

                <div className={styles.inputIcon}>
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
                </div>
              </label>

              <button
                className={styles.submit}
                type="submit"
              >
                Send reset link
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {!sent && (
            <p className={styles.switch}>
              Remember your password?{" "}
              <Link href="/sign-in">Sign in</Link>
            </p>
          )}
        </div>
      </section>
    </main>
  );
}