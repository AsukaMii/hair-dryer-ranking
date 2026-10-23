// src/app/page.tsx
// トップページ（導入文・目次・選び方・ランキング・比較表・FAQ）

import { hairDryers } from "@/lib/hairdryers";
import { faqItems } from "@/data/faq";
import TableOfContents from "@/components/TableOfContents";
import RankingSection from "@/components/RankingSection";
import ComparisonTable from "@/components/ComparisonTable";
import Faq from "@/components/Faq";

// 目次の項目（idは下の各sectionのidと合わせる）
const tocItems = [
  { id: "point", label: "ヘアドライヤーの選び方" },
  { id: "ranking", label: "おすすめランキングTOP10" },
  { id: "comparison", label: "スペック比較表" },
  { id: "faq", label: "よくある質問" },
];

// 選び方のポイント
const guidePoints = [
  { title: "風量で選ぶ", text: "乾かす時間を短くしたいなら、風量2.0m³/分以上のモデルが目安です。" },
  { title: "重さで選ぶ", text: "毎日使うなら、腕が疲れにくい500g以下の軽量モデルもチェックしましょう。" },
  { title: "機能で選ぶ", text: "イオン機能・頭皮ケアモード・折りたたみなど、重視したい機能で絞り込むのがおすすめです。" },
];

export default function Home() {
  // 評価の高い順に並べ替え（元の配列を変更しないよう [...] でコピーしてからsort）
  const ranked = [...hairDryers].sort((a, b) => b.rating - a.rating);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      {/* タイトル・導入文 */}
      <h1 className="mb-4 text-2xl font-bold text-gray-800">ヘアドライヤーおすすめランキング</h1>
      <p className="mb-8 leading-relaxed text-gray-700">
        ヘアドライヤー{hairDryers.length}機種を、風量・重さ・価格・機能で比較しました。用途や条件で絞り込んで、自分にぴったりの1台を見つけてください。
      </p>

      {/* 目次 */}
      <TableOfContents items={tocItems} />

      {/* 選び方（scroll-mt-20：固定ヘッダーに見出しが隠れないよう、スクロール位置を下げる） */}
      <section id="point" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-xl font-bold text-gray-800">ヘアドライヤーの選び方</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {guidePoints.map((point, index) => (
            <div key={point.title} className="rounded-2xl border border-pink-100 bg-white p-5">
              <p className="mb-1 text-xs font-bold text-pink-500">POINT {index + 1}</p>
              <h3 className="mb-2 font-bold text-gray-800">{point.title}</h3>
              <p className="text-sm leading-relaxed text-gray-600">{point.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ランキング（絞り込み・並び替えはRankingSectionの中で行う） */}
      <section id="ranking" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-xl font-bold text-gray-800">おすすめランキングTOP10</h2>
        <RankingSection dryers={ranked} />
      </section>

      {/* 比較表（絞り込みに関係なく全商品を表示） */}
      <section id="comparison" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-xl font-bold text-gray-800">スペック比較表</h2>
        <ComparisonTable dryers={ranked} />
      </section>

      {/* よくある質問 */}
      <section id="faq" className="scroll-mt-20">
        <h2 className="mb-6 text-xl font-bold text-gray-800">よくある質問</h2>
        <Faq items={faqItems} />
      </section>
    </main>
  );
}