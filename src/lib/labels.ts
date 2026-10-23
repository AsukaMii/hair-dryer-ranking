// src/lib/labels.ts
// 画面に表示する日本語ラベルをまとめたファイル

import type { UseCase } from "@/types/hairdryer";

// 用途の英語キーを日本語ラベルに変換する対応表
// Record<UseCase, string> にすることで、UseCaseの値が1つでも欠けるとエラーになる
export const useCaseLabels: Record<UseCase, string> = {
  quickDry: "速乾",
  damageCare: "ダメージケア",
  travel: "旅行・持ち運び",
  styling: "スタイリング",
};