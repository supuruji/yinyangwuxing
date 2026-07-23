import { ko } from '@/content/ko';
import { en } from '@/content/en';
import { zh } from '@/content/zh';
import { ja } from '@/content/ja';
import type { SiteContent, Locale } from '@/content/types';

const contentMap: Record<Locale, SiteContent> = { ko, en, zh, ja };

export function getContent(locale: string): SiteContent {
  return contentMap[(locale as Locale)] ?? ko;
}

export const locales: Locale[] = ['ko', 'en', 'zh', 'ja'];

export const localeLabels: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
  zh: '中文',
  ja: '日本語',
};
