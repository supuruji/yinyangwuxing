// Card outline for the book "ai-survival" — mirrors the master's-thesis card UI.
// Titles are pulled from the localized Book at render time; only structural/media
// metadata lives here. youtubeId is filled per section from the book playlist.

export interface BookOutlineItem {
  /** short code shown on the card (chapter number or symbol) */
  code: string;
  /** reader chapter id (target of the 본문/Read button) */
  chapter: string;
  /** part-group key for the sticky header */
  group: string;
  /** presentation PDF basename under /pdf/books/<id>/<locale>/ */
  pdfSlug: string;
  /** per-section YouTube video id (empty → falls back to the playlist URL) */
  youtubeId: string;
}

export const AI_SURVIVAL_OUTLINE: BookOutlineItem[] = [
  { code: '서', chapter: 'preface',    group: 'front', pdfSlug: '00-preface',             youtubeId: '' },
  { code: '1',  chapter: 'chapter-1',  group: 'part1', pdfSlug: '01-intro',               youtubeId: '' },
  { code: '2',  chapter: 'chapter-2',  group: 'part1', pdfSlug: '02-ipche',               youtubeId: '' },
  { code: '3',  chapter: 'chapter-3',  group: 'part1', pdfSlug: '03-sunhwan',             youtubeId: '' },
  { code: '4',  chapter: 'chapter-4',  group: 'part1', pdfSlug: '04-gonggam',             youtubeId: '' },
  { code: '5',  chapter: 'chapter-5',  group: 'part1', pdfSlug: '05-yunghap',             youtubeId: '' },
  { code: '6',  chapter: 'chapter-6',  group: 'part1', pdfSlug: '06-part1-conclusion',    youtubeId: '' },
  { code: '7',  chapter: 'chapter-7',  group: 'part2', pdfSlug: '07-sammun-hwajaeng',     youtubeId: '' },
  { code: '8',  chapter: 'chapter-8',  group: 'part2', pdfSlug: '08-wonhyo-economy',      youtubeId: '' },
  { code: '9',  chapter: 'chapter-9',  group: 'part2', pdfSlug: '09-symbiotic-economy',   youtubeId: '' },
  { code: '10', chapter: 'chapter-10', group: 'part2', pdfSlug: '10-part2-conclusion',    youtubeId: '' },
];

/** YouTube playlist for the book (per-card youtubeId links resolve within it). */
export const AI_SURVIVAL_PLAYLIST =
  'https://www.youtube.com/@%EC%B5%9C%EC%9B%90%ED%98%81-b3r';
