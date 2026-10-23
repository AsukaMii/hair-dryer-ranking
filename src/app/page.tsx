// src/app/page.tsx
// トップページ（導入文・目次・選び方・診断・ランキング・比較表・FAQ・構造化データ）

import type { Metadata } from "next";
import { getRankedHairDryers } from "@/lib/hairdryers";
import { getRakutenItemMap } from "@/lib/rakuten";
import { faqItems } from "@/data/faq";
import { buildItemListJsonLd, buildFaqJsonLd } from "@/lib/structuredData";
import TableOfContents from "@/components/TableOfContents";
import DryerQuiz from "@/components/DryerQuiz";
import RankingSection from "@/components/RankingSection";
import ComparisonTable from "@/components/ComparisonTable";
import Faq from "@/components/Faq";
import JsonLd from "@/components/JsonLd";

// このページだけのメタ情報（layout.tsxの設定に上書き・追加される）
export const metadata: Metadata = {
  alternates: {
    canonical: "/", // 正規URL（metadataBaseと組み合わせて完全なURLになる）
  },
};

// 価格・スペックの調査時点
const dataDate = "2026年10月";

// 目次の項目（idは下の各sectionのidと合わせる）
const tocItems = [
  { id: "point", label: "ヘアドライヤーの選び方" },
  { id: "quiz", label: "ドライヤー診断" },
  { id: "ranking", label: "おすすめランキングTOP10" },
  { id: "comparison", label: "スペック比較表" },
  { id: "faq", label: "よくある質問" },
];

// 選び方のポイント
const guidePoints = [
  { title: "風量で選ぶ", text: "乾かす時間を短くしたいなら、風量の多いモデルが目安です。ただし測定方法はメーカーごとに異なります。" },
  { title: "重さで選ぶ", text: "毎日使うなら、腕が疲れにくい500g以下の軽量モデルもチェックしましょう。" },
  { title: "機能で選ぶ", text: "マイナスイオンや自動温度調節など、重視したい機能で絞り込むのがおすすめです。" },
];

// 楽天APIからデータを取得するため、async（非同期）関数にする
export default async function Home() {
  // ランキング順（評価の高い順）の商品一覧
  const ranked = getRankedHairDryers();

  // 楽天の商品画像・商品ページURL（サーバー側で取得し、キャッシュされる）
  const rakutenItems = await getRakutenItemMap();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      {/* 構造化データ（画面には表示されない） */}
      <JsonLd data={buildItemListJsonLd(ranked)} />
      <JsonLd data={buildFaqJsonLd(faqItems)} />

      {/* タイトル・導入文 */}
      <h1 className="mb-4 text-2xl font-bold text-gray-800">ヘアドライヤーおすすめランキング</h1>
      <p className="mb-2 leading-relaxed text-gray-700">
        人気のヘアドライヤー{ranked.length}機種を、風量・重さ・価格・機能で比較しました。用途や条件で絞り込んで、自分にぴったりの1台を見つけてください。
      </p>
      <p className="mb-8 text-xs text-gray-500">
        ※価格は{dataDate}時点の参考価格、スペックはメーカー公称値です。評価は当サイト独自のものです。
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

      {/* ドライヤー診断 */}
      <section id="quiz" className="mb-16 scroll-mt-20">
        <h2 className="mb-2 text-xl font-bold text-gray-800">ドライヤー診断</h2>
        <p className="mb-6 text-sm text-gray-600">3つの質問に答えるだけで、あなたに合うドライヤーが見つかります。</p>
        <DryerQuiz dryers={ranked} />
      </section>

      {/* ランキング（絞り込み・並び替えはRankingSectionの中で行う） */}
      <section id="ranking" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-xl font-bold text-gray-800">おすすめランキングTOP10</h2>
        <RankingSection dryers={ranked} rakutenItems={rakutenItems} />
      </section>

      {/* 比較表（絞り込みに関係なく全商品を表示） */}
      <section id="comparison" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-xl font-bold text-gray-800">スペック比較表</h2>
        <ComparisonTable dryers={ranked} />
        <p className="mt-3 text-xs text-gray-500">
          ※風量はメーカー公称値です。測定方法がメーカーごとに異なるため、目安としてご覧ください。
        </p>
      </section>

      {/* よくある質問 */}
      <section id="faq" className="scroll-mt-20">
        <h2 className="mb-6 text-xl font-bold text-gray-800">よくある質問</h2>
        <Faq items={faqItems} />
      </section>
    </main>
  );
}