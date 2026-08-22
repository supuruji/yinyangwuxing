// 유튜브 링크가 "구체적 페이지"(영상 또는 재생목록)인지 판별한다.
// 채널 대표화면(예: youtube.com/@handle, /channel/…, /user/…, /c/…)이면 false →
// 그런 링크는 카드/버튼에서 숨긴다. 구체적 링크가 연결되면 자동으로 다시 보인다.
const SPECIFIC = /(?:youtu\.be\/|[?&]v=|\/watch|[?&]list=|\/playlist|\/shorts\/|\/embed\/)/i;

export function isSpecificYoutube(url?: string | null): boolean {
  return !!url && SPECIFIC.test(url);
}
