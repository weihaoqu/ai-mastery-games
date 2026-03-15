export const locales = ['en', 'zh', 'es', 'de', 'it'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';
