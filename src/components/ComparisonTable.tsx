// src/components/ComparisonTable.tsx
// 全商品のスペックを横並びで比較する表（横スクロール・項目名列は固定）

import type { ReactNode } from "react";
import type { HairDryer } from "@/types/hairdryer";
import StarRating from "@/components/StarRating";

// この部品が受け取る値（props）の型
type Props = {
  dryers: HairDryer[]; // 表示する商品の配列（並び順もこのまま使う）
};

// 表の1行分の設定
// label：左端に表示する項目名 / render：商品1件を受け取り、セルの中身を返す関数
type Row = {
  label: string;
  render: (dryer: HairDryer) => ReactNode;
};

// true/false を「◯」「－」に変換する
function mark(value: boolean): ReactNode {
  return value ? <span className="text-pink-500">◯</span> : <span className="text-gray-300">－</span>;
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
  },
  {
    label: "価格",
    render: (dryer) => <span className="font-bold text-pink-600">{dryer.price.toLocaleString()}円</span>,
  },
  { label: "風量", render: (dryer) => `${dryer.airflow}m³/分` },
  { label: "消費電力", render: (dryer) => `${dryer.watts}W` },
  { label: "重さ", render: (dryer) => `${dryer.weightGrams}g` },
  { label: "温度設定", render: (dryer) => `${dryer.tempModes}段階` },
  { label: "イオン機能", render: (dryer) => mark(dryer.hasIon) },
  { label: "頭皮ケアモード", render: (dryer) => mark(dryer.hasScalpMode) },
  { label: "折りたたみ", render: (dryer) => mark(dryer.isFoldable) },
];

export default function ComparisonTable({ dryers }: Props) {
  return (
    // 表が画面幅を超えたら横スクロールさせる
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
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-pink-100">
              {/* 項目名（左端に固定） */}
              <th scope="row" className="sticky left-0 z-10 bg-white px-4 py-3 text-left font-bold whitespace-nowrap text-gray-600">
                {row.label}
              </th>

              {dryers.map((dryer) => (
                <td key={dryer.id} className="border-l border-pink-100 px-4 py-3 text-center">
                  {row.render(dryer)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}