import type { SiteContent } from './types';

const YOUTUBE = 'https://www.youtube.com/@%EC%B5%9C%EC%9B%90%ED%98%81-b3r';

export const ja: SiteContent = {
  meta: {
    title: '陰陽五行 — 崔元赫学術研究',
    description: '東学思想、大巡思想、陰陽五行に関する学術研究',
  },
  nav: {
    home: 'ホーム',
    dissertation: '学位論文',
    papers: '発表論文',
    books: '単行本',
    yinyang: '陰陽五行',
    masters: '修士論文',
    doctoral: '博士論文',
    visitYoutube: 'YouTubeで見る',
    visitWebsite: 'ウェブサイトへ',
    comingSoon: '近日公開',
    backToTop: '一覧へ戻る',
    dissertationDesc: '修士・博士学位論文',
    papersDesc: '学術誌・学会発表論文',
    booksDesc: '単著書籍',
    yinyangDesc: '陰陽五行関連研究・コンテンツ',
  },
  home: {
    heading: '陰陽五行',
    subheading: '崔元赫学術研究',
    intro: '東学思想と大巡思想の自生的近代性、循環的経済観、陰陽五行の立体的解釈を研究します。',
  },
  dissertation: {
    doctoral: [
      {
        id: 'doctoral-donghak-daesoon',
        title: '東学思想と大巡思想の自生的近代性比較研究',
        subtitle: '博士学位論文',
        description: '東学思想と大巡思想に内在する自生的近代性を比較分析した博士学位論文。',
        youtubeUrl: YOUTUBE,
        websiteUrl: 'https://dissertation-site.vercel.app/segment/1',
      },
    ],
    masters: [
      {
        id: 'masters-daesoon-economy',
        title: '大巡思想の循環的経済観',
        subtitle: '修士学位論文',
        description: '大巡思想における経済思想の循環的特性を研究した修士学位論文。',
        youtubeUrl: YOUTUBE,
        websiteUrl: 'https://daesoon-web.vercel.app/chapter/3',
      },
    ],
  },
  papers: [
    {
      id: 'papers-placeholder',
      title: '発表論文 近日公開',
      subtitle: '更新予定',
      comingSoon: true,
    },
  ],
  books: [
    {
      id: 'book-ai-survival',
      title: 'AI時代の人間生存戦略',
      subtitle: '単行本',
      description: 'AI時代における人間の生存戦略を探求した著書。',
      youtubeUrl: YOUTUBE,
    },
  ],
  yinyang: [
    {
      id: 'yinyang-3d',
      title: '立体五行',
      subtitle: '陰陽五行',
      description: '陰陽五行の立体的解釈と現代的応用に関する研究。',
      youtubeUrl: YOUTUBE,
    },
  ],
};
