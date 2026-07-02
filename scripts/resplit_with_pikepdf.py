"""Re-split the PDF with pikepdf (smaller output) using the existing outline.json."""
import pikepdf, json, os

SRC_PDF = 'H:/내 드라이브/박사논문/유튜브/00_결합본_통일디자인_260630.pdf'
OUT_DIR = 'C:/Users/user/yinyangwuxing/public/pdf/dissertation/ko'
OUTLINE_JSON = 'C:/Users/user/yinyangwuxing/content/dissertation/donghak-daesoon-ko/outline.json'

with open(OUTLINE_JSON, 'r', encoding='utf-8') as f:
    data = json.load(f)

with pikepdf.open(SRC_PDF) as src:
    total = len(src.pages)
    for item in data['items']:
        dst = pikepdf.Pdf.new()
        for p in range(item['pdfStart'] - 1, item['pdfEnd']):
            dst.pages.append(src.pages[p])
        out_path = os.path.join(OUT_DIR, item['pdfFile'])
        dst.save(out_path, linearize=False, compress_streams=True, object_stream_mode=pikepdf.ObjectStreamMode.generate)
        dst.close()

# Total size check
sizes = [os.path.getsize(os.path.join(OUT_DIR, i['pdfFile'])) for i in data['items']]
print(f'{len(sizes)} files, total {sum(sizes)/1024/1024:.1f} MB')
