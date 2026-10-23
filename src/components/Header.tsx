// src/components/Header.tsx
// サイト共通のヘッダー（サイト名・ページ内ナビ）

// ナビゲーションの項目（リンク先はページ内のidへのアンカー）
const navItems = [
  { href: "#ranking", label: "ランキング" },
  { href: "#comparison", label: "比較表" },
  { href: "#faq", label: "よくある質問" },
];

export default function Header() {
  return (
    // スクロールしても上部に固定し、背景を少し透かしてぼかす
    <header className="sticky top-0 z-50 border-b border-pink-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
        {/* サイト名 */}
        <a href="/" className="text-lg font-bold whitespace-nowrap text-pink-600">
          ヘアドライヤー比較ナビ
        </a>

        {/* ページ内ナビ（スマホで収まらない場合は横スクロール） */}
        <nav aria-label="ページ内ナビゲーション" className="overflow-x-auto">
          <ul className="flex gap-4 text-sm whitespace-nowrap text-gray-600">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="hover:text-pink-600">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}