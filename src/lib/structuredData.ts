// src/lib/structuredData.ts
// schema.org形式の構造化データを作る関数

import type { HairDryer } from "@/types/hairdryer";
import type { FaqItem } from "@/data/faq";
import { siteConfig } from "@/lib/site";

// ランキング（順位付きリスト）の構造化データ
export function buildItemListJsonLd(dryers: HairDryer[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "ヘアドライヤーおすすめランキングTOP10",
    itemListElement: dryers.map((dryer, index) => ({
      "@type": "ListItem",
      position: index + 1, // 順位
      name: `${dryer.brand} ${dryer.name}`,
      url: `${siteConfig.url}/products/${dryer.id}`, // 商品詳細ページのURL
    })),
  };
}

// よくある質問の構造化データ
export function buildFaqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

// パンくずリスト1項目分の型（pathは最後の項目＝現在のページでは省略可）
type BreadcrumbItem = {
  name: string;
  path?: string;
};

// パンくずリストの構造化データ
export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      // pathがある場合だけ、完全なURLにして追加する
      ...(item.path ? { item: `${siteConfig.url}${item.path}` } : {}),
    })),
  };
}