// src/components/RankingSection.tsx
// 絞り込み・並び替え機能付きのランキング一覧

// ブラウザ上で操作に反応する部品は、先頭に "use client" を書く必要がある
"use client";

import { useState } from "react";
import type { HairDryer, UseCase } from "@/types/hairdryer";
import ProductCard from "@/components/ProductCard";
import { useCaseLabels } from "@/lib/labels";

// この部品が受け取る値（props）の型
type Props = {
  dryers: HairDryer[]; // おすすめ順（順位順）に並んだ商品の配列
};

// 並び替えの種類（決まった値だけを許可する）
type SortKey = "recommended" | "priceAsc" | "airflowDesc" | "weightAsc";

// 商品と順位をセットにした型（絞り込み・並び替えをしても元の順位を保つため）
type RankedItem = {
  dryer: HairDryer;
  rank: number;
};

// 並び替えの選択肢に表示するラベル
const sortLabels: Record<SortKey, string> = {
  recommended: "おすすめ順",
  priceAsc: "価格が安い順",
  airflowDesc: "風量が多い順",
  weightAsc: "軽い順",
};

// 並び替えの種類ごとの比較関数（sortに渡す）
const sortFunctions: Record<SortKey, (a: RankedItem, b: RankedItem) => number> = {
  recommended: (a, b) => a.rank - b.rank,
  priceAsc: (a, b) => a.dryer.price - b.dryer.price,
  airflowDesc: (a, b) => b.dryer.airflow - a.dryer.airflow,
  weightAsc: (a, b) => a.dryer.weightGrams - b.dryer.weightGrams,
};

// 用途の選択肢（対応表のキーを配列にしたもの）
const useCaseOptions = Object.keys(useCaseLabels) as UseCase[];

// チェックボックス1つ分の部品（このファイル内だけで使う）
type FilterCheckboxProps = {
  label: string;                         // 表示する文字
  checked: boolean;                      // チェック状態
  onChange: (checked: boolean) => void;  // チェックが切り替わったときに呼ぶ関数
};

function FilterCheckbox({ label, checked, onChange }: FilterCheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-full border border-pink-200 bg-white px-3 py-1.5 text-sm has-checked:border-pink-500 has-checked:bg-pink-50">
      <input
        type="checkbox"
        className="accent-pink-500"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}

export default function RankingSection({ dryers }: Props) {
  // 絞り込み・並び替えの状態（値が変わると画面が自動で再表示される）
  const [ionOnly, setIonOnly] = useState(false);      // イオン機能あり
  const [under10k, setUnder10k] = useState(false);    // 1万円以下
  const [lightOnly, setLightOnly] = useState(false);  // 500g以下
  const [useCase, setUseCase] = useState<UseCase | "all">("all"); // 用途（"all"はすべて）
  const [sortKey, setSortKey] = useState<SortKey>("recommended"); // 並び順

  // 表示する商品を作る：順位を付ける → 条件で絞り込む → 並び替える
  const items = dryers
    .map((dryer, index) => ({ dryer, rank: index + 1 }))
    .filter(({ dryer }) => {
      if (ionOnly && !dryer.hasIon) return false;
      if (under10k && dryer.price > 10000) return false;
      if (lightOnly && dryer.weightGrams > 500) return false;
      if (useCase !== "all" && !dryer.useCases.includes(useCase)) return false;
      return true;
    })
    .sort(sortFunctions[sortKey]);

  // 条件をすべて初期状態に戻す
  function resetFilters() {
    setIonOnly(false);
    setUnder10k(false);
    setLightOnly(false);
    setUseCase("all");
    setSortKey("recommended");
  }

  return (
    <div>
      {/* 絞り込み・並び替えパネル */}
      <div className="mb-8 space-y-4 rounded-2xl border border-pink-100 bg-white p-5">
        {/* 条件のチェックボックス */}
        <div className="flex flex-wrap gap-2">
          <FilterCheckbox label="イオン機能あり" checked={ionOnly} onChange={setIonOnly} />
          <FilterCheckbox label="1万円以下" checked={under10k} onChange={setUnder10k} />
          <FilterCheckbox label="500g以下" checked={lightOnly} onChange={setLightOnly} />
        </div>

        <div className="flex flex-wrap gap-4">
          {/* 用途のセレクト */}
          <label className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">用途</span>
            <select
              className="rounded-lg border border-pink-200 px-2 py-1.5"
              value={useCase}
              onChange={(e) => setUseCase(e.target.value as UseCase | "all")}
            >
              <option value="all">すべて</option>
              {useCaseOptions.map((option) => (
                <option key={option} value={option}>
                  {useCaseLabels[option]}
                </option>
              ))}
            </select>
          </label>

          {/* 並び替えのセレクト */}
          <label className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">並び順</span>
            <select
              className="rounded-lg border border-pink-200 px-2 py-1.5"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
            >
              {(Object.keys(sortLabels) as SortKey[]).map((key) => (
                <option key={key} value={key}>
                  {sortLabels[key]}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* 件数とリセットボタン */}
        <div className="flex items-center justify-between text-sm">
          <p className="text-gray-600">
            {dryers.length}件中 <span className="font-bold text-pink-600">{items.length}件</span> を表示
          </p>
          <button type="button" onClick={resetFilters} className="text-pink-600 underline">
            条件をリセット
          </button>
        </div>
      </div>

      {/* 商品カード一覧（該当なしの場合はメッセージを表示） */}
      {items.length > 0 ? (
        <div className="space-y-8">
          {items.map(({ dryer, rank }) => (
            <ProductCard key={dryer.id} dryer={dryer} rank={rank} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl bg-white p-8 text-center text-gray-500">条件に合う商品がありません。</p>
      )}
    </div>
  );
}