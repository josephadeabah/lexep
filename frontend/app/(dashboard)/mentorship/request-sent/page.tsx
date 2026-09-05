import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function RequestSentPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center text-center">
      <div className="card-level1 w-full p-md">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-fixed">
          <CheckCircle2 className="h-8 w-8 text-on-primary-fixed-variant" />
        </span>
        <h1 className="mt-6 text-headline-lg text-on-background">Request Sent</h1>
        <p className="mt-3 text-body-md text-on-surface-variant">
          Your mentorship request has been successfully submitted. The mentor will review your profile and
          get back to you within 48 hours.
        </p>

        <div className="mt-lg flex flex-col gap-3">
          <Button href="/mentorship" variant="secondary" className="w-full">
            View My Requests
          </Button>
          <Button href="/dashboard" variant="ghost" className="w-full">
            Back to Dashboard
          </Button>
        </div>

        <p className="mt-md border-t border-outline-variant/40 pt-md text-label-sm text-on-surface-variant">
          Need help? <Link href="/help" className="text-primary hover:underline">Contact Support</Link>
        </p>
      </div>
    </div>
  );
}
