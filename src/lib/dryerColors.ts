// src/lib/dryerColors.ts
// 商品ごとのイラストの色（キーは商品ID）

const dryerColors: Record<string, string> = {
  "panasonic-eh-na0k": "#d9a5b3",          // ピンク系
  "dyson-hd16": "#c76b98",                 // フューシャ系
  "sharp-ib-wx902": "#7fa89a",             // グリーン系
  "refa-beautech-dryer-s-plus": "#e8b4bc", // ライトピンク系
  "kinujo-kh30": "#b08968",                // ブラウン系
  "tescom-td570a": "#d96c6c",              // レッド系
  "panasonic-eh-ne7n": "#8fb3d9",          // ブルー系
  "salonia-sal23209": "#a3a3a3",           // グレー系
  "sharp-ib-p300": "#a58bc9",              // パープル系
  "panasonic-eh-ne4k": "#9ca3af",          // グレー系
};

// 商品IDから色を取得する（登録されていない商品はピンクにする）
export function getDryerColor(id: string): string {
  return dryerColors[id] ?? "#f9a8d4";
}