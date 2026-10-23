// src/types/hairdryer.ts
// ヘアドライヤー1件分のデータ構造を定義する

// 用途のカテゴリ（決まった値だけを許可する）
export type UseCase = "quickDry" | "damageCare" | "travel" | "styling";
// quickDry：速乾 / damageCare：ダメージケア / travel：旅行・持ち運び / styling：スタイリング

export type HairDryer = {
  id: string;             // 商品ID（URLにも使う）
  name: string;           // 商品名
  brand: string;          // メーカー名
  price: number;          // 参考価格（円）
  rating: number;         // 当サイト独自の評価（1.0〜5.0）
  airflow: number;        // 風量（m³/分・メーカー公称値）
  maxTempC: number | null; // 温風温度（℃）。公表されていない場合はnull
  watts: number;          // 消費電力（W）
  weightGrams: number;    // 本体の重さ（g）
  hasIon: boolean;        // マイナスイオン機能の有無
  hasAutoTemp: boolean;   // 自動温度調節の有無
  useCases: UseCase[];    // おすすめの用途（複数）
  image: string;          // 画像のパス
  points: string[];       // おすすめポイント（箇条書き）
};