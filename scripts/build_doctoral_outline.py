"""
Build the doctoral dissertation outline data + split the PDF into 61 sections.

Inputs:
  - H:/내 드라이브/박사논문/유튜브/00_결합본_통일디자인_260630.pdf  (549 pages)
  - Hardcoded outline below (derived from TOC xlsx + YouTube playlist)

Outputs:
  - C:/Users/user/yinyangwuxing/public/pdf/dissertation/ko/*.pdf   (61 files)
  - C:/Users/user/yinyangwuxing/content/dissertation/donghak-daesoon-ko/outline.json
"""
import fitz  # PyMuPDF
import json
import os
import io

SRC_PDF = 'H:/내 드라이브/박사논문/유튜브/00_결합본_통일디자인_260630.pdf'
OUT_PDF_DIR = 'C:/Users/user/yinyangwuxing/public/pdf/dissertation/ko'
OUT_JSON = 'C:/Users/user/yinyangwuxing/content/dissertation/donghak-daesoon-ko/outline.json'

# Chapter-level anchor mapping used by the "본문 읽기" button.
# Values must match existing chapter ids in metadata.json (intro/ch2/ch3/ch4/ch5/conclusion).

OUTLINE = [
    # order, level, code, title, youtubeId, pdfStart, pdfEnd, chapter, slug
    (1,  1, '초록',      '초록 · 표지',                                                                            'JZzIvAe76NE',   1,   4, 'intro',      '01-abstract'),
    (2,  1, 'I',         'I. 서론 개요',                                                                            's_75gPWSio0',   5,   8, 'intro',      '02-intro-overview'),
    (3,  2, 'I.1',       'I.1. 연구의 배경 및 필요성',                                                              'jdUt4Q2qi0A',   9,  16, 'intro',      '03-intro-background'),
    (4,  2, 'I.2',       'I.2. 연구의 목적과 범위',                                                                 'ozl0n7Fj9r8',  17,  24, 'intro',      '04-intro-objectives'),
    (5,  2, 'I.3',       'I.3. 선행연구 분석',                                                                      'hSdDFJNrTSQ',  25,  36, 'intro',      '05-intro-prior-research'),
    (6,  1, 'II',        'II. 자생적(自生的) 근대성과 리미널리티',                                                    '2NSxg2waoU0',  37,  48, 'ch2',        '06-ch2-overview'),
    (7,  2, 'II.1',      'II.1. 근대성과 자생적 근대성',                                                             'WpGfexcQKUU',  49,  58, 'ch2',        '07-ch2-modernity'),
    (8,  3, 'II.1.가',   'II.1.가. 근대성과 성(聖)·속(俗)의 통섭(統攝)',                                              'S9jWKF7eQco',  59,  72, 'ch2',        '08-ch2-sacred-secular'),
    (9,  3, 'II.1.나',   'II.1.나. 서구 근대성과 자생적 근대성의 동양적 공동 기원',                                   'DfHILK1JbQE',  73,  80, 'ch2',        '09-ch2-common-origin'),
    (10, 3, 'II.1.다',   'II.1.다. 자생적 근대성의 형식 체계로서의 "학(學)"',                                         'Ejrf4ZkS8Fg',  81,  88, 'ch2',        '10-ch2-hak'),
    (11, 3, 'II.1.라',   'II.1.라. 자생적 근대성의 이론적 배경으로서 동서 구분',                                      'QpRShtD2Ahw',  89,  98, 'ch2',        '11-ch2-east-west'),
    (12, 3, 'II.1.마',   'II.1.마. 자생적 근대성의 철학적 방법론으로서의 상관적 사유',                                'jDVkofowtTg',  99, 110, 'ch2',        '12-ch2-correlative'),
    (13, 2, 'II.2',      'II.2. 리미널리티와 재활성화',                                                              'w7uOcmEzrgU', 111, 122, 'ch2',        '13-ch2-liminality'),
    (14, 3, 'II.2.가',   'II.2.가. 자생적 근대성의 성·속 변화 기제로서의 리미널리티',                                 'Q7cZ6TgHewY', 123, 134, 'ch2',        '14-ch2-liminality-transform'),
    (15, 3, 'II.2.나',   'II.2.나. 자생적 근대성의 성·속 지속 기제로서의 재활성화',                                   'uL5q3JDZNpA', 135, 146, 'ch2',        '15-ch2-revitalization'),
    (16, 1, 'III',       'III. 동학사상의 자생적 근대성과 작란(作亂)의 리미널리티',                                    'LrH-TSeIZYM', 147, 161, 'ch3',        '16-ch3-overview'),
    (17, 2, 'III.1',     'III.1. 시천주(侍天主) 천관(天觀)의 자생적 근대성',                                          'qUhv319kfCU', 162, 169, 'ch3',        '17-ch3-sicheonju'),
    (18, 3, 'III.1.가',  'III.1.가. 서양의 형상적(形相的) 천관',                                                      'eLd7l_d04AU', 170, 177, 'ch3',        '18-ch3-western-heaven'),
    (19, 3, 'III.1.나',  'III.1.나. 동양의 동화적(同化的) 천관',                                                      '5k1kZ1J4PxE', 178, 189, 'ch3',        '19-ch3-eastern-heaven'),
    (20, 3, 'III.1.다',  'III.1.다. 근대 동서양 천관의 충돌과 상극화(相克化)',                                        'rEdTwcmj9n8', 190, 197, 'ch3',        '20-ch3-heaven-clash'),
    (21, 3, 'III.1.라',  'III.1.라. 동학사상의 시천주 천관에 나타난 리미널리티',                                      'ro6KtlREPIs', 198, 209, 'ch3',        '21-ch3-donghak-heaven-liminality'),
    (22, 2, 'III.2',     'III.2. 조화정(造化定) 지관(地觀)의 자생적 근대성',                                          'hLV89dAXEhk', 210, 218, 'ch3',        '22-ch3-johwajeong'),
    (23, 3, 'III.2.가',  'III.2.가. 서양의 질료적(質料的) 지관',                                                      'S1An8Juv_Uw', 219, 226, 'ch3',        '23-ch3-western-earth'),
    (24, 3, 'III.2.나',  'III.2.나. 동양의 응축적(凝縮的) 지관',                                                      '_23Q32jw5F8', 227, 234, 'ch3',        '24-ch3-eastern-earth'),
    (25, 3, 'III.2.다',  'III.2.다. 동서양 지관의 충돌과 상극화',                                                    '2e1GRfpLt-s', 235, 242, 'ch3',        '25-ch3-earth-clash'),
    (26, 3, 'III.2.라',  'III.2.라. 동학사상의 조화정 지관에 나타난 리미널리티',                                      'LDtP4-wHVqQ', 243, 251, 'ch3',        '26-ch3-donghak-earth-liminality'),
    (27, 2, 'III.3',     'III.3. 영세불망(永世不忘) 인간관(人間觀)의 자생적 근대성',                                  'kWTPgObSizg', 252, 263, 'ch3',        '27-ch3-yeongsebulmang'),
    (28, 3, 'III.3.가',  'III.3.가. 서양의 성장론적(成長論的) 인간관',                                                'QXIp4TDbw3s', 264, 271, 'ch3',        '28-ch3-western-human'),
    (29, 3, 'III.3.나',  'III.3.나. 동양의 접화적(接化的) 인간관',                                                    'b2wsXBefI1I', 272, 279, 'ch3',        '29-ch3-eastern-human'),
    (30, 3, 'III.3.다',  'III.3.다. 근대 동서양 인간관의 충돌과 상극화',                                              'iY8_MUD-5LI', 280, 287, 'ch3',        '30-ch3-human-clash'),
    (31, 3, 'III.3.라',  'III.3.라. 동학사상의 영세불망 인간관에 나타난 리미널리티',                                  'Kc6jt4WdV0k', 288, 295, 'ch3',        '31-ch3-donghak-human-liminality'),
    (32, 1, 'IV',        'IV. 대순사상의 자생적 근대성과 치란(治亂)의 재활성화',                                       'tw879DUsF5A', 296, 307, 'ch4',        '32-ch4-overview'),
    (33, 2, 'IV.1',      'IV.1. 인신강세(人身降世) 천계관(天界觀)의 자생적 근대성',                                    'wkUUoNLXkwM', 308, 319, 'ch4',        '33-ch4-insin-gangse'),
    (34, 3, 'IV.1.가',   'IV.1.가. 천계관으로서의 천관',                                                              '_eXY-S0s0-M', 320, 327, 'ch4',        '34-ch4-heaven-realm'),
    (35, 3, 'IV.1.나',   'IV.1.나. 인신강세의 천계관',                                                                '0P3QdZidAV8', 328, 335, 'ch4',        '35-ch4-incarnation-heaven'),
    (36, 3, 'IV.1.다',   'IV.1.다. 인신강세 천계관에 나타난 동서양 천관의 재활성화',                                   'L-wHc_g4SdA', 336, 343, 'ch4',        '36-ch4-heaven-revitalization'),
    (37, 2, 'IV.2',      'IV.2. 천지성경신(天地誠敬信) 지계관(地界觀)의 자생적 근대성',                                'YEL7gicy-BE', 344, 351, 'ch4',        '37-ch4-cheonji-seongyeongsin'),
    (38, 3, 'IV.2.가',   'IV.2.가. 지계관으로서의 지관',                                                              'AD4hQgC0Es8', 352, 359, 'ch4',        '38-ch4-earth-realm'),
    (39, 3, 'IV.2.나',   'IV.2.나. 천지성경신의 지계관',                                                              'kTJGGtd91Dw', 360, 368, 'ch4',        '39-ch4-cheonji-earth'),
    (40, 3, 'IV.2.다',   'IV.2.다. 천지성경신 지계관에 나타난 동서양 지관의 재활성화',                                 'r3xVlf0fssA', 369, 374, 'ch4',        '40-ch4-earth-revitalization'),
    (41, 2, 'IV.3',      'IV.3. 성사재인(成事在人) 인계관(人界觀)의 자생적 근대성',                                    'LSCovC7FowA', 375, 385, 'ch4',        '41-ch4-seongsa-jaein'),
    (42, 3, 'IV.3.가',   'IV.3.가. 인계관으로서의 인간관',                                                            'RERNigZkuaM', 386, 393, 'ch4',        '42-ch4-human-realm'),
    (43, 3, 'IV.3.나',   'IV.3.나. 성사재인의 인계관',                                                                'CHC9rfUO-lU', 394, 401, 'ch4',        '43-ch4-seongsa-jaein-view'),
    (44, 3, 'IV.3.다',   'IV.3.다. 성사재인 인계관에 나타난 동서양 인간관의 재활성화',                                  'gQUsegb0bpo', 402, 413, 'ch4',        '44-ch4-human-revitalization'),
    (45, 1, 'V',         'V. 동학사상과 대순사상의 자생적 근대성 비교',                                                'Qwl3uey0ytE', 414, 428, 'ch5',        '45-ch5-overview'),
    (46, 2, 'V.1',       'V.1. 천관의 자생적 근대성 비교',                                                            'ZPMzK17f1CA', 429, 436, 'ch5',        '46-ch5-heaven-compare'),
    (47, 3, 'V.1.가',    'V.1.가. 삼재(三才)와 삼계(三界)',                                                            'sJs-erk4mps', 437, 444, 'ch5',        '47-ch5-samjae-samgye'),
    (48, 3, 'V.1.나',    'V.1.나. 선천(先天)과 후천(後天)',                                                            '_qMr2kW7CKU', 445, 450, 'ch5',        '48-ch5-seoncheon-hucheon'),
    (49, 2, 'V.2',       'V.2. 지관의 자생적 근대성 비교',                                                            'DUTbyfQVyYA', 451, 458, 'ch5',        '49-ch5-earth-compare'),
    (50, 3, 'V.2.가',    'V.2.가. 기화(氣化)와 조리(調理)',                                                            '53u-5I5xzuM', 459, 466, 'ch5',        '50-ch5-gihwa-jori'),
    (51, 3, 'V.2.나',    'V.2.나. 노이무공(勞而無功)과 천지성공(天地成功)',                                             'p-wDLkKLsxc', 467, 475, 'ch5',        '51-ch5-noimugong-cheonjiseongong'),
    (52, 2, 'V.3',       'V.3. 인간관의 자생적 근대성 비교',                                                          'yw52f-i5Bbo', 476, 484, 'ch5',        '52-ch5-human-compare'),
    (53, 3, 'V.3.가',    'V.3.가. 인내천(人乃天)과 신인조화(神人調化)',                                                'ZkVOQdgxYIs', 485, 489, 'ch5',        '53-ch5-innaecheon-sinin'),
    (54, 3, 'V.3.나',    'V.3.나. 불연기연(不然其然)과 성사재인(成事在人)',                                             'RHNn909BIT8', 490, 499, 'ch5',        '54-ch5-buryeon-seongsa'),
    (55, 2, 'V.4',       'V.4. 동학사상과 대순사상 천지관계의 자생적 근대성 비교',                                     'NF-g1qPF7EE', 500, 505, 'ch5',        '55-ch5-heaven-earth-compare'),
    (56, 3, 'V.4.가',    'V.4.가. 천지귀신(天地鬼神)과 천지성경신(天地誠敬信)',                                         'P7k4zdIAFAg', 506, 511, 'ch5',        '56-ch5-cheonjigwisin'),
    (57, 3, 'V.4.나',    'V.4.나. 도기장존(道氣長存)과 상생(相生)',                                                    'y4JSh4BTZiU', 512, 521, 'ch5',        '57-ch5-dogijangjon-sangsaeng'),
    (58, 2, 'V.5',       'V.5. 동학사상과 대순사상의 천인·지인 관계의 자생적 근대성 비교',                             '7um2ck3uF7U', 522, 529, 'ch5',        '58-ch5-heaven-human-compare'),
    (59, 3, 'V.5.가',    'V.5.가. 인도(人道)와 신도(神道)의 천인관계',                                                'J9pFkNnr8qs', 530, 537, 'ch5',        '59-ch5-indo-sindo'),
    (60, 3, 'V.5.나',    'V.5.나. 심급도유(心急道儒)와 도통군자(道通君子)의 지인관계',                                 'RY6VHz0KtpU', 538, 540, 'ch5',        '60-ch5-simgeub-dotong'),
    (61, 1, 'VI',        'VI. 결론',                                                                                'jMSSo8fN0XY', 541, 549, 'conclusion', '61-conclusion'),
]

def main():
    os.makedirs(OUT_PDF_DIR, exist_ok=True)
    src = fitz.open(SRC_PDF)
    total = len(src)
    items = []
    for order, level, code, title, yt, p_start, p_end, chapter, slug in OUTLINE:
        assert 1 <= p_start <= p_end <= total, f'{code}: bad range {p_start}-{p_end}'
        dst = fitz.open()
        dst.insert_pdf(src, from_page=p_start - 1, to_page=p_end - 1)
        out_pdf = f'{OUT_PDF_DIR}/{slug}.pdf'
        dst.save(out_pdf, deflate=True, garbage=3)
        dst.close()
        items.append({
            'order': order,
            'level': level,
            'code': code,
            'title': title,
            'youtubeId': yt,
            'youtubeUrl': f'https://www.youtube.com/watch?v={yt}&list=PLw9IxWay4JN-f_AEhSlun0hBRifiMVfV2',
            'pdfFile': f'{slug}.pdf',
            'pdfPath': f'/pdf/dissertation/ko/{slug}.pdf',
            'pdfStart': p_start,
            'pdfEnd': p_end,
            'chapter': chapter,
        })
    src.close()

    os.makedirs(os.path.dirname(OUT_JSON), exist_ok=True)
    out = io.open(OUT_JSON, 'w', encoding='utf-8')
    json.dump({'items': items, 'totalPages': total, 'playlistUrl': 'https://www.youtube.com/playlist?list=PLw9IxWay4JN-f_AEhSlun0hBRifiMVfV2'}, out, ensure_ascii=False, indent=2)
    out.close()
    print(f'Wrote {len(items)} PDF sections and {OUT_JSON}')

if __name__ == '__main__':
    main()
