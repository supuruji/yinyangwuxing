import type { SiteContent } from './types';

const YOUTUBE = 'https://www.youtube.com/@%EC%B5%9C%EC%9B%90%ED%98%81-b3r';

export const zh: SiteContent = {
  meta: {
    title: '阴阳五行 — 崔元赫学术研究',
    description: '关于东学思想、大巡思想和阴阳五行的学术研究',
  },
  nav: {
    home: '首页',
    dissertation: '学位论文',
    papers: '发表论文',
    books: '单行本',
    yinyang: '阴阳五行',
    masters: '硕士论文',
    doctoral: '博士论文',
    visitYoutube: '观看视频',
    visitWebsite: '访问网站',
    comingSoon: '即将推出',
    backToTop: '返回列表',
    dissertationDesc: '硕士及博士学位论文',
    papersDesc: '期刊及学术会议论文',
    booksDesc: '独著单行本',
    yinyangDesc: '阴阳五行相关研究与内容',
  },
  home: {
    heading: '陰陽五行',
    subheading: '崔元赫学术研究',
    intro: '研究东学思想与大巡思想的自生性近代性、循环经济观及阴阳五行的立体诠释。',
  },
  dissertation: {
    doctoral: [
      {
        id: 'doctoral-donghak-daesoon',
        title: '东学思想与大巡思想自生性近代性比较研究',
        subtitle: '博士学位论文',
        description: '比较分析东学思想与大巡思想内在自生性近代性的博士学位论文。',
        youtubeUrl: YOUTUBE,
        websiteUrl: 'https://dissertation-site.vercel.app/segment/1',
      },
    ],
    masters: [
      {
        id: 'masters-daesoon-economy',
        title: '大巡思想的循环经济观',
        subtitle: '硕士学位论文',
        description: '研究大巡思想中经济思想循环特性的硕士学位论文。',
        youtubeUrl: YOUTUBE,
        websiteUrl: 'https://daesoon-web.vercel.app/chapter/3',
      },
    ],
  },
  papers: [
    {
      id: 'papers-placeholder',
      title: '论文即将发布',
      subtitle: '敬请期待',
      comingSoon: true,
    },
  ],
  books: [
    {
      id: 'book-ai-survival',
      title: 'AI时代人类生存战略',
      subtitle: '单行本',
      description: '探讨人工智能时代人类生存战略的著作。',
      youtubeUrl: YOUTUBE,
    },
  ],
  yinyang: [
    {
      id: 'yinyang-3d',
      title: '立体五行',
      subtitle: '阴阳五行',
      description: '关于阴阳五行立体诠释与现代应用的研究。',
      youtubeUrl: YOUTUBE,
    },
  ],
};
