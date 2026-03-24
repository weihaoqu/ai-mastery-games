import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Be_Vietnam_Pro, Space_Grotesk, Nunito } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import Analytics from "@/components/Analytics";
import "../globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-headline",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-label",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const nunito = Nunito({
  variable: "--font-headline",
  subsets: ["latin"],
  weight: ["800"],
});

export const metadata: Metadata = {
  title: "AI Mastery Games",
  description:
    "Test your AI proficiency across interactive challenges — detect hallucinations, craft prompts, and solve AI puzzles.",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${plusJakarta.variable} ${beVietnam.variable} ${spaceGrotesk.variable} ${nunito.variable} bg-surface text-on-surface antialiased font-body`}
      >
        <NextIntlClientProvider messages={messages}>
          <Analytics />
          <div className="flex min-h-screen flex-col">{children}</div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
