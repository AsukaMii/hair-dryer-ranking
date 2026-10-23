// src/components/ComparisonTable.tsx
// 全商品のスペックを横並びで比較する表（横スクロール・項目名列は固定・No.1ハイライト付き）

import type { ReactNode } from "react";
import type { HairDryer } from "@/types/hairdryer";
import StarRating from "@/components/StarRating";

// この部品が受け取る値（props）の型
type Props = {
  dryers: HairDryer[]; // 表示する商品の配列（並び順もこのまま使う）
};

// No.1を判定するための設定
// getValue：比較に使う数値を取り出す関数 / type：大きいほど良い（max）か、小さいほど良い（min）か
type BestRule = {
  getValue: (dryer: HairDryer) => number;
  type: "max" | "min";
};

// 表の1行分の設定
// label：左端に表示する項目名 / render：商品1件を受け取り、セルの中身を返す関数
// best：No.1を判定する設定（判定しない行は省略）
type Row = {
  label: string;
  render: (dryer: HairDryer) => ReactNode;
  best?: BestRule;
};

// true/false を「◯」「－」に変換する
function mark(value: boolean): ReactNode {
  return value ? <span className="text-pink-500">◯</span> : <span className="text-gray-300">－</span>;
}

// 行の設定と商品一覧から、その行のNo.1の値を求める（判定しない行はnull）
function getBestValue(row: Row, dryers: HairDryer[]): number | null {
  if (!row.best) return null;

  // 全商品の値を配列にする
  const values = dryers.map(row.best.getValue);

  // maxなら最大値、minなら最小値を返す
  return row.best.type === "max" ? Math.max(...values) : Math.min(...values);
}

// 表に表示する行の一覧（行を増やしたいときはここに1行追加するだけ）
const rows: Row[] = [
  {
    label: "評価",
    render: (dryer) => (
      <div className="flex justify-center">
        <StarRating rating={dryer.rating} />
      </div>
    ),
    best: { getValue: (dryer) => dryer.rating, type: "max" }, // 評価が高いほど良い
  },
  {
    label: "参考価格",
    render: (dryer) => <span className="font-bold text-pink-600">{dryer.price.toLocaleString()}円</span>,
    best: { getValue: (dryer) => dryer.price, type: "min" }, // 安いほど良い
  },
  {
    label: "風量",
    render: (dryer) => `${dryer.airflow}m³/分`,
    best: { getValue: (dryer) => dryer.airflow, type: "max" }, // 多いほど良い
  },
  // 温風温度は非公表（null）の場合があるので「－」を表示する
  { label: "温風温度", render: (dryer) => (dryer.maxTempC !== null ? `${dryer.maxTempC}℃` : "－") },
  { label: "消費電力", render: (dryer) => `${dryer.watts}W` },
  {
    label: "重さ",
    render: (dryer) => `${dryer.weightGrams}g`,
    best: { getValue: (dryer) => dryer.weightGrams, type: "min" }, // 軽いほど良い
  },
  { label: "マイナスイオン", render: (dryer) => mark(dryer.hasIon) },
  { label: "自動温度調節", render: (dryer) => mark(dryer.hasAutoTemp) },
];

export default function ComparisonTable({ dryers }: Props) {
  return (
    <div>
      {/* No.1バッジの説明 */}
      <p className="mb-2 flex items-center gap-2 text-xs text-gray-500">
        <span className="rounded-full bg-amber-400 px-2 py-0.5 font-bold text-white">No.1</span>
        各項目で最も優れた値
      </p>

      {/* 表が画面幅を超えたら横スクロールさせる */}
      <div className="overflow-x-auto rounded-2xl border border-pink-100 bg-white">
        <table className="min-w-max border-collapse text-sm">
          <thead>
            <tr>
              {/* 左上のセル（stickyで横スクロールしても左端に固定） */}
              <th className="sticky left-0 z-10 bg-pink-50 px-4 py-3 text-left text-gray-600">商品名</th>

              {/* 商品ごとの見出し（順位・メーカー名・商品名） */}
              {dryers.map((dryer, index) => (
                <th key={dryer.id} scope="col" className="min-w-36 border-l border-pink-100 bg-pink-50 px-4 py-3">
                  <span className="block text-xs text-pink-600">{index + 1}位</span>
                  <span className="block text-xs font-normal text-gray-500">{dryer.brand}</span>
                  <span className="block text-gray-800">{dryer.name}</span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* 行の設定を1行ずつ表示し、各行の中で商品ごとにセルを作る */}
            {rows.map((row) => {
              // この行のNo.1の値（行ごとに1回だけ計算する）
              const bestValue = getBestValue(row, dryers);

              return (
                <tr key={row.label} className="border-t border-pink-100">
                  {/* 項目名（左端に固定） */}
                  <th scope="row" className="sticky left-0 z-10 bg-white px-4 py-3 text-left font-bold whitespace-nowrap text-gray-600">
                    {row.label}
                  </th>

                  {dryers.map((dryer) => {
                    // この商品の値がNo.1と同じならハイライトする（同率の場合は複数に付く）
                    const isBest = row.best !== undefined && row.best.getValue(dryer) === bestValue;

                    return (
                      <td
                        key={dryer.id}
                        className={`border-l border-pink-100 px-4 py-3 text-center ${isBest ? "bg-amber-50" : ""}`}
                      >
                        {/* No.1バッジ */}
                        {isBest && (
                          <span className="mb-1 inline-block rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-white">
                            No.1
                          </span>
                        )}
                        <div>{row.render(dryer)}</div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}