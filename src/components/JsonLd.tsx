// src/components/JsonLd.tsx
// 構造化データ（JSON-LD）を<script>タグとして出力する部品

// この部品が受け取る値（props）の型（中身は自由な形のオブジェクト）
type Props = {
  data: Record<string, unknown>;
};

export default function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      // オブジェクトをJSON文字列に変換して埋め込む
      // 「<」をエスケープして、データ内の文字列で</script>が閉じられるのを防ぐ
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}