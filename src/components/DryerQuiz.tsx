// src/components/DryerQuiz.tsx
// ドライヤー診断（質問に1問ずつ答えると、おすすめ3機種を表示する）

// ボタン操作で画面が変わる部品なので、ブラウザ側で動かす
"use client";

import { useState } from "react";
import Link from "next/link";
import type { HairDryer } from "@/types/hairdryer";
import type { RakutenItemMap } from "@/lib/rakuten";
import { recommendDryers, type QuizAnswers } from "@/lib/recommend";
import ProductImage from "@/components/ProductImage";

// この部品が受け取る値（props）の型
type Props = {
  dryers: HairDryer[];
  rakutenItems: RakutenItemMap; // 商品IDごとの楽天の商品情報（画像の表示に使う）
};

// 質問1問分の型（keyは回答を保存する項目名）
type Question = {
  key: keyof QuizAnswers;
  title: string;
  options: { value: string; label: string }[];
};

// 質問の一覧（質問を増やす・変えるときはここを書き換える）
const questions: Question[] = [
  {
    key: "hairLength",
    title: "髪の長さは？",
    options: [
      { value: "short", label: "ショート" },
      { value: "medium", label: "ミディアム" },
      { value: "long", label: "ロング" },
    ],
  },
  {
    key: "priority",
    title: "いちばん重視したいことは？",
    options: [
      { value: "quickDry", label: "とにかく速く乾かしたい" },
      { value: "damageCare", label: "髪をいたわりたい" },
      { value: "travel", label: "軽さ・持ち運びやすさ" },
      { value: "styling", label: "スタイリングもしたい" },
    ],
  },
  {
    key: "budget",
    title: "予算は？",
    options: [
      { value: "under10k", label: "1万円以下" },
      { value: "under30k", label: "3万円以下" },
      { value: "any", label: "こだわらない" },
    ],
  },
];

export default function DryerQuiz({ dryers, rakutenItems }: Props) {
  // 今表示している質問の番号（0から始まる）
  const [step, setStep] = useState(0);
  // これまでの回答（まだ答えていない項目は入っていない）
  const [answers, setAnswers] = useState<Partial<Record<keyof QuizAnswers, string>>>({});

  // すべての質問に答え終わったか
  const isFinished = step >= questions.length;

  // 選択肢をクリックしたとき：回答を保存して次の質問へ
  function handleSelect(key: keyof QuizAnswers, value: string) {
    setAnswers({ ...answers, [key]: value });
    setStep(step + 1);
  }

  // 最初からやり直す
  function handleReset() {
    setStep(0);
    setAnswers({});
  }

  // 診断結果（答え終わったときだけ計算する）
  // 回答はすべて選択肢から選ばれているので、asでQuizAnswers型として扱う
  const results = isFinished ? recommendDryers(dryers, answers as QuizAnswers) : [];

  return (
    <div className="rounded-2xl border border-pink-100 bg-white p-6">
      {!isFinished ? (
        // ===== 質問画面 =====
        <div>
          {/* 進み具合のバー */}
          <div className="mb-2 flex justify-between text-xs text-gray-500">
            <span>
              Q{step + 1} / {questions.length}
            </span>
            {/* 2問目以降は前の質問に戻れる */}
            {step > 0 && (
              <button type="button" onClick={() => setStep(step - 1)} className="text-pink-600 underline">
                ← 前の質問に戻る
              </button>
            )}
          </div>
          <div className="mb-6 h-2 overflow-hidden rounded-full bg-pink-100">
            <div
              className="h-full rounded-full bg-pink-500 transition-all"
              style={{ width: `${(step / questions.length) * 100}%` }}
            />
          </div>

          {/* 質問文 */}
          <p className="mb-4 text-lg font-bold text-gray-800">{questions[step].title}</p>

          {/* 選択肢 */}
          <div className="grid gap-3 sm:grid-cols-2">
            {questions[step].options.map((option) => {
              // 前の質問に戻ったとき、選んでいた選択肢を強調する
              const isSelected = answers[questions[step].key] === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => handleSelect(questions[step].key, option.value)}
                  className={`rounded-xl border px-4 py-3 text-left text-sm font-bold transition hover:border-pink-400 hover:bg-pink-50 ${
                    isSelected ? "border-pink-500 bg-pink-50 text-pink-700" : "border-pink-200 text-gray-700"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        // ===== 結果画面 =====
        <div>
          <p className="mb-1 text-center text-sm text-pink-600">診断結果</p>
          <p className="mb-6 text-center text-lg font-bold text-gray-800">あなたにおすすめのドライヤー</p>

          <ul className="grid gap-4 sm:grid-cols-3">
            {results.map(({ dryer, reasons }, index) => (
              <li key={dryer.id}>
                <Link
                  href={`/products/${dryer.id}`}
                  className="block h-full rounded-2xl border border-pink-100 p-4 transition hover:border-pink-300 hover:shadow"
                >
                  {/* おすすめ順位 */}
                  <p className="mb-2 text-xs font-bold text-pink-500">おすすめ{index + 1}位</p>

                  {/* 商品画像（楽天の画像があれば写真、なければイラスト） */}
                  <div className="mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-white p-2 ring-1 ring-pink-100">
                    <ProductImage dryer={dryer} rakutenItem={rakutenItems[dryer.id]} sizes="(min-width: 640px) 200px, 100vw" />
                  </div>

                  {/* 商品名・価格 */}
                  <p className="text-xs text-gray-500">{dryer.brand}</p>
                  <p className="text-sm font-bold text-gray-800">{dryer.name}</p>
                  <p className="mt-1 text-sm font-bold text-pink-600">{dryer.price.toLocaleString()}円</p>

                  {/* おすすめの理由 */}
                  <ul className="mt-2 space-y-1 text-xs text-gray-600">
                    {reasons.map((reason) => (
                      <li key={reason} className="flex gap-1">
                        <span className="text-pink-500">✓</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </Link>
              </li>
            ))}
          </ul>

          {/* やり直しボタン */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full border border-pink-500 px-6 py-2 text-sm font-bold text-pink-600 transition hover:bg-pink-50"
            >
              もう一度診断する
            </button>
          </div>
        </div>
      )}
    </div>
  );
}