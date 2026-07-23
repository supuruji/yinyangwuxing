import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'dissertation-ja');

export interface JaSegment {
  index: number;
  type: 'chapter' | 'section';
  number: string;
  title: string;
  content: string;
}

export interface JaIndexItem {
  index: number;
  type: 'chapter' | 'section';
  number: string;
  title: string;
}

export function getJaIndex(): JaIndexItem[] {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, 'index.json'), 'utf-8');
  return JSON.parse(raw);
}

export function getJaSegment(index: number): JaSegment {
  const fname = `segment_${String(index).padStart(3, '0')}.json`;
  const raw = fs.readFileSync(path.join(CONTENT_DIR, fname), 'utf-8');
  return JSON.parse(raw);
}

export const JA_TOTAL = 17;

export const JA_META = {
  titleJa: '東学思想と大巡思想の自生的近代性比較研究',
  subtitleJa: '—天観・地観・人間観を中心に—',
  titleEn:
    'Comparative Study on Indigenous Modernity of Donghak Thought and Daesoon Thought: Focusing on Trinity of Heaven, Earth and Man',
  author: '崔原爀',
  supervisor: '高南植',
  affiliation: '大真大学 大学院 · 大巡宗学科',
  date: '2024年7月',
};
