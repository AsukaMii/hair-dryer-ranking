// src/lib/rakuten.ts
// 楽天市場商品検索APIから、商品画像と商品ページのURLを取得する（サーバー側でのみ実行）

import { cacheLife } from "next/cache";
import { hairDryers } from "@/lib/hairdryers";
import { siteConfig } from "@/lib/site";

// サイトで使う楽天の商品情報
export type RakutenItem = {
  imageUrl: string; // 商品画像のURL
  itemUrl: string;  // 楽天市場の商品ページURL
  shopName: string; // ショップ名
};

// 商品IDごとの楽天の商品情報（取得できなかった商品はnull）
export type RakutenItemMap = Record<string, RakutenItem | null>;

// APIから返ってくる商品データのうち、使う項目だけの型
type RakutenApiItem = {
  itemUrl: string;
  shopName: string;
  mediumImageUrls?: string[];
};

// 楽天市場商品検索APIのURL（末尾の日付がAPIのバージョン）
const API_URL = "https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260701";

// 楽天に登録した「許可されたWebサイト」（Refererとして送る）
const REFERRER = `${siteConfig.url}/`;

// 429（リクエスト過多）のときに再試行する回数
const MAX_RETRIES = 3;

// 商品ごとの検索キーワード（型番で検索して、目的の商品が出やすくする）
const searchKeywords: Record<string, string> = {
  "panasonic-eh-na0k": "パナソニック ナノケア EH-NA0K",
  "dyson-hd16": "Dyson Supersonic Nural Shine HD16",
  "sharp-ib-wx902": "シャープ IB-WX902",
  "refa-beautech-dryer-s-plus": "ReFa BEAUTECH DRYER S+",
  "kinujo-kh30": "KINUJO ドライヤー KH301",
  "tescom-td570a": "テスコム TD570A",
  "panasonic-eh-ne7n": "パナソニック イオニティ EH-NE7N",
  "salonia-sal23209": "SALONIA SAL23209",
  "sharp-ib-p300": "シャープ IB-P300",
  "panasonic-eh-ne4k": "パナソニック イオニティ EH-NE4K",
};

// 指定したミリ秒だけ待つ
function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// APIを呼び出す（429が返ってきたら、少しずつ待つ時間を延ばして再試行する）
async function fetchWithRetry(url: string): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, {
      // fetchではRefererをheadersに書いても送られないため、referrerで指定する
      referrer: REFERRER,
      referrerPolicy: "unsafe-url",
      headers: { Origin: siteConfig.url },
    });

    // 429以外、または再試行の上限に達したら、そのまま結果を返す
    if (res.status !== 429 || attempt >= MAX_RETRIES) return res;

    // 2秒 → 4秒 → 6秒 と待ってから再試行
    await wait(2000 * (attempt + 1));
  }
}

// キーワードで検索し、最初の1件の画像とURLを返す（失敗したらnull）
async function searchItem(keyword: string): Promise<RakutenItem | null> {
  const applicationId = process.env.RAKUTEN_APPLICATION_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;

  // 環境変数が設定されていなければ、APIを呼ばずにnullを返す
  if (!applicationId || !accessKey) return null;

  const params = new URLSearchParams({
    applicationId,
    accessKey,
    keyword,
    format: "json",
    formatVersion: "2", // 結果がシンプルな配列で返る形式
    hits: "1",          // 1件だけ取得
    imageFlag: "1",     // 画像がある商品だけ
  });

  try {
    const res = await fetchWithRetry(`${API_URL}?${params}`);

    if (!res.ok) {
      // エラーの内容もログに出す（原因を調べやすくするため）
      console.error(`楽天APIエラー（${keyword}）：${res.status}`, await res.text());
      return null;
    }

    const data: { Items?: RakutenApiItem[] } = await res.json();
    const item = data.Items?.[0];
    const imageUrl = item?.mediumImageUrls?.[0];

    // 商品または画像が見つからなければnull
    if (!item || !imageUrl) return null;

    return {
      // 画像URL末尾のサイズ指定（128x128）を大きいサイズに変更する
      imageUrl: imageUrl.replace("_ex=128x128", "_ex=400x400"),
      itemUrl: item.itemUrl,
      shopName: item.shopName,
    };
  } catch (error) {
    console.error(`楽天APIの呼び出しに失敗しました（${keyword}）`, error);
    return null;
  }
}

// 全商品分の楽天の商品情報を取得する
export async function getRakutenItemMap(): Promise<RakutenItemMap> {
  // 結果をキャッシュし、APIを毎回呼ばないようにする（1日ごとに更新）
  "use cache";
  cacheLife("days");

  // 環境変数が読み込めているかをログに出す（値そのものは出さない）
  console.log(
    `楽天API：環境変数 アプリID=${process.env.RAKUTEN_APPLICATION_ID ? "あり" : "なし"}／アクセスキー=${process.env.RAKUTEN_ACCESS_KEY ? "あり" : "なし"}`
  );

  const map: RakutenItemMap = {};

  for (const dryer of hairDryers) {
    const keyword = searchKeywords[dryer.id] ?? `${dryer.brand} ${dryer.name}`;
    map[dryer.id] = await searchItem(keyword);

    // 楽天APIの利用制限（1秒に1回程度）を守るため、1件ごとに少し待つ
    await wait(1100);
  }

  // 何件取得できたかをログに出す
  const successCount = Object.values(map).filter((item) => item !== null).length;
  console.log(`楽天API：${hairDryers.length}件中 ${successCount}件の画像を取得しました`);

  return map;
}