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
    masters: "Master's Thesis",
    doctoral: 'Doctoral Dissertation',
    visitYoutube: 'Watch on YouTube',
    visitWebsite: 'Visit Website',
    comingSoon: 'Coming Soon',
    backToTop: 'Back to List',
    dissertationDesc: "Master's and Doctoral dissertations",
    papersDesc: 'Journal and conference papers',
    booksDesc: 'Authored books',
    yinyangDesc: 'Yin-Yang Five Elements research and content',
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
        youtubeUrl: YOUTUBE,
        websiteUrl: '/en/dissertation/doctoral/donghak-daesoon-ko',
      },
    ],
    masters: [
      {
        id: 'masters-daesoon-economy',
        title: "Daesoon Thought's Circular Economic View",
        subtitle: "Master's Thesis",
        description: "A master's thesis studying the circular characteristics of economic thought in Daesoon ideology.",
        youtubeUrl: YOUTUBE,
        websiteUrl: 'https://daesoon-web.vercel.app/chapter/3',
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
};
