import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'dissertation-zh');

export interface ZhSegment {
  index: number;
  type: 'chapter' | 'section';
  number: string;
  title: string;
  content: string;
}

export interface ZhIndexItem {
  index: number;
  type: 'chapter' | 'section';
  number: string;
  title: string;
}

export function getZhIndex(): ZhIndexItem[] {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, 'index.json'), 'utf-8');
  return JSON.parse(raw);
}

export function getZhSegment(index: number): ZhSegment {
  const fname = `segment_${String(index).padStart(3, '0')}.json`;
  const raw = fs.readFileSync(path.join(CONTENT_DIR, fname), 'utf-8');
  return JSON.parse(raw);
}

export const ZH_TOTAL = 17;

// Dissertation cover metadata (Chinese)
export const ZH_META = {
  titleZh: '东学思想与大巡思想的自生的近代性比较研究',
  subtitleZh: '——以天观·地观·人观为中心——',
  titleEn:
    'Comparative Study on Indigenous Modernity of Donghak Thought and Daesoon Thought: Focusing on Trinity of Heaven, Earth and Man',
  author: '崔原爀',
  supervisor: '高南植',
  affiliation: '大真大学校 大学院 · 大巡宗学科',
  date: '2024年7月',
};
