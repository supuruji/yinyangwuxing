import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '陰陽五行 — 최원혁 학술연구',
  description: '동학사상, 대순사상, 음양오행에 관한 학술연구',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head />
      <body>{children}</body>
    </html>
  );
}
