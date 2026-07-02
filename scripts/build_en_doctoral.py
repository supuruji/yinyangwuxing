"""
Build English doctoral outline + PDF splits, mirroring the KO structure.

Inputs:
  - Merged TOC xlsx (columns: 구분, 국문(원문), 영문(English), 中文, 日本語, 한글 PPT 시작/끝)
  - English presentation PDF (549p, same page numbering as KO)
  - English dissertation PDF (328p, book format)

Outputs:
  - public/pdf/dissertation/en/presentation/*.pdf   (61 files, split of EN presentation)
  - public/pdf/dissertation/en/dissertation/*.pdf   (chapter-level split of EN dissertation)
  - public/dissertation/donghak-daesoon-en-presentation.pdf  (full EN presentation)
  - public/dissertation/donghak-daesoon-en.pdf              (full EN dissertation)
  - content/dissertation/donghak-daesoon-en/outline.json    (61 items)
"""
import pikepdf
import fitz
import openpyxl
import json
import os
import io
import re
import shutil

TOC_XLSX = 'H:/내 드라이브/박사논문/유튜브/박사논문 동학-대순 비교연구_제목_목차_다국어_260703.xlsx'
EN_PRESENTATION_PDF = 'H:/내 드라이브/박사논문/유튜브/00_결합본_EN_재번역_260630.pdf'
EN_DISSERTATION_PDF = 'H:/내 드라이브/박사논문/유튜브/Donghak-Daesoon Comparative Study (English)_최종수정본.pdf'

REPO = 'C:/Users/user/yinyangwuxing'
OUT_PRES_DIR = f'{REPO}/public/pdf/dissertation/en/presentation'
OUT_DISS_DIR = f'{REPO}/public/pdf/dissertation/en/dissertation'
OUT_FULL_PRES = f'{REPO}/public/dissertation/donghak-daesoon-en-presentation.pdf'
OUT_FULL_DISS = f'{REPO}/public/dissertation/donghak-daesoon-en.pdf'
OUT_JSON = f'{REPO}/content/dissertation/donghak-daesoon-en/outline.json'

EN_PLAYLIST_ID = 'PLw9IxWay4JN9xt7bVaB4LcKP9evomr22s'
EN_PLAYLIST_URL = f'https://www.youtube.com/playlist?list={EN_PLAYLIST_ID}'

# Chapter-level video map (from EN playlist).
CHAPTER_YOUTUBE = {
    'intro':      'qjFMx84vGgk',  # Chapter I
    'ch2':        '6_mY3ejO848',  # Chapter II
    'ch3':        'Dm_rRxcSpOE',  # Chapter III
    'ch4':        'kn6XwgU_TS4',  # Chapter IV
    'ch5':        'eu5j_T4KGYo',  # Chapter V
    'conclusion': 'QhO_Yu6fIUQ',  # Chapter VI
}

# Reuse the same 61-item structure as KO (imported logic).
# Each tuple: (order, level, code, chapter, slug, ko_title_fallback, pdf_start, pdf_end)
# The EN title is read from the merged TOC xlsx by matching KO title.
OUTLINE_KO = [
    (1,  1, '초록',      'intro',      '01-abstract',                     '초록 · 표지',   1,   4),
    (2,  1, 'I',         'intro',      '02-intro-overview',               'I. 서론 개요',   5,   8),
    (3,  2, 'I.1',       'intro',      '03-intro-background',             '1. 연구의 배경 및 필요성',   9,  16),
    (4,  2, 'I.2',       'intro',      '04-intro-objectives',             '2. 연구의 목적과 범위',  17,  24),
    (5,  2, 'I.3',       'intro',      '05-intro-prior-research',         '3. 선행연구 분석',  25,  36),
    (6,  1, 'II',        'ch2',        '06-ch2-overview',                 'II. 자생적(自生的) 근대성과 리미널리티',  37,  48),
    (7,  2, 'II.1',      'ch2',        '07-ch2-modernity',                '1. 근대성과 자생적 근대성',  49,  58),
    (8,  3, 'II.1.가',   'ch2',        '08-ch2-sacred-secular',           '가. 근대성과 성(聖)·속(俗)의 통섭(統攝)',  59,  72),
    (9,  3, 'II.1.나',   'ch2',        '09-ch2-common-origin',            '나. 서구 근대성과 자생적 근대성의 동양적 공동 기원',  73,  80),
    (10, 3, 'II.1.다',   'ch2',        '10-ch2-hak',                      '다. 자생적 근대성의 형식 체계로서의 “학(學)”',  81,  88),
    (11, 3, 'II.1.라',   'ch2',        '11-ch2-east-west',                '라. 자생적 근대성의 이론적 배경으로서 동서 구분',  89,  98),
    (12, 3, 'II.1.마',   'ch2',        '12-ch2-correlative',              '마. 자생적 근대성의 철학적 방법론으로서의 상관적 사유',  99, 110),
    (13, 2, 'II.2',      'ch2',        '13-ch2-liminality',               '2. 리미널리티와 재활성화', 111, 122),
    (14, 3, 'II.2.가',   'ch2',        '14-ch2-liminality-transform',     '가. 자생적 근대성의 성(聖)·속(俗) 변화 기제로서의 리미널리티', 123, 134),
    (15, 3, 'II.2.나',   'ch2',        '15-ch2-revitalization',           '나. 자생적 근대성의 성(聖)·속(俗) 지속 기제로서의 재활성화', 135, 146),
    (16, 1, 'III',       'ch3',        '16-ch3-overview',                 'III. 동학사상의 자생적 근대성과 작란의 리미널리티', 147, 161),
    (17, 2, 'III.1',     'ch3',        '17-ch3-sicheonju',                '1. 시천주(侍天主) 천관(天觀)의 자생적 근대성', 162, 169),
    (18, 3, 'III.1.가',  'ch3',        '18-ch3-western-heaven',           '가. 서양의 형상적(形相的) 천관', 170, 177),
    (19, 3, 'III.1.나',  'ch3',        '19-ch3-eastern-heaven',           '나. 동양의 동화적 (同化的) 천관', 178, 189),
    (20, 3, 'III.1.다',  'ch3',        '20-ch3-heaven-clash',             '다. 근대 동서양 천관의 충돌과 상극화(相克化)', 190, 197),
    (21, 3, 'III.1.라',  'ch3',        '21-ch3-donghak-heaven-liminality','라. 동학사상의 시천주(侍天主) 천관에 나타난 리미널리티', 198, 209),
    (22, 2, 'III.2',     'ch3',        '22-ch3-johwajeong',               '2. 조화정(造化定) 지관(地觀)의 자생적 근대성', 210, 218),
    (23, 3, 'III.2.가',  'ch3',        '23-ch3-western-earth',            '가. 서양의 질료적(質料的) 지관', 219, 226),
    (24, 3, 'III.2.나',  'ch3',        '24-ch3-eastern-earth',            '나. 동양의 응축적(凝縮的) 지관', 227, 234),
    (25, 3, 'III.2.다',  'ch3',        '25-ch3-earth-clash',              '다. 동서양 지관(地觀)의 충돌과 상극화(相克化)', 235, 242),
    (26, 3, 'III.2.라',  'ch3',        '26-ch3-donghak-earth-liminality', '라. 동학사상의 조화정(造化定) 지관(地觀)에 나타난 리미널리티', 243, 251),
    (27, 2, 'III.3',     'ch3',        '27-ch3-yeongsebulmang',           '3. 영세불망(永世不忘) 인간관(人間觀)의 자생적 근대성', 252, 263),
    (28, 3, 'III.3.가',  'ch3',        '28-ch3-western-human',            '가. 서양의 성장론적(成長論的) 인간관', 264, 271),
    (29, 3, 'III.3.나',  'ch3',        '29-ch3-eastern-human',            '나. 동양의 접화적(接化的) 인간관', 272, 279),
    (30, 3, 'III.3.다',  'ch3',        '30-ch3-human-clash',              '다. 근대 동서양 인간관의 충돌과 상극화(相克化)', 280, 287),
    (31, 3, 'III.3.라',  'ch3',        '31-ch3-donghak-human-liminality', '라. 동학사상의 영세불망(永世不忘) 인간관에 나타난 리미널리티', 288, 295),
    (32, 1, 'IV',        'ch4',        '32-ch4-overview',                 'IV. 대순사상의 자생적 근대성과 치란의 재활성화', 296, 307),
    (33, 2, 'IV.1',      'ch4',        '33-ch4-insin-gangse',             '1. 인신강세(人身降世) 천계관(天界觀)의 자생적 근대성', 308, 319),
    (34, 3, 'IV.1.가',   'ch4',        '34-ch4-heaven-realm',             '가. 천계관(天界觀)으로서의 천관(天觀)', 320, 327),
    (35, 3, 'IV.1.나',   'ch4',        '35-ch4-incarnation-heaven',       '나. 인신강세(人身降世)의 천계관(天界觀)', 328, 335),
    (36, 3, 'IV.1.다',   'ch4',        '36-ch4-heaven-revitalization',    '다. 인신강세(人身降世) 천계관(天界觀)에 나타난 동서양 천관(天觀)의 재활성화', 336, 343),
    (37, 2, 'IV.2',      'ch4',        '37-ch4-cheonji-seongyeongsin',    '2. 천지성경신(天地誠敬信) 지계관(地界觀)의 자생적 근대성', 344, 351),
    (38, 3, 'IV.2.가',   'ch4',        '38-ch4-earth-realm',              '가. 지계관(地界觀)으로서의 지관(地觀)', 352, 359),
    (39, 3, 'IV.2.나',   'ch4',        '39-ch4-cheonji-earth',            '나. 천지성경신(天地誠敬信)의 지계관(地界觀)', 360, 368),
    (40, 3, 'IV.2.다',   'ch4',        '40-ch4-earth-revitalization',     '다. 천지성경신(天地誠敬信) 지계관(地界觀)에 나타난 동서양 지관地觀의 재활성화', 369, 374),
    (41, 2, 'IV.3',      'ch4',        '41-ch4-seongsa-jaein',            '3. 성사재인(成事在人) 인계관(人界觀)의 자생적 근대성', 375, 385),
    (42, 3, 'IV.3.가',   'ch4',        '42-ch4-human-realm',              '가. 인계관(人界觀)으로서의 인간관(人間觀)', 386, 393),
    (43, 3, 'IV.3.나',   'ch4',        '43-ch4-seongsa-jaein-view',       '나. 성사재인(成事在人) 인계관(人界觀)', 394, 401),
    (44, 3, 'IV.3.다',   'ch4',        '44-ch4-human-revitalization',     '다. 성사재인(成事在人) 인계관(人界觀)에 나타난 동서양 인간관(人間觀)의 재활성화', 402, 413),
    (45, 1, 'V',         'ch5',        '45-ch5-overview',                 'V. 동학사상과 대순사상의 자생적 근대성 비교', 414, 428),
    (46, 2, 'V.1',       'ch5',        '46-ch5-heaven-compare',           '1. 천관(天觀)의 자생적 근대성 비교', 429, 436),
    (47, 3, 'V.1.가',    'ch5',        '47-ch5-samjae-samgye',            '가. 삼재 (三才)와 삼계 (三界)', 437, 444),
    (48, 3, 'V.1.나',    'ch5',        '48-ch5-seoncheon-hucheon',        '나. 선천(先天)과 후천(後天)', 445, 450),
    (49, 2, 'V.2',       'ch5',        '49-ch5-earth-compare',            '2. 지관(地觀)의 자생적 근대성 비교', 451, 458),
    (50, 3, 'V.2.가',    'ch5',        '50-ch5-gihwa-jori',               '가. 기화(氣化)와 조리(調理)', 459, 466),
    (51, 3, 'V.2.나',    'ch5',        '51-ch5-noimugong-cheonjiseongong','나. 노이무공(勞而無功)과 천지성공(天地成功)', 467, 475),
    (52, 2, 'V.3',       'ch5',        '52-ch5-human-compare',            '3. 인간관의 자생적 근대성 비교', 476, 484),
    (53, 3, 'V.3.가',    'ch5',        '53-ch5-innaecheon-sinin',         '가. 인내천(人乃天)과 신인조화(神人調化)', 485, 489),
    (54, 3, 'V.3.나',    'ch5',        '54-ch5-buryeon-seongsa',          '나. 불연기연(不然其然)과 성사재인(成事在人)', 490, 499),
    (55, 2, 'V.4',       'ch5',        '55-ch5-heaven-earth-compare',     '4. 동학사상과 대순사상 천지관계의 자생적 근대성 비교', 500, 505),
    (56, 3, 'V.4.가',    'ch5',        '56-ch5-cheonjigwisin',            '가. 천지귀신(天地鬼神)과 천지성경신(天地誠敬信)', 506, 511),
    (57, 3, 'V.4.나',    'ch5',        '57-ch5-dogijangjon-sangsaeng',    '나. 도기장존(道氣長存)과 상생(相生)', 512, 521),
    (58, 2, 'V.5',       'ch5',        '58-ch5-heaven-human-compare',     '5. 동학사상과 대순사상의 천인·지인 관계의 자생적 근대성 비교', 522, 529),
    (59, 3, 'V.5.가',    'ch5',        '59-ch5-indo-sindo',               '가. 인도(人道)와 신도(神道)의 천인관계', 530, 537),
    (60, 3, 'V.5.나',    'ch5',        '60-ch5-simgeub-dotong',           '나. 심급도유(心急道儒)와 도통군자(道通君子)의 지인관계', 538, 540),
    (61, 1, 'VI',        'conclusion', '61-conclusion',                   'VI. 결론', 541, 549),
]


def load_en_titles():
    """KO title → EN title map from the merged TOC xlsx column C."""
    wb = openpyxl.load_workbook(TOC_XLSX, data_only=True)
    ws = wb['제목·목차']
    m = {}
    for row in ws.iter_rows(min_row=2, values_only=True):
        ko = row[1]
        en = row[2]
        if ko and en:
            key = str(ko).strip()
            m[key] = str(en).strip()
            # Also index by normalized: strip enumeration prefix
            k2 = re.sub(r'^(I|II|III|IV|V|VI)\.\s*', '', key)
            k2 = re.sub(r'^\d+\.\s*', '', k2)
            k2 = re.sub(r'^[가나다라마]\.\s*', '', k2)
            m[k2] = str(en).strip()
    # Extras: TOC has no entry for these synthetic outline items → hardcode.
    m['초록 · 표지'] = 'Abstract · Cover'
    m['I. 서론 개요'] = 'Introduction — Chapter Overview'
    # Fill the empty EN for row 49 (V.1.가 — 삼재와 삼계)
    m['가. 삼재 (三才)와 삼계 (三界)'] = 'Samjae (Three Powers) and Samgye (Three Realms)'
    m['삼재 (三才)와 삼계 (三界)'] = 'Samjae (Three Powers) and Samgye (Three Realms)'
    # Overrides for rows where the source Python string has a subtle char mismatch
    # with the xlsx cell (encoding or invisible chars). Copied verbatim from TOC.
    m['3. 영세불망(永世不忘) 인간관(人間觀)의 자생적 근대성'] = 'Indigenous Modernity of the Yeongsebulmang (Eternal Non-forgetting) View of Humanity (In-gwan)'
    m['영세불망(永世不忘) 인간관(人間觀)의 자생적 근대성'] = 'Indigenous Modernity of the Yeongsebulmang (Eternal Non-forgetting) View of Humanity (In-gwan)'
    m['라. 동학사상의 영세불망(永世不忘) 인간관에 나타난 리미널리티'] = "Liminality in Donghak Thought's View of Humanity as Yeongsebulmang (Eternal Unforgetting)"
    m['동학사상의 영세불망(永世不忘) 인간관에 나타난 리미널리티'] = "Liminality in Donghak Thought's View of Humanity as Yeongsebulmang (Eternal Unforgetting)"
    m['나. 불연기연(不然其然)과 성사재인(成事在人)'] = 'Buryeon-giyeon (Not so, yet so) and Seongsa-jaein (Accomplishment of affairs lies with human beings)'
    m['불연기연(不然其然)과 성사재인(成事在人)'] = 'Buryeon-giyeon (Not so, yet so) and Seongsa-jaein (Accomplishment of affairs lies with human beings)'
    return m


def split_presentation(items):
    """Split the EN presentation PDF (549p) into 61 section files."""
    os.makedirs(OUT_PRES_DIR, exist_ok=True)
    with pikepdf.open(EN_PRESENTATION_PDF) as src:
        for it in items:
            dst = pikepdf.Pdf.new()
            for p in range(it['pdfStart'] - 1, it['pdfEnd']):
                dst.pages.append(src.pages[p])
            dst.save(f"{OUT_PRES_DIR}/{it['pdfFile']}", linearize=False,
                     compress_streams=True,
                     object_stream_mode=pikepdf.ObjectStreamMode.generate)
            dst.close()


def split_dissertation():
    """Split EN dissertation PDF (328p) by chapter using hardcoded page ranges
    verified by searching for chapter titles inside the PDF."""
    os.makedirs(OUT_DISS_DIR, exist_ok=True)
    # Verified in probe: title page p1, chapters open at p2/31/79/158/229/283, refs at p288.
    ranges = [
        ('I',   'chapter-1-introduction',        1,  30),
        ('II',  'chapter-2-modernity-liminality',31,  78),
        ('III', 'chapter-3-donghak',             79, 157),
        ('IV',  'chapter-4-daesoon',            158, 228),
        ('V',   'chapter-5-comparison',         229, 282),
        ('VI',  'chapter-6-conclusion',         283, 287),
        ('References', 'references',            288, 328),
    ]
    chapter_files = []
    with pikepdf.open(EN_DISSERTATION_PDF) as src:
        total = len(src.pages)
        for label, slug, s, e in ranges:
            dst = pikepdf.Pdf.new()
            for p in range(s - 1, e):
                dst.pages.append(src.pages[p])
            fname = f'{slug}.pdf'
            dst.save(f'{OUT_DISS_DIR}/{fname}', linearize=False,
                     compress_streams=True,
                     object_stream_mode=pikepdf.ObjectStreamMode.generate)
            dst.close()
            chapter_files.append({'label': label, 'file': fname, 'pageStart': s, 'pageEnd': e})
    return chapter_files, total


def main():
    en_titles = load_en_titles()

    items = []
    missing_en = []
    for order, level, code, chapter, slug, ko_title, p_start, p_end in OUTLINE_KO:
        en_title = en_titles.get(ko_title.strip())
        if not en_title:
            # Try stripped
            k2 = re.sub(r'^(I|II|III|IV|V|VI)\.\s*', '', ko_title)
            k2 = re.sub(r'^\d+\.\s*', '', k2)
            k2 = re.sub(r'^[가나다라마]\.\s*', '', k2)
            en_title = en_titles.get(k2.strip(), '')
        if not en_title:
            missing_en.append(f'  {code}: {ko_title}')
        # Prefix the title with its outline code for context; abstract stays unprefixed.
        if code == '초록':
            display_title = en_title or 'Abstract'
        else:
            display_title = f'{code}. {en_title}' if en_title else f'{code}. [KO] {ko_title}'
        yt_id = CHAPTER_YOUTUBE[chapter]
        items.append({
            'order': order,
            'level': level,
            'code': code,
            'title': display_title,
            'youtubeId': yt_id,
            'youtubeUrl': f'https://www.youtube.com/watch?v={yt_id}&list={EN_PLAYLIST_ID}',
            'pdfFile': f'{slug}.pdf',
            'pdfPath': f'/pdf/dissertation/en/presentation/{slug}.pdf',
            'pdfStart': p_start,
            'pdfEnd': p_end,
            'chapter': chapter,
        })

    print(f'Outline items: {len(items)}  Missing EN titles: {len(missing_en)}')
    for m in missing_en:
        print(m)

    print('Splitting EN presentation PDF (549p) …')
    split_presentation(items)

    print('Splitting EN dissertation PDF (328p) by chapter …')
    diss_chunks, diss_total = split_dissertation()
    print(f'  Found {len(diss_chunks)} chapter chunks in dissertation (total {diss_total}p)')
    for c in diss_chunks:
        print(f"  {c['label']:>11}: p{c['pageStart']}-{c['pageEnd']} → {c['file']}")

    # Copy full PDFs into public/dissertation/ for the top buttons
    print('Copying full PDFs …')
    os.makedirs(os.path.dirname(OUT_FULL_PRES), exist_ok=True)
    shutil.copyfile(EN_PRESENTATION_PDF, OUT_FULL_PRES)
    shutil.copyfile(EN_DISSERTATION_PDF, OUT_FULL_DISS)

    # Write outline.json
    os.makedirs(os.path.dirname(OUT_JSON), exist_ok=True)
    payload = {
        'items': items,
        'totalPages': 549,
        'playlistUrl': EN_PLAYLIST_URL,
        'dissertationChunks': diss_chunks,
        'dissertationTotalPages': diss_total,
    }
    with io.open(OUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    print(f'Wrote {OUT_JSON}')


if __name__ == '__main__':
    main()
