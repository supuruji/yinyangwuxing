import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'dissertation-ko');

export interface KoSegment {
  index: number;
  type: 'chapter' | 'section';
  number: string;
  title: string;
  content: string;
}

export interface KoIndexItem {
  index: number;
  type: 'chapter' | 'section';
  number: string;
  title: string;
}

export function getKoIndex(): KoIndexItem[] {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, 'index.json'), 'utf-8');
  return JSON.parse(raw);
}

export function getKoSegment(index: number): KoSegment {
  const fname = `segment_${String(index).padStart(3, '0')}.json`;
  const raw = fs.readFileSync(path.join(CONTENT_DIR, fname), 'utf-8');
  return JSON.parse(raw);
}

export const KO_TOTAL = 17;

export const KO_META = {
  titleKo: '동학사상과 대순사상의 자생적 근대성 비교 연구',
  subtitleKo: '—천관·지관·인간관을 중심으로—',
  titleEn:
    'Comparative Study on Indigenous Modernity of Donghak Thought and Daesoon Thought: Focusing on Trinity of Heaven, Earth and Man',
  author: '崔原爀 (최원혁)',
  supervisor: '高南植 (고남식)',
  affiliation: '大眞大學校 大學院 · 大巡宗學科',
  date: '2024년 7월',
};
