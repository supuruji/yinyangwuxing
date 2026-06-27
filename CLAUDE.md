# yinyangwuxing.org — 구조 & 작업 안내서

이 문서는 **사람과 Claude Code 모두**를 위한 안내서입니다. 어느 컴퓨터에서 작업하든, 이 저장소만
clone하면 이 문서를 보고 동일한 방식으로 논문을 추가/수정·배포할 수 있습니다.

---

## 0. 가장 중요한 원칙 (한 줄 요약)

> **웹사이트에 올라가는 건 오직 이 GitHub 저장소(`supuruji/yinyangwuxing`)에 push된 내용뿐이다.**
> 구글드라이브의 원문/번역 폴더는 "작업 공간"일 뿐, 그 자체로는 사이트에 반영되지 않는다.
> 작업물을 이 저장소 형식으로 변환해 넣고 `git push` 하면 Vercel이 자동 배포한다.

```
구글드라이브 원문/번역        이 저장소                      Vercel
(폴더·경로·컴퓨터 제각각) → supuruji/yinyangwuxing(main) → yinyangwuxing.org
   = 작업 공간                = 유일한 통합 지점              = 자동 배포(1~2분)
```

- **GitHub ↔ Vercel 연결은 영구적**입니다. 컴퓨터·폴더가 바뀌어도 다시 설정하지 않습니다.
- `main` 브랜치에 push → 자동으로 프로덕션(yinyangwuxing.org) 배포.

---

## 1. 컴퓨터/폴더가 바뀔 때 (clone 규칙)

- `git clone`은 **컴퓨터마다 딱 한 번**만 합니다. 폴더를 바꿀 때마다 하는 게 아닙니다.
- 한 번 clone한 뒤에는 **그 폴더를 계속 재사용**합니다 (새 폴더 만들지 않기).
- **권장 위치(모든 컴퓨터 동일):** 홈 폴더 아래 → `C:\Users\<사용자명>\yinyangwuxing`
  - 예) 이 데스크탑: `C:\Users\user\yinyangwuxing`
  - 어느 컴퓨터든 "홈 폴더\yinyangwuxing"으로 통일하면 경로 헷갈림이 없습니다.

새 컴퓨터에서 처음 한 번:
```bash
cd ~                      # 홈 폴더로 이동
git clone https://github.com/supuruji/yinyangwuxing.git
```
이후 그 컴퓨터에서는 항상 `~/yinyangwuxing` 폴더에서 작업합니다.

> 참고: 이 repo 폴더 자체는 구글드라이브가 아닌 **로컬 디스크**에 두세요(git 내부 파일이
> 드라이브 동기화와 충돌하면 저장소가 깨질 수 있음). 원문/번역은 구글드라이브에 두어도 무방합니다.

---

## 2. 매번 작업하는 흐름 (어느 컴퓨터든 동일)

```bash
cd ~/yinyangwuxing
git pull                  # ① 항상 먼저 최신 받기 (다른 컴퓨터 작업분 동기화)
# ... 내용 추가/수정 (아래 3·4장 구조대로) ...
git add -A
git commit -m "설명"
git push                  # ② push → Vercel 자동 배포
```
- 새 컴퓨터에서 첫 push 시 GitHub 로그인 창(Credential Manager)이 한 번 뜹니다. 이후 기억됩니다.
- **Claude Code에게는** 이렇게 말하면 됩니다:
  *"구글드라이브 ○○폴더의 [석사/박사]논문 [언어]본을 저장소 형식에 맞춰 넣고 commit·push해줘"*

---

## 3. 프로젝트 구조

- 프레임워크: **Next.js 15 (App Router)** + Tailwind. 콘텐츠는 빌드시 파일에서 읽어 정적 생성.
- 다국어: `ko` / `en` / `zh` / `ja` (URL: `/<locale>/...`). 사이트 UI 문구는 `content/<locale>.ts`.

```
app/[locale]/
  dissertation/
    doctoral/
      page.tsx                              # 박사논문 목록(카드)
      [dissertationId]/page.tsx             # 논문 표지 + 목차  ← 논문 ID 등록처
      [dissertationId]/[chapterId]/page.tsx # 챕터 본문 렌더    ← 논문 ID 등록처
    masters/page.tsx                        # 석사논문 목록(현재 외부 링크만)
  papers/...                                # 발표논문 리더
content/
  dissertation/<dissertationId>/*.json      # ★ 논문 본문 데이터 (아래 4장)
  ko.ts / en.ts / zh.ts / ja.ts             # UI 문구 + 논문 "카드"(제목·설명·링크)
components/                                  # DissertationChapter 등 렌더 컴포넌트
lib/content.ts                              # locale별 content/*.ts 로더
```

### 현재 상태
- **박사논문**: 저장소에 완전히 통합됨. `dissertationId` = `donghak-daesoon-{ko,en,zh,ja}`.
- **석사논문**: 아직 저장소에 미통합. 목록 카드의 링크가 외부 사이트
  (`https://daesoon-web.vercel.app/...`)로 걸려 있음. → 통합하려면 6장 참고.

---

## 4. 논문 콘텐츠 데이터 형식 (`content/dissertation/<id>/`)

한 논문 = 한 폴더(`<id>`), 그 안에 **8개 JSON 파일**:

| 파일 | 내용 |
|------|------|
| `metadata.json` | 표지 정보 + 챕터 목차 |
| `intro.json` `ch2.json` `ch3.json` `ch4.json` `ch5.json` `conclusion.json` `references.json` | 각 챕터 본문 |

> 챕터 ID는 **고정**입니다: `intro, ch2, ch3, ch4, ch5, conclusion, references`
> (페이지의 `generateStaticParams`가 이 목록을 사용. 챕터 수가 다르면 5장 참고.)

### metadata.json
```json
{
  "dissertationId": "donghak-daesoon-ko",
  "title": "동학사상과 대순사상의 자생적 근대성 비교 연구",
  "subtitle": "- 천관·지관·인간관을 중심으로 -",
  "author": "최원혁",
  "year": "2024",
  "university": "대진대학교 대학원 대순종학과",
  "chapters": [
    {
      "id": "intro",
      "title": "I. 서론",
      "paragraphCount": 74,
      "footnoteCount": 173,
      "headings": [
        { "level": 1, "text": "서론", "anchor": "h109-서론" },
        { "level": 2, "text": "연구의 배경 및 필요성", "anchor": "h110-연구의-배경-및-필요성" }
      ]
    }
  ]
}
```

### 챕터 파일 (예: `intro.json`)
```json
{
  "id": "intro",
  "title": "I. 서론",
  "items": [
    { "type": "para", "text": "서론", "level": 1, "anchor": "h109-서론" },
    { "type": "para", "text": "연구의 배경 및 필요성", "level": 2, "anchor": "h110-..." },
    { "type": "para", "text": "본문 단락... 각주는 본문 안에 [^1] 처럼 표기.", "level": 0, "anchor": null }
  ],
  "footnotes": [
    { "number": 1, "text": "각주 1 내용." },
    { "number": 2, "text": "각주 2 내용." }
  ],
  "headings": [ { "level": 1, "text": "서론", "anchor": "h109-서론" } ]
}
```
규칙:
- `items[].level`: **1/2/3 = 제목(h1/h2/h3), 0 = 본문 단락**.
- 본문 중 각주 참조는 `[^번호]` 로 표기하고, 같은 챕터의 `footnotes` 배열에 `{number, text}` 로 정의.
- `anchor`: 제목엔 고유 앵커(`h<번호>-<슬러그>`), 본문 단락엔 `null`.
- 4개 언어 폴더는 **같은 구조·같은 챕터 ID**를 가져야 함(내용만 번역).

---

## 5. 새 논문(또는 새 언어) 추가 체크리스트

1. `content/dissertation/<새-id>/` 폴더에 8개 JSON 작성(4장 형식). 4개 언어면 `<id>-ko/-en/-zh/-ja`.
2. **두 페이지의 `generateStaticParams`에 새 id 등록:**
   - `app/[locale]/dissertation/doctoral/[dissertationId]/page.tsx`
   - `app/[locale]/dissertation/doctoral/[dissertationId]/[chapterId]/page.tsx`
   - (챕터 구성이 다르면 `chapterIds` 배열도 그 논문에 맞게 처리)
3. **목록 카드 등록:** `content/ko.ts`(및 en/zh/ja)의 `dissertation.doctoral`(또는 `masters`) 배열에
   카드 추가 — `id, title, subtitle, description`, `websiteUrl: '/<locale>/dissertation/doctoral/<id>'`.
4. 로컬 확인: `npm install` → `npm run dev` → http://localhost:3000 에서 확인.
5. `git add -A && git commit -m "..." && git push` → 자동 배포.

---

## 6. 석사논문을 이 저장소로 통합하려면 (현재는 외부 링크)

박사논문과 동일한 방식으로 옮기면 됩니다:
1. `content/dissertation/<masters-id>-{ko,en,zh,ja}/` 에 8개 JSON 작성.
2. `app/[locale]/dissertation/masters/` 아래에 박사논문과 똑같은
   `[dissertationId]/page.tsx` + `[dissertationId]/[chapterId]/page.tsx` 구조를 만들기
   (doctoral 폴더의 두 파일을 복사해 경로/문구만 수정).
3. `content/*.ts`의 `dissertation.masters` 카드 `websiteUrl`을 외부 주소 →
   `'/<locale>/dissertation/masters/<masters-id>'` 로 교체.
4. push → 자동 배포.

---

## 7. 배포·확인 메모

- 프로덕션 도메인: **https://yinyangwuxing.org** (Vercel 프로젝트 `yinyangwuxing`, GitHub `main` 연동).
- 배포 상태/로그는 Vercel 대시보드 또는 `npx vercel ls yinyangwuxing` 로 확인.
- "다른 컴퓨터에서 안 보임" 류 증상은 대부분 그 컴퓨터의 **브라우저 캐시/DNS 캐시** 문제 →
  강력 새로고침(Ctrl+Shift+R)·시크릿 창으로 먼저 확인. 라이브는 4개 언어 모두 정상 동작 중.
