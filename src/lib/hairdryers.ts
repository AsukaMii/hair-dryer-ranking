// src/lib/hairdryers.ts
// JSONの商品データを読み込み、HairDryer型として使えるようにする

import type { HairDryer } from "@/types/hairdryer";
import data from "@/data/hairdryers.json";

// JSONは文字列として読み込まれるため、「as」でHairDryer型の配列として扱うよう指定する
export const hairDryers = data as HairDryer[];

// 評価の高い順（＝ランキング順）に並べた配列を返す
export function getRankedHairDryers(): HairDryer[] {
  return [...hairDryers].sort((a, b) => b.rating - a.rating);
}

// IDから商品を1件探す（見つからなければundefinedを返す）
export function getHairDryerById(id: string): HairDryer | undefined {
  return hairDryers.find((dryer) => dryer.id === id);
}