// src/types/hairdryer.ts
// ヘアドライヤー1件分のデータ構造を定義する

// 用途のカテゴリ（決まった値だけを許可する）
export type UseCase = "quickDry" | "damageCare" | "travel" | "styling";
// quickDry：速乾 / damageCare：ダメージケア / travel：旅行・持ち運び / styling：スタイリング

export type HairDryer = {
  id: string;             // 商品ID（URLにも使う）
  name: string;           // 商品名
  brand: string;          // メーカー名
  price: number;          // 価格（円）
  rating: number;         // 評価（1.0〜5.0）
  airflow: number;        // 風量（m³/分）
  watts: number;          // 消費電力（W）
  weightGrams: number;    // 本体の重さ（g）
  tempModes: number;      // 温度設定の段階数
  hasIon: boolean;        // イオン機能の有無
  hasScalpMode: boolean;  // 頭皮ケアモードの有無
  isFoldable: boolean;    // 折りたたみ可能か
  useCases: UseCase[];    // おすすめの用途（複数）
  image: string;          // 画像のパス
  points: string[];       // おすすめポイント（箇条書き）
};