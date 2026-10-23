// src/components/Footer.tsx
// サイト共通のフッター（注意書き・クレジット・コピーライト）

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-pink-100 bg-white">
      <div className="mx-auto max-w-3xl px-4 py-8 text-center text-xs text-gray-500">
        {/* データの出典・時点に関する注意書き */}
        <p className="mb-2">
          ※当サイトは個人制作のポートフォリオです。価格は2026年10月時点の参考価格、スペックはメーカー公称値、評価は当サイト独自のものです。購入の際は各メーカー・販売店の最新情報をご確認ください。
        </p>

        {/* 楽天ウェブサービスのクレジット表記（APIを利用するサイトに表示が必要） */}
        <p className="mb-2">
          <a
            href="https://webservice.rakuten.co.jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-pink-600"
          >
            Supported by Rakuten Developers
          </a>
          ／商品画像の提供：楽天市場
        </p>

        <p>&copy; 2026 ヘアドライヤー比較ナビ</p>
      </div>
    </footer>
  );
}