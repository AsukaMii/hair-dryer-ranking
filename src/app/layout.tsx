// src/app/layout.tsx
// 全ページ共通の外枠（html・body・フォント・ヘッダー・フッター・共通メタ情報）

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site";

// 日本語フォント（Noto Sans JP）を読み込む
const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  display: "swap", // フォント読み込み中も代替フォントで先に文字を表示する
});

// 全ページ共通のメタ情報
export const metadata: Metadata = {
  // canonicalやOGPのURLを組み立てるときの基準URL
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `ヘアドライヤーおすすめランキング｜${siteConfig.name}`, // トップページなどのタイトル
    template: `%s｜${siteConfig.name}`, // 下層ページは「ページ名｜サイト名」になる
  },
  description: siteConfig.description,
  // SNSでシェアされたときの表示（OGP）
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: siteConfig.name,
    title: `ヘアドライヤーおすすめランキング｜${siteConfig.name}`,
    description: siteConfig.description,
  },
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