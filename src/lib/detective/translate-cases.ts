import type { Case } from '../types';

// Translation overlay structure matching the JSON files
interface CaseTranslation {
  title?: string;
  briefing?: string;
  context?: string;
  evidence?: Record<string, { title?: string; content?: string }>;
  question?: string;
  options?: Record<string, { text?: string; explanation?: string }>;
  correctDiagnosis?: string;
  recommendedFix?: string;
}

type CaseTranslations = Record<string, CaseTranslation>;

// Cache loaded translations
const translationCache: Record<string, CaseTranslations | null> = {};

async function loadTranslations(locale: string): Promise<CaseTranslations | null> {
  if (locale === 'en') return null; // English is the source, no overlay needed
  if (locale in translationCache) return translationCache[locale];

  try {
    const mod = await import(`@/locales/cases/${locale}.json`);
    translationCache[locale] = mod.default;
    return mod.default;
  } catch {
    translationCache[locale] = null;
    return null;
  }
}

function applyTranslation(case_: Case, translation: CaseTranslation): Case {
  return {
    ...case_,
    title: translation.title ?? case_.title,
    briefing: translation.briefing ?? case_.briefing,
    context: translation.context ?? case_.context,
    question: translation.question ?? case_.question,
    correctDiagnosis: translation.correctDiagnosis ?? case_.correctDiagnosis,
    recommendedFix: translation.recommendedFix ?? case_.recommendedFix,
    evidence: case_.evidence.map(ev => {
      const evTrans = translation.evidence?.[ev.id];
      if (!evTrans) return ev;
      return {
        ...ev,
        title: evTrans.title ?? ev.title,
        content: evTrans.content ?? ev.content,
      };
    }),
    options: case_.options.map(opt => {
      const optTrans = translation.options?.[opt.id];
      if (!optTrans) return opt;
      return {
        ...opt,
        text: optTrans.text ?? opt.text,
        explanation: optTrans.explanation ?? opt.explanation,
      };
    }),
  };
}

export async function translateCases(cases: Case[], locale: string): Promise<Case[]> {
  const translations = await loadTranslations(locale);
  if (!translations) return cases; // English or missing translation = use originals

  return cases.map(c => {
    const trans = translations[c.id];
    if (!trans) return c; // No translation for this case = use original
    return applyTranslation(c, trans);
  });
}
