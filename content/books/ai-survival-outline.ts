// Card outline for the book "ai-survival" — mirrors the master's-thesis card UI.
// Titles are pulled from the localized Book at render time; only structural/media
// metadata lives here.
//
// Videos are per LANGUAGE (Korean, English, Chinese, Japanese), each with its own
// YouTube playlist, so youtubeIds is keyed by locale. The Korean & Chinese playlists
// carry a dedicated Part-Ⅰ conclusion video (Ⅰ6 → chapter-6); the English & Japanese
// playlists do not, so chapter-6 has no id there and the card falls back to the
// locale playlist. A separate "full" video (per locale) is the whole-book overview.

export interface BookOutlineItem {
  /** short code shown on the card (chapter number or symbol) */
  code: string;
  /** reader chapter id (target of the 본문/Read button) */
  chapter: string;
  /** part-group key for the sticky header */
  group: string;
  /** presentation PDF basename under /pdf/books/<id>/<locale>/ */
  pdfSlug: string;
  /** per-locale YouTube video id (empty/missing → falls back to the locale playlist) */
  youtubeIds: Record<string, string>;
}

export const AI_SURVIVAL_OUTLINE: BookOutlineItem[] = [
  { code: '서',  chapter: 'preface',    group: 'front', pdfSlug: '00-preface',
    youtubeIds: { ko: '-Dym6fCtTSw', en: 'n7fHMQzT7kA', zh: '_K8AFiJ7UCQ', ja: 'OFCLh5yDI9o' } },
  { code: '1',  chapter: 'chapter-1',  group: 'part1', pdfSlug: '01-intro',
    youtubeIds: { ko: 'PpG270UhCu4', en: 'mqWL9ro7vEE', zh: 'TgDMHJbLuH4', ja: 'iswr05pV3yw' } },
  { code: '2',  chapter: 'chapter-2',  group: 'part1', pdfSlug: '02-ipche',
    youtubeIds: { ko: '2MUOCgSkynA', en: 'hUWky2Y5tGw', zh: 'MFDA9aD0lcg', ja: '2wzrkIvVa94' } },
  { code: '3',  chapter: 'chapter-3',  group: 'part1', pdfSlug: '03-sunhwan',
    youtubeIds: { ko: '5Nv9H2beWNc', en: 'raB4rtomS-4', zh: 'KylVII8qfI4', ja: 'Z_jzE5Yt0oc' } },
  { code: '4',  chapter: 'chapter-4',  group: 'part1', pdfSlug: '04-gonggam',
    youtubeIds: { ko: 'dSeOwQd--fg', en: 'NDVfoMgf9hw', zh: 'l98FYPAP1PA', ja: 'jJR6ImD6nO8' } },
  { code: '5',  chapter: 'chapter-5',  group: 'part1', pdfSlug: '05-yunghap',
    youtubeIds: { ko: 'G_dZJqS24BE', en: 'YaZfni23ccg', zh: 'DJXrrUTj-6M', ja: '3wfz4oQDG2Q' } },
  { code: '6',  chapter: 'chapter-6',  group: 'part1', pdfSlug: '06-part1-conclusion',
    youtubeIds: { ko: 'hkhhdBOXhk0', zh: 'ufzX_X-FFqE' } },
  { code: '7',  chapter: 'chapter-7',  group: 'part2', pdfSlug: '07-sammun-hwajaeng',
    youtubeIds: { ko: 'gvhfFTdZxs8', en: 'ahpsQEypne4', zh: 'jTlA85Rkdes', ja: 'bhf4tUm6Cho' } },
  { code: '8',  chapter: 'chapter-8',  group: 'part2', pdfSlug: '08-wonhyo-economy',
    youtubeIds: { ko: 'zDOZknarCac', en: '4PIVLLMyw54', zh: 'MrzvnnMy7Ag', ja: 'FdXr9DKa2-8' } },
  { code: '9',  chapter: 'chapter-9',  group: 'part2', pdfSlug: '09-symbiotic-economy',
    youtubeIds: { ko: 'SL0joBEY5x8', en: 'sGpwnOLlRQE', zh: 'USBmPN3Wo6w', ja: '7dygn4SXblw' } },
  { code: '10', chapter: 'chapter-10', group: 'part2', pdfSlug: '10-part2-conclusion',
    youtubeIds: { ko: 'Cts0XDSRWdA', en: 'JpIepX8Fbbc', zh: 'JngPxvjMbYI', ja: '9pykiZOM17o' } },
];

/** Whole-book overview video ("full"), per locale (shown as a top "개요 영상" button). */
export const AI_SURVIVAL_OVERVIEW_IDS: Record<string, string> = {
  ko: '2FBhUTRkhR0', en: 'Mw-7bXrMgQA', zh: 'E1QaFGrYTY0', ja: 'i51ncE2NORk',
};

/** Fallback channel when a locale has no dedicated playlist. */
export const AI_SURVIVAL_CHANNEL =
  'https://www.youtube.com/@%EC%B5%9C%EC%9B%90%ED%98%81-b3r';

/** Per-locale YouTube playlist (한·영·중·일). */
export const AI_SURVIVAL_PLAYLISTS: Record<string, string> = {
  ko: 'https://www.youtube.com/playlist?list=PLw9IxWay4JN_jOLCcdUOfvcntJ-9XhmGs',
  en: 'https://www.youtube.com/playlist?list=PLDSt-WgvI5TM',
  zh: 'https://www.youtube.com/playlist?list=PLTzZguREvN70',
  ja: 'https://www.youtube.com/playlist?list=PLVt4bJUDTnsM',
};
