import fs from 'fs';
import path from 'path';

export interface BookSegment {
  index: number;
  type: 'chapter' | 'section';
  part: string;
  navTitle: string;
  title: string;
  content: string;
}

export interface BookIndexItem {
  index: number;
  type: 'chapter' | 'section';
  part: string;
  navTitle: string;
  title: string;
}

export const BOOK_TOTAL = 12;

function dirFor(locale: string): string {
  if (locale === 'ja') return 'book-ai-survival-ja';
  if (locale === 'zh') return 'book-ai-survival-zh';
  return 'book-ai-survival';
}

function contentDir(locale: string): string {
  return path.join(process.cwd(), 'content', dirFor(locale));
}

export function getBookIndex(locale: string): BookIndexItem[] {
  const raw = fs.readFileSync(path.join(contentDir(locale), 'index.json'), 'utf-8');
  return JSON.parse(raw);
}

export function getBookSegment(locale: string, index: number): BookSegment {
  const fname = `segment_${String(index).padStart(3, '0')}.json`;
  const raw = fs.readFileSync(path.join(contentDir(locale), fname), 'utf-8');
  return JSON.parse(raw);
}

// Cover metadata per language
interface BookMeta {
  title: string;
  subtitle: string;
  series: string;
  author: string;
  publisher: string;
  date: string;
  note: string;
}

const META_EN: BookMeta = {
  title: 'Survival Strategies for Humanity in the AI Era through Correlative Thinking and Hwajaeng',
  subtitle: 'Centered on Multidimensionality, Circulation, Empathy, and Convergence',
  series: 'Hypothesis-and-Imagination Series ①',
  author: 'Choi Won-hyeok',
  publisher: 'Bookk Co., Ltd.',
  date: 'April 10, 2026',
  note:
    'A complete English translation of the Korean book "AI시대 상관적 사유와 화쟁을 통한 인류의 생존전략" (46th revised final edition). Korean and Chinese-character terms are romanized and glossed in parentheses on first appearance.',
};

const META_JA: BookMeta = {
  title: 'AI時代における相関的思惟と和諍による人類の生存戦略',
  subtitle: '立体・循環・共感・融合を中心に',
  series: '仮説と想像叢書 ①',
  author: '崔元爀',
  publisher: '株式会社ブックク（Bookk）',
  date: '2026年4月10日',
  note:
    '韓国語の書籍『AI시대 상관적 사유와 화쟁을 통한 인류의 생존전략』（第46改訂最終版）の全訳である。韓国語・漢字語の用語は初出時に括弧内で漢字・読みを補った。',
};

const META_ZH: BookMeta = {
  title: 'AI时代通过相关性思维与和诤实现人类生存战略',
  subtitle: '以立体、循环、共感、融合为中心',
  series: '假设与想象丛书 ①',
  author: '崔元爀',
  publisher: '株式会社Bookk',
  date: '2026年4月10日',
  note:
    '韩语著作《AI시대 상관적 사유와 화쟁을 통한 인류의 생존전략》（第46修订最终版）的全译本。韩语及汉字术语在首次出现时于括号内补注汉字与含义。',
};

export function getBookMeta(locale: string): BookMeta {
  if (locale === 'ja') return META_JA;
  if (locale === 'zh') return META_ZH;
  return META_EN;
}

export function getPartLabels(locale: string): Record<string, string> {
  if (locale === 'ja') {
    return {
      I: 'Ⅰ．理論編：四つの相関的思惟',
      II: 'Ⅱ．応用編：和諍理論と相生経済',
    };
  }
  if (locale === 'zh') {
    return {
      I: '一、理论篇：四种相关性思维',
      II: '二、应用篇：和诤理论与相生经济',
    };
  }
  return {
    I: 'Part I — Theory: The Four Modes of Correlative Thinking',
    II: 'Part II — Application: Hwajaeng & the Mutually Flourishing Economy',
  };
}

// UI strings per language
interface BookUi {
  sidebarTitle: string;
  contents: string;
  previous: string;
  next: string;
  startReading: string;
  hint: string;
  breadcrumbTail: string;
  partEyebrow: (part: string) => string;
}

export function getBookUi(locale: string): BookUi {
  if (locale === 'ja') {
    return {
      sidebarTitle: 'AI時代の生存戦略',
      contents: '目次',
      previous: '前へ',
      next: '次へ',
      startReading: '読み始める →',
      hint: '左側の目次から各章に移動できます。',
      breadcrumbTail: 'AI時代 · 生存戦略',
      partEyebrow: (p) => `第${p === 'I' ? 'Ⅰ' : 'Ⅱ'}部`,
    };
  }
  if (locale === 'zh') {
    return {
      sidebarTitle: 'AI时代的生存战略',
      contents: '目录',
      previous: '上一节',
      next: '下一节',
      startReading: '开始阅读 →',
      hint: '可从左侧目录点击任一章节直接阅读。',
      breadcrumbTail: 'AI时代 · 生存战略',
      partEyebrow: (p) => `第${p === 'I' ? '一' : '二'}部`,
    };
  }
  return {
    sidebarTitle: 'Survival Strategies in the AI Era',
    contents: 'Contents',
    previous: 'Previous',
    next: 'Next',
    startReading: 'Start reading →',
    hint: 'Use the table of contents on the left to jump to any chapter.',
    breadcrumbTail: 'AI Era · Survival Strategies',
    partEyebrow: (p) => `Part ${p}`,
  };
}
