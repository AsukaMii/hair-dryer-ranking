// src/app/products/[id]/page.tsx
// 商品詳細ページ（/products/商品ID）

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRankedHairDryers, getHairDryerById } from "@/lib/hairdryers";
import { getRakutenItemMap } from "@/lib/rakuten";
import { buildBreadcrumbJsonLd } from "@/lib/structuredData";
import { useCaseLabels } from "@/lib/labels";
import { siteConfig } from "@/lib/site";
import StarRating from "@/components/StarRating";
import ProductImage from "@/components/ProductImage";
import JsonLd from "@/components/JsonLd";

// このページが受け取る値の型（URLの[id]部分がparams.idに入る）
type Props = {
  params: Promise<{ id: string }>;
};

// URLの値（params）を使うページなので、表示内容が揃うまで待ってから表示する設定
// （全ページgenerateStaticParamsで事前に作られるため、表示速度への影響はほぼない）
export const instant = false;

// ビルド時に作成するページの一覧（商品IDの数だけページが作られる）
export function generateStaticParams() {
  return getRankedHairDryers().map((dryer) => ({ id: dryer.id }));
}

// 商品ごとのタイトル・説明文を作る
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const dryer = getHairDryerById(id);

  // 商品が見つからない場合は何も設定しない
  if (!dryer) return {};

  const title = `${dryer.brand} ${dryer.name}の特徴・スペック`;
  const description = `${dryer.brand} ${dryer.name}の風量・重さ・価格などのスペックと、おすすめポイントを紹介します。`;

  return {
    title, // layout.tsxのtemplateにより「タイトル｜サイト名」になる
    description,
    alternates: {
      canonical: `/products/${dryer.id}`,
    },
    openGraph: {
      type: "website",
      locale: "ja_JP",
      siteName: siteConfig.name,
      title,
      description,
      url: `/products/${dryer.id}`,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  // ランキング順の配列から、この商品の位置（順位）を探す
  const ranked = getRankedHairDryers();
  const index = ranked.findIndex((dryer) => dryer.id === id);

  // 存在しない商品IDなら404ページを表示する
  if (index === -1) notFound();

  const dryer = ranked[index];
  const rank = index + 1;

  // 楽天の商品画像・商品ページURL（トップページと同じキャッシュを使う）
  const rakutenItems = await getRakutenItemMap();
  const rakutenItem = rakutenItems[dryer.id];

  // 表示するスペックの一覧
  const specs = [
    { label: "風量", value: `${dryer.airflow}m³/分` },
    { label: "温風温度", value: dryer.maxTempC !== null ? `${dryer.maxTempC}℃` : "非公表" },
    { label: "消費電力", value: `${dryer.watts}W` },
    { label: "重さ", value: `${dryer.weightGrams}g` },
    { label: "マイナスイオン", value: dryer.hasIon ? "あり" : "なし" },
    { label: "自動温度調節", value: dryer.hasAutoTemp ? "あり" : "なし" },
  ];

  // 用途が1つでも共通する他の商品を、ランキング上位から3件
  const related = ranked
    .filter((item) => item.id !== dryer.id && item.useCases.some((useCase) => dryer.useCases.includes(useCase)))
    .slice(0, 3);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      {/* パンくずリストの構造化データ */}
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "ホーム", path: "/" },
          { name: `${dryer.brand} ${dryer.name}` },
        ])}
      />

      {/* パンくずリスト（画面表示用） */}
      <nav aria-label="パンくずリスト" className="mb-6 text-xs text-gray-500">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-pink-600">ホーム</Link>
          </li>
          <li aria-hidden="true">›</li>
          <li>
            <Link href="/#ranking" className="hover:text-pink-600">ランキング</Link>
          </li>
          <li aria-hidden="true">›</li>
          <li aria-current="page" className="text-gray-700">{dryer.name}</li>
        </ol>
      </nav>

      {/* 商品の基本情報 */}
      <section className="mb-10 rounded-2xl border border-pink-100 bg-white p-6">
        <div className="flex flex-col gap-6 sm:flex-row">
          {/* 商品画像（楽天の画像は楽天市場の商品ページにリンクする） */}
          <div className="mx-auto flex aspect-square w-full max-w-72 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-4 ring-1 ring-pink-100 sm:w-56">
            {rakutenItem ? (
              <a href={rakutenItem.itemUrl} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
                <ProductImage dryer={dryer} rakutenItem={rakutenItem} sizes="(min-width: 640px) 224px, 288px" />
              </a>
            ) : (
              <ProductImage dryer={dryer} />
            )}
          </div>

          <div className="flex-1">
            {/* 順位 */}
            <p className="mb-2 inline-block rounded-full bg-pink-500 px-3 py-1 text-xs font-bold text-white">
              ランキング{rank}位
            </p>
            {/* メーカー名・商品名 */}
            <p className="text-sm text-gray-500">{dryer.brand}</p>
            <h1 className="mb-2 text-2xl font-bold text-gray-800">{dryer.name}</h1>

            {/* 星評価 */}
            <StarRating rating={dryer.rating} />

            {/* 価格 */}
            <p className="mt-3 text-2xl font-bold text-pink-600">
              {dryer.price.toLocaleString()}
              <span className="ml-0.5 text-sm">円（税込）</span>
            </p>
            <p className="text-xs text-gray-500">※2026年10月時点の参考価格</p>

            {/* 用途タグ */}
            <ul className="mt-3 flex flex-wrap gap-1">
              {dryer.useCases.map((useCase) => (
                <li key={useCase} className="rounded-full bg-pink-100 px-2 py-0.5 text-xs text-pink-700">
                  {useCaseLabels[useCase]}
                </li>
              ))}
            </ul>

            {/* 楽天市場へのリンク（商品情報が取得できた場合だけ表示） */}
            {rakutenItem && (
              <a
                href={rakutenItem.itemUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block rounded-full bg-pink-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-pink-600"
              >
                楽天市場で見る
              </a>
            )}
          </div>
        </div>
      </section>

      {/* おすすめポイント */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-bold text-gray-800">おすすめポイント</h2>
        <ul className="space-y-2 rounded-2xl bg-white p-5 text-gray-700">
          {dryer.points.map((point) => (
            <li key={point} className="flex gap-2">
              <span className="text-pink-500">✓</span>
              {point}
            </li>
          ))}
        </ul>
      </section>

      {/* スペック */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-bold text-gray-800">スペック</h2>
        <dl className="overflow-hidden rounded-2xl border border-pink-100 bg-white text-sm">
          {specs.map((spec) => (
            <div key={spec.label} className="flex border-b border-pink-100 last:border-b-0">
              <dt className="w-36 shrink-0 bg-pink-50 px-4 py-3 font-bold text-gray-600">{spec.label}</dt>
              <dd className="px-4 py-3 text-gray-800">{spec.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-2 text-xs text-gray-500">※スペックはメーカー公称値です。</p>
      </section>

      {/* 関連商品（該当がある場合だけ表示） */}
      {related.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-gray-800">あわせて検討したいドライヤー</h2>
          <ul className="grid gap-4 sm:grid-cols-3">
            {related.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/products/${item.id}`}
                  className="block rounded-2xl border border-pink-100 bg-white p-4 transition hover:border-pink-300 hover:shadow"
                >
                  <div className="mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-white p-2 ring-1 ring-pink-100">
                    <ProductImage dryer={item} rakutenItem={rakutenItems[item.id]} sizes="(min-width: 640px) 200px, 100vw" />
                  </div>
                  <p className="text-xs text-gray-500">{item.brand}</p>
                  <p className="text-sm font-bold text-gray-800">{item.name}</p>
                  <p className="mt-1 text-sm font-bold text-pink-600">{item.price.toLocaleString()}円</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ランキングに戻る */}
      <Link href="/#ranking" className="inline-block text-sm text-pink-600 underline">
        ← ランキングに戻る
      </Link>
    </main>
  );
}