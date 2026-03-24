import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md rounded-2xl border-3 border-outline-variant bg-surface-container-lowest p-8 text-center shadow-[0_4px_0_#a8cc88]">
        <div className="mb-4 font-headline text-5xl text-primary/30">404</div>
        <h2 className="mb-2 font-headline text-xl text-on-surface">
          Page not found
        </h2>
        <p className="mb-6 text-sm text-on-surface-variant">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block rounded-xl border-2 border-primary bg-gradient-to-r from-primary-container to-primary px-6 py-2.5 text-sm font-extrabold text-white shadow-[0_3px_0_#2d6e3a] transition-transform hover:translate-y-[1px] hover:shadow-[0_2px_0_#2d6e3a]"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
