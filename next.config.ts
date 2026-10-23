// next.config.ts
// Next.jsの設定ファイル

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // プロジェクト作成時に有効になっていたキャッシュ機能
  cacheComponents: true,
  // ページの一部を先読みして画面遷移を速くする機能（cacheComponentsとセットで有効にする）
  partialPrefetching: true,

  // Turbopack（開発・ビルド用ツール）でCSSを読み込むときに、Tailwind CSSを通す設定
  // ※ これを消すとTailwindのクラスがすべて効かなくなる
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  images: {
    // 楽天の商品画像サーバーからの画像表示を許可する
    remotePatterns: [
      {
        protocol: "https",
        hostname: "thumbnail.image.rakuten.co.jp",
      },
    ],
  },
};

export default nextConfig;