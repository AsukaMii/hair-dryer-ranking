// src/components/Footer.tsx
// サイト共通のフッター（注意書き・コピーライト）

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-pink-100 bg-white">
      <div className="mx-auto max-w-3xl px-4 py-8 text-center text-xs text-gray-500">
        {/* 架空データであることの注意書き */}
        <p className="mb-2">※当サイトは個人制作のポートフォリオです。掲載している商品・メーカー・価格はすべて架空のものです。</p>
        <p>&copy; 2026 ヘアドライヤー比較ナビ</p>
      </div>
    </footer>
  );
}