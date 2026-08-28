"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function RequestSentPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fbf9f8] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] sm:p-10">
        {/* Icon */}
        <div className="flex justify-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f7edc9]">
            <CheckCircle2 className="h-10 w-10 text-[#735c00]" />
          </span>
        </div>

        {/* Heading */}
        <h1 className="mt-8 text-center font-['Hanken_Grotesk'] text-4xl font-bold tracking-[-0.045em] text-[#1b1c1c]">
          Request Sent
        </h1>

        {/* Description */}
        <p className="mt-4 text-center text-base leading-relaxed text-[#6d6a66]">
          Your mentorship request has been successfully submitted. The mentor will review your
          profile and get back to you within 48 hours.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3">
          <Button
            href="/mentorship"
            variant="secondary"
            className="h-12 w-full bg-[#1b1c1c] font-semibold text-white hover:bg-[#2a2b2b]"
          >
            View My Requests
          </Button>
          <Button
            href="/dashboard"
            variant="outline"
            className="h-12 w-full border-[#e0d8c9] font-semibold"
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-8 border-t border-[#e0d8c9]/40 pt-6 text-center">
          <p className="text-sm text-[#6d6a66]">
            Need help?{" "}
            <Link href="/help" className="font-semibold text-[#735c00] hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
