"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ed-cream px-4">
      <div className="w-full max-w-md rounded-xl border border-ed-border bg-ed-card p-8 text-center shadow-sm">
        <div className="mb-4 text-4xl">⚠️</div>
        <h2 className="mb-2 font-display text-xl font-bold text-ed-ink">
          Something went wrong
        </h2>
        <p className="mb-6 text-sm text-ed-ink-muted">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="rounded-lg bg-ed-teal/10 px-6 py-2.5 text-sm font-semibold text-ed-teal transition-colors hover:bg-ed-teal/20"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-lg border border-ed-border px-6 py-2.5 text-sm font-semibold text-ed-ink-muted transition-colors hover:bg-ed-warm"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
