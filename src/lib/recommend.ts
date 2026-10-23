// src/lib/recommend.ts
// 診断の回答から、おすすめのドライヤーを計算する

import type { HairDryer, UseCase } from "@/types/hairdryer";
import { useCaseLabels } from "@/lib/labels";

// 髪の長さ
export type HairLength = "short" | "medium" | "long";

// 予算
export type Budget = "under10k" | "under30k" | "any";

// 診断の回答一式
export type QuizAnswers = {
  hairLength: HairLength; // 髪の長さ
  priority: UseCase;      // いちばん重視すること
  budget: Budget;         // 予算
};

// 診断結果1件分（商品・スコア・おすすめ理由）
export type Recommendation = {
  dryer: HairDryer;
  score: number;
  reasons: string[];
};

// 予算ごとの上限金額（こだわらない場合は上限なし）
const budgetLimits: Record<Budget, number> = {
  under10k: 10000,
  under30k: 30000,
  any: Infinity,
};

// 回答をもとに商品ごとにスコアを付け、上位から指定件数を返す
export function recommendDryers(dryers: HairDryer[], answers: QuizAnswers, count = 3): Recommendation[] {
  const limit = budgetLimits[answers.budget];

  // 予算内の商品だけに絞る（1件もなければ全商品から選ぶ）
  const inBudget = dryers.filter((dryer) => dryer.price <= limit);
  const candidates = inBudget.length > 0 ? inBudget : dryers;

  return candidates
    .map((dryer) => {
      let score = dryer.rating; // ベースは評価の点数
      const reasons: string[] = [];

      // 重視することと用途が一致したら大きく加点
      if (dryer.useCases.includes(answers.priority)) {
        score += 3;
        reasons.push(`「${useCaseLabels[answers.priority]}」重視の方におすすめ`);
      }

      // 髪の長さに応じた加点
      if (answers.hairLength === "long" && dryer.airflow >= 2.0) {
        score += 2;
        reasons.push("大風量でロングヘアも乾かしやすい");
      }
      if (answers.hairLength === "medium" && dryer.airflow >= 1.5) {
        score += 1;
        reasons.push("十分な風量でミディアムヘアにちょうどいい");
      }
      if (answers.hairLength === "short" && dryer.weightGrams <= 500) {
        score += 1;
        reasons.push("軽量で扱いやすい");
      }

      // 予算内で選べた場合は理由に追加
      if (answers.budget !== "any" && inBudget.length > 0) {
        reasons.push(`予算${limit.toLocaleString()}円以内`);
      }

      return { dryer, score, reasons };
    })
    .sort((a, b) => b.score - a.score) // スコアの高い順に並べる
    .slice(0, count); // 上位から指定件数だけ取り出す
}