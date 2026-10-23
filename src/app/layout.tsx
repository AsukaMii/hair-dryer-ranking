// src/app/layout.tsx
// 全ページ共通の外枠（html・body・フォント・ヘッダー・フッター）

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// 日本語フォント（Noto Sans JP）を読み込む
const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  display: "swap", // フォント読み込み中も代替フォントで先に文字を表示する
});

// ページのタイトルと説明文（SEOの詳しい設定は後のステップで行う）
export const metadata: Metadata = {
  title: "ヘアドライヤーおすすめランキング｜ヘアドライヤー比較ナビ",
  description: "ヘアドライヤー10機種を風量・重さ・価格・機能で比較。用途別の絞り込みで自分に合う1台が見つかります。",
};

// children：各ページ（page.tsx）の中身がここに入る
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    // lang="ja"で日本語ページであることを指定、scroll-smoothでアンカーリンクをなめらかにスクロール
    <html lang="ja" className="scroll-smooth">
      <body className={`${notoSansJp.className} antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}