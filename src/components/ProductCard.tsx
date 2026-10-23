// src/components/ProductCard.tsx
// ランキング用の商品カード（順位・画像・評価・価格・スペック・おすすめポイント・リンク）

import Link from "next/link";
import type { HairDryer } from "@/types/hairdryer";
import type { RakutenItem } from "@/lib/rakuten";
import StarRating from "@/components/StarRating";
import ProductImage from "@/components/ProductImage";
import { useCaseLabels } from "@/lib/labels"; // 用途ラベルは共通ファイルから読み込む

// この部品が受け取る値（props）の型
type Props = {
  dryer: HairDryer;                 // 商品データ1件
  rank: number;                     // 順位
  rakutenItem?: RakutenItem | null; // 楽天の商品情報（ない場合もある）
};

// 順位に応じたバッジの色（1〜3位は金・銀・銅、それ以外はグレー）
function getBadgeColor(rank: number): string {
  if (rank === 1) return "bg-amber-400";
  if (rank === 2) return "bg-slate-400";
  if (rank === 3) return "bg-orange-400";
  return "bg-gray-500";
}

export default function ProductCard({ dryer, rank, rakutenItem }: Props) {
  // 詳細ページのURL
  const detailUrl = `/products/${dryer.id}`;

  return (
    <article className="relative rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
      {/* 順位バッジ */}
      <span
        className={`absolute -top-3 -left-3 z-10 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow ${getBadgeColor(rank)}`}
      >
        {rank}位
      </span>

      <div className="flex flex-col gap-4 sm:flex-row">
        {/* 商品画像（楽天の画像は楽天市場の商品ページにリンクする） */}
        <div className="mx-auto flex aspect-square w-full max-w-60 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-3 ring-1 ring-pink-100 sm:w-40">
          {rakutenItem ? (
            <a href={rakutenItem.itemUrl} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
              <ProductImage dryer={dryer} rakutenItem={rakutenItem} sizes="(min-width: 640px) 160px, 240px" />
            </a>
          ) : (
            <ProductImage dryer={dryer} />
          )}
        </div>

        <div className="flex-1">
          {/* メーカー名・商品名（商品名は詳細ページへのリンク） */}
          <p className="text-xs text-gray-500">{dryer.brand}</p>
          <h3 className="text-lg font-bold text-gray-800">
            <Link href={detailUrl} className="hover:text-pink-600 hover:underline">
              {dryer.name}
            </Link>
          </h3>

          {/* 星評価 */}
          <div className="mt-1">
            <StarRating rating={dryer.rating} />
          </div>

          {/* 価格（3桁区切り） */}
          <p className="mt-2 text-xl font-bold text-pink-600">
            {dryer.price.toLocaleString()}
            <span className="ml-0.5 text-sm">円（税込）</span>
          </p>

          {/* 用途タグ */}
          <ul className="mt-2 flex flex-wrap gap-1">
            {dryer.useCases.map((useCase) => (
              <li key={useCase} className="rounded-full bg-pink-100 px-2 py-0.5 text-xs text-pink-700">
                {useCaseLabels[useCase]}
              </li>
            ))}
          </ul>

          {/* 主なスペック */}
          <dl className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-lg bg-gray-50 p-2">
              <dt className="text-gray-500">風量</dt>
              <dd className="font-bold">{dryer.airflow}m³/分</dd>
            </div>
            <div className="rounded-lg bg-gray-50 p-2">
              <dt className="text-gray-500">重さ</dt>
              <dd className="font-bold">{dryer.weightGrams}g</dd>
            </div>
            <div className="rounded-lg bg-gray-50 p-2">
              <dt className="text-gray-500">イオン</dt>
              {/* true/falseで表示を切り替える */}
              <dd className="font-bold">{dryer.hasIon ? "あり" : "なし"}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* おすすめポイント */}
      <div className="mt-4 rounded-xl bg-pink-50 p-4">
        <p className="mb-2 text-sm font-bold text-pink-700">おすすめポイント</p>
        <ul className="space-y-1 text-sm text-gray-700">
          {dryer.points.map((point) => (
            <li key={point} className="flex gap-2">
              <span className="text-pink-500">✓</span>
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* ボタン（楽天の商品がある場合は2つ並べる） */}
      <div className={`mt-4 grid gap-2 ${rakutenItem ? "sm:grid-cols-2" : ""}`}>
        <Link
          href={detailUrl}
          className="block rounded-full bg-pink-500 py-3 text-center text-sm font-bold text-white transition hover:bg-pink-600"
        >
          詳細を見る →
        </Link>
        {rakutenItem && (
          <a
            href={rakutenItem.itemUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-full border border-pink-500 py-3 text-center text-sm font-bold text-pink-600 transition hover:bg-pink-50"
          >
            楽天市場で見る
          </a>
        )}
      </div>
    </article>
  );
}