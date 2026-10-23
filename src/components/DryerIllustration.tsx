// src/components/DryerIllustration.tsx
// ドライヤーのイラスト（SVG）。色を変えて商品ごとに使い回す

// この部品が受け取る値（props）の型
type Props = {
  color: string;      // 本体の色
  label: string;      // 読み上げ用の説明文
  className?: string; // サイズ調整用のクラス（省略可）
};

export default function DryerIllustration({ color, label, className = "" }: Props) {
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={label} className={className}>
      {/* 背景の丸（本体色をうすく敷く） */}
      <circle cx="100" cy="100" r="90" fill={color} opacity="0.15" />

      {/* 風のライン */}
      <g stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.5">
        <line x1="8" y1="66" x2="20" y2="66" />
        <line x1="2" y1="80" x2="20" y2="80" />
        <line x1="8" y1="94" x2="20" y2="94" />
      </g>

      {/* 持ち手（少し傾ける） */}
      <g transform="rotate(-10 120 100)">
        <rect x="104" y="92" width="30" height="80" rx="14" fill={color} />
        {/* 持ち手の影 */}
        <rect x="104" y="92" width="30" height="80" rx="14" fill="#000" opacity="0.1" />
        {/* スイッチ */}
        <rect x="113" y="112" width="12" height="22" rx="6" fill="#fff" opacity="0.7" />
        {/* コード */}
        <path d="M119 172 C119 188, 140 190, 150 182" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>

      {/* ノズル（先端） */}
      <rect x="22" y="58" width="40" height="44" rx="10" fill={color} />
      <rect x="22" y="58" width="40" height="44" rx="10" fill="#000" opacity="0.15" />

      {/* 本体 */}
      <rect x="50" y="48" width="112" height="64" rx="32" fill={color} />

      {/* 後ろの吸気口 */}
      <circle cx="146" cy="80" r="22" fill="#fff" opacity="0.35" />
      <circle cx="146" cy="80" r="12" fill="#fff" opacity="0.5" />

      {/* ツヤのハイライト */}
      <rect x="64" y="56" width="56" height="10" rx="5" fill="#fff" opacity="0.45" />
    </svg>
  );
}