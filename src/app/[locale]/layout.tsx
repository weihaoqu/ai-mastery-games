import type { Metadata } from "next";
import { Nunito, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import "../globals.css";

const nunito = Nunito({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
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
      <body
        className={`${nunito.variable} ${jetbrainsMono.variable} bg-ed-cream text-ed-ink antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-screen flex-col">{children}</div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
