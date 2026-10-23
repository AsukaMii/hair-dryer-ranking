// src/components/StarRating.tsx
// 評価（1.0〜5.0）を星5つで表示する部品

// この部品が受け取る値（props）の型
type Props = {
  rating: number; // 評価の数値
};

export default function StarRating({ rating }: Props) {
  // 評価を0〜100%に変換（例：4.5 → 90%）
  const percent = (rating / 5) * 100;

  return (
    <div className="flex items-center gap-1" aria-label={`5点中${rating}点`}>
      {/* グレーの星5つの上に、黄色の星を評価分の幅だけ重ねて表示する */}
      <span className="relative inline-block text-lg leading-none text-gray-300">
        ★★★★★
        <span
          className="absolute top-0 left-0 overflow-hidden whitespace-nowrap text-amber-400"
          style={{ width: `${percent}%` }}
        >
          ★★★★★
        </span>
      </span>
      {/* 数値も並べて表示（小数1桁に固定） */}
      <span className="text-sm font-bold text-gray-700">{rating.toFixed(1)}</span>
    </div>
  );
}