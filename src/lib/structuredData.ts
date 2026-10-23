// src/lib/structuredData.ts
// schema.org形式の構造化データを作る関数

import type { HairDryer } from "@/types/hairdryer";
import type { FaqItem } from "@/data/faq";

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