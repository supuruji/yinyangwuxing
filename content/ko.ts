import type { SiteContent } from './types';

const YOUTUBE = 'https://www.youtube.com/@%EC%B5%9C%EC%9B%90%ED%98%81-b3r';

export const ko: SiteContent = {
  meta: {
    title: '음양오행 — 최원혁 학술연구',
    description: '동학사상, 대순사상, 음양오행에 관한 학술연구 및 저작물',
  },
  nav: {
    home: '홈',
    dissertation: '학위논문',
    papers: '발표논문',
    books: '단행본',
    yinyang: '음양오행',
    masters: '석사논문',
    doctoral: '박사논문',
    visitYoutube: '유튜브 보기',
    visitWebsite: '홈페이지 방문',
    comingSoon: '준비 중',
    backToTop: '목록으로',
    dissertationDesc: '석사 및 박사 학위논문',
    papersDesc: '학술지 및 학술대회 발표논문',
    booksDesc: '단독 저술 단행본',
    yinyangDesc: '음양오행 관련 연구 및 콘텐츠',
  },
  home: {
    heading: '陰陽五行',
    subheading: '최원혁 학술연구',
    intro: '동학사상과 대순사상의 자생적 근대성, 순환적 경제관, 음양오행의 입체적 해석을 연구합니다.',
  },
  dissertation: {
    doctoral: [
      {
        id: 'doctoral-donghak-daesoon',
        title: '동학사상과 대순사상의 자생적근대성 비교 연구',
        subtitle: '박사학위논문',
        description: '동학사상과 대순사상에 내재된 자생적 근대성을 비교 분석한 박사학위논문입니다.',
        youtubeUrl: YOUTUBE,
        websiteUrl: 'https://dissertation-site.vercel.app/segment/1',
      },
    ],
    masters: [
      {
        id: 'masters-daesoon-economy',
        title: '대순사상의 순환적 경제관',
        subtitle: '석사학위논문',
        description: '대순사상에 나타난 경제 사상의 순환적 특성을 연구한 석사학위논문입니다.',
        youtubeUrl: YOUTUBE,
        websiteUrl: 'https://daesoon-web.vercel.app/chapter/3',
      },
    ],
  },
  papers: [
    // 발표논문을 추가하려면 아래 형식으로 항목을 추가하세요:
    // {
    //   id: 'paper-고유ID',
    //   title: '논문 제목',
    //   subtitle: '게재지 또는 학술대회명',
    //   description: '논문 요약',
    //   youtubeUrl: '유튜브 재생목록 URL',
    //   websiteUrl: '논문 홈페이지 URL',
    // },
    {
      id: 'papers-placeholder',
      title: '발표논문 준비 중',
      subtitle: '곧 업데이트됩니다',
      comingSoon: true,
    },
  ],
  books: [
    {
      id: 'book-ai-survival',
      title: 'AI시대 상관적 사유와 화쟁을 통한 인류의 생존전략',
      subtitle: '단행본 · 가설과상상총서 ①',
      description: 'AI 시대에 입체(立體)·순환(循環)·공감(共感)·융합(融合)의 4가지 상관적 사유와 원효의 화쟁이론을 통해 인류의 생존 전략을 탐구한 저서입니다.',
      youtubeUrl: YOUTUBE,
      websiteUrl: '/ko/books/ai-survival',
    },
    // 단행본을 추가하려면 아래 형식으로 항목을 추가하세요:
    // {
    //   id: 'book-고유ID',
    //   title: '도서 제목',
    //   subtitle: '단행본',
    //   description: '도서 소개',
    //   youtubeUrl: '유튜브 URL',
    //   websiteUrl: '도서 홈페이지 URL',
    // },
  ],
  yinyang: [
    {
      id: 'yinyang-3d',
      title: '입체오행',
      subtitle: '음양오행',
      description: '음양오행의 입체적 해석과 현대적 적용에 관한 연구입니다.',
      youtubeUrl: YOUTUBE,
    },
    // 음양오행 항목을 추가하려면 아래 형식으로 항목을 추가하세요:
    // {
    //   id: 'yinyang-고유ID',
    //   title: '항목 제목',
    //   subtitle: '음양오행',
    //   description: '설명',
    //   youtubeUrl: '유튜브 URL',
    //   websiteUrl: '홈페이지 URL',
    // },
  ],
};
