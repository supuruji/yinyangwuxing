import type { SiteContent } from './types';

const YOUTUBE = 'https://www.youtube.com/@%EC%B5%9C%EC%9B%90%ED%98%81-b3r';

export const en: SiteContent = {
  meta: {
    title: 'Yin-Yang Five Elements — Choi Won-hyeok Academic Research',
    description: 'Academic research on Donghak, Daesoon thought, and Yin-Yang Five Elements',
  },
  nav: {
    home: 'Home',
    dissertation: 'Dissertations',
    papers: 'Papers',
    books: 'Books',
    yinyang: 'Yin-Yang',
    ai: 'AI',
    homepage: 'Build a Website',
    masters: "Master's Thesis",
    doctoral: 'Doctoral Dissertation',
    visitYoutube: 'Watch on YouTube',
    visitWebsite: 'Visit Website',
    downloadPdf: 'Download PDF',
    comingSoon: 'Coming Soon',
    backToTop: 'Back to List',
    dissertationDesc: "Master's and Doctoral dissertations",
    papersDesc: 'Journal and conference papers',
    booksDesc: 'Authored books',
    yinyangDesc: 'Yin-Yang Five Elements research and content',
    aiDesc: 'AI usage guides and practical materials',
    homepageDesc: 'A complete guide to building your own website with AI',
  },
  home: {
    heading: '陰陽五行',
    subheading: 'Choi Won-hyeok Academic Research',
    intro: 'Research on endogenous modernity in Donghak and Daesoon thought, circular economic perspective, and the three-dimensional interpretation of Yin-Yang Five Elements.',
  },
  dissertation: {
    doctoral: [
      {
        id: 'doctoral-donghak-daesoon',
        title: 'A Comparative Study of Endogenous Modernity in Donghak and Daesoon Thought',
        subtitle: 'Doctoral Dissertation',
        description: 'A doctoral dissertation comparing and analyzing the endogenous modernity inherent in Donghak and Daesoon thought.',
        youtubeUrl: 'https://www.youtube.com/playlist?list=PLw9IxWay4JN9xt7bVaB4LcKP9evomr22s',
        websiteUrl: '/en/dissertation/doctoral/donghak-daesoon-en',
      },
    ],
    masters: [
      {
        id: 'masters-daesoon-economy',
        title: "Daesoon Thought's Circular Economic View",
        subtitle: "Master's Thesis",
        description: "A master's thesis studying the circular characteristics of economic thought in Daesoon ideology.",
        youtubeUrl: YOUTUBE,
        websiteUrl: '/en/dissertation/masters/daesoon-economics-en',
      },
    ],
  },
  papers: [
    {
      id: 'papers-placeholder',
      title: 'Papers Coming Soon',
      subtitle: 'Updates forthcoming',
      comingSoon: true,
    },
  ],
  books: [
    {
      id: 'book-ai-survival',
      title: 'Human Survival Strategies in the AI Era',
      subtitle: 'Book',
      description: 'A book exploring strategies for human survival in the age of artificial intelligence.',
      youtubeUrl: YOUTUBE,
    },
  ],
  yinyang: [
    {
      id: 'yinyang-3d',
      title: 'Three-Dimensional Five Elements',
      subtitle: 'Yin-Yang Five Elements',
      description: 'Research on the three-dimensional interpretation and modern application of Yin-Yang Five Elements.',
      youtubeUrl: YOUTUBE,
    },
  ],
  ai: {
    homepage: [
      {
        id: 'ai-homepage-guide',
        title: 'A Complete 6-Step Guide to Building a Website — Even for Beginners (Full)',
        subtitle: 'AI · Build a Website · Full Guide',
        description: 'From buying a domain to configuring Vercel, GitHub, Obsidian, and Google Drive, then installing Claude Code and building and deploying your site — a complete 6-step guide any beginner can follow (Korean).',
        pdfUrl: '/pdf/website-guide-ko.pdf',
        youtubeUrl: 'https://youtu.be/5L5IP7iyvko',
      },
      {
        id: 'ai-homepage-ch00',
        title: '00. Introduction · Overall Flow',
        subtitle: 'AI · Build a Website · Chapter-by-Chapter',
        description: 'The introductory chapter that walks through the overall flow of the 6-step website-building guide (Korean).',
        youtubeUrl: 'https://youtu.be/qQfcldWYc-E',
      },
    ],
  },
};
