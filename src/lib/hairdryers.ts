// src/lib/hairdryers.ts
// JSONの商品データを読み込み、HairDryer型の配列として使えるようにする

import type { HairDryer } from "@/types/hairdryer";
import data from "@/data/hairdryers.json";

// JSONは文字列として読み込まれるため、「as」でHairDryer型の配列として扱うよう指定する
export const hairDryers = data as HairDryer[];