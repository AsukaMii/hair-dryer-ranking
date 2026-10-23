// src/components/Faq.tsx
// よくある質問（<details>を使ったアコーディオン）

import type { FaqItem } from "@/data/faq";

// この部品が受け取る値（props）の型
type Props = {
  items: FaqItem[];
};

export default function Faq({ items }: Props) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        // groupを付けると、開閉状態（open）に応じて子要素のスタイルを変えられる
        <details key={item.question} className="group rounded-2xl border border-pink-100 bg-white">
          {/* 質問部分（クリックで開閉）。list-noneと[&::-webkit-details-marker]:hiddenで標準の▶を消す */}
          <summary className="flex cursor-pointer list-none items-center gap-3 p-4 font-bold text-gray-800 [&::-webkit-details-marker]:hidden">
            <span className="text-pink-500">Q</span>
            <span className="flex-1">{item.question}</span>
            {/* ＋アイコン（開いているときは45度回転して×になる） */}
            <span className="text-xl text-pink-400 transition-transform group-open:rotate-45">＋</span>
          </summary>

          {/* 回答部分 */}
          <div className="flex gap-3 border-t border-pink-100 p-4 text-sm leading-relaxed text-gray-700">
            <span className="font-bold text-gray-400">A</span>
            <p className="flex-1">{item.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}