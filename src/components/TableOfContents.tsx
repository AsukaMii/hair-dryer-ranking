// src/components/TableOfContents.tsx
// ページ内の目次

// 目次1項目分の型
type TocItem = {
  id: string;    // リンク先のid
  label: string; // 表示する見出し
};

// この部品が受け取る値（props）の型
type Props = {
  items: TocItem[];
};

export default function TableOfContents({ items }: Props) {
  return (
    <nav aria-label="目次" className="mb-12 rounded-2xl border border-pink-100 bg-white p-5">
      <p className="mb-3 font-bold text-gray-800">目次</p>
      <ol className="space-y-2 text-sm">
        {items.map((item, index) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className="flex gap-2 text-gray-700 hover:text-pink-600">
              {/* 番号（01, 02...の2桁表示） */}
              <span className="font-bold text-pink-500">{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}