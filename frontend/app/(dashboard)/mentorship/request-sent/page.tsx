import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function RequestSentPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center text-center">
      <div className="card-level1 p-md w-full">
        <span className="bg-primary-fixed mx-auto flex h-16 w-16 items-center justify-center rounded-full">
          <CheckCircle2 className="text-on-primary-fixed-variant h-8 w-8" />
        </span>
        <h1 className="text-headline-lg text-on-background mt-6">Request Sent</h1>
        <p className="text-body-md text-on-surface-variant mt-3">
          Your mentorship request has been successfully submitted. The mentor will review your
          profile and get back to you within 48 hours.
        </p>

        <div className="mt-lg flex flex-col gap-3">
          <Button href="/mentorship" variant="secondary" className="w-full">
            View My Requests
          </Button>
          <Button href="/dashboard" variant="ghost" className="w-full">
            Back to Dashboard
          </Button>
        </div>

        <p className="mt-md border-outline-variant/40 pt-md text-label-sm text-on-surface-variant border-t">
          Need help?{" "}
          <Link href="/help" className="text-primary hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}
