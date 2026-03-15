import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="en">
      <body className="bg-[#e8f5d8] text-[#1e3a12] antialiased" style={{ fontFamily: "'Nunito', system-ui, sans-serif" }}>
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl border-3 border-[#b8d89c] bg-[#fffef8] p-8 text-center shadow-[0_4px_0_#a8cc88]">
            <div className="mb-4 text-5xl font-extrabold text-[#3ba85a]/30">404</div>
            <h2 className="mb-2 text-xl font-extrabold text-[#1e3a12]">
              Page not found
            </h2>
            <p className="mb-6 text-sm text-[#5a7a48]">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <Link
              href="/"
              className="inline-block rounded-xl border-2 border-[#2d8a47] bg-gradient-to-r from-[#4ec06a] to-[#3ba85a] px-6 py-2.5 text-sm font-extrabold text-white shadow-[0_3px_0_#2d6e3a] transition-transform hover:translate-y-[1px] hover:shadow-[0_2px_0_#2d6e3a]"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
