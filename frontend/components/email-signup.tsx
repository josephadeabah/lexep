"use client";

import { useState } from "react";
import { ArrowRight, Mail, Check } from "lucide-react";

export function EmailSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function subscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (email.trim()) setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-[#f1f0ea] px-4 py-3 text-sm text-[#171714]">
        <Check size={16} className="text-[#c49a3a]" />
        <span>You&apos;re on the list!</span>
      </div>
    );
  }

  return (
    <form onSubmit={subscribe} className="w-full">
      <label
        htmlFor="email"
        className="mb-2 block text-[13px] font-bold text-[#171714]"
      >
        Get the first edition
      </label>
      
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Email Input */}
        <div className="relative flex-1">
          <Mail
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#686861]"
          />
          <input
            id="email"
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="h-12 w-full rounded-lg border border-[#e8e8e2] bg-white pl-11 pr-4 text-sm text-[#171714] outline-none transition focus:border-[#c49a3a] focus:ring-2 focus:ring-[#c49a3a]/20"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#171714] px-6 font-bold !text-white transition hover:bg-[#2a2a28]"
        >
          Join Lexep
          <ArrowRight size={16} />
        </button>
      </div>

      <small className="mt-2 block text-[12px] text-[#686861]">
        No noise. Just meaningful updates.
      </small>
    </form>
  );
}