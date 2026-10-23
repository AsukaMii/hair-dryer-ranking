// src/components/ProductImage.tsx
// 商品画像（楽天の画像があれば写真、なければイラストを表示する）

import Image from "next/image";
import type { HairDryer } from "@/types/hairdryer";
import type { RakutenItem } from "@/lib/rakuten";
import DryerIllustration from "@/components/DryerIllustration";
import { getDryerColor } from "@/lib/dryerColors";

// この部品が受け取る値（props）の型
type Props = {
  dryer: HairDryer;                        // 商品データ
  rakutenItem?: RakutenItem | null;        // 楽天の商品情報（ない場合もある）
  sizes?: string;                          // 表示サイズの目安（画像の最適化に使う）
};

export default function ProductImage({ dryer, rakutenItem, sizes = "160px" }: Props) {
  const alt = `${dryer.brand} ${dryer.name}`;

  // 楽天の画像がある場合は写真を表示（next/imageで自動的に軽量化される）
  if (rakutenItem) {
    return (
      <Image
        src={rakutenItem.imageUrl}
        alt={alt}
        width={400}
        height={400}
        sizes={sizes}
        className="h-full w-full object-contain"
      />
    );
  }

  // 画像がない場合はイラストを表示
  return <DryerIllustration color={getDryerColor(dryer.id)} label={`${alt}のイメージイラスト`} className="h-full w-full" />;
}