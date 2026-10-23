// scripts/test-rakuten.mjs
// 楽天市場商品検索APIが使えるか確認するためのテスト用スクリプト

// 楽天に登録した「許可されたWebサイト」のURL
const SITE_URL = "https://hair-dryer-ranking.vercel.app/";

// 楽天市場商品検索APIのURL（末尾の日付がAPIのバージョン。現行は20260701版）
const API_URL = "https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260701";

// APIに送るパラメータ
const params = new URLSearchParams({
  applicationId: process.env.RAKUTEN_APPLICATION_ID, // .env.localのアプリID
  accessKey: process.env.RAKUTEN_ACCESS_KEY,         // .env.localのアクセスキー
  keyword: "パナソニック EH-NA0K",                    // 検索キーワード
  format: "json",
  formatVersion: "2", // 新しい形式（結果がシンプルな配列で返る）
  hits: "3",          // 取得件数
});

// 楽天APIにリクエスト
const res = await fetch(`${API_URL}?${params}`, {
  // fetchではRefererをheadersに書いても送られないため、referrerで指定する
  referrer: SITE_URL,
  referrerPolicy: "unsafe-url", // URLをそのままRefererとして送る
  headers: {
    Origin: "https://hair-dryer-ranking.vercel.app", // 念のため送信元のサイトも付ける
  },
});

console.log("ステータス:", res.status);
const data = await res.json();

// エラーの場合は内容を表示して終了
if (!res.ok) {
  console.log(data);
  process.exit(1);
}

// 取得した商品の名前・画像URL・商品ページURLを表示
for (const item of data.Items) {
  console.log("商品名:", item.itemName);
  console.log("画像:", item.mediumImageUrls?.[0]);
  console.log("URL:", item.itemUrl);
  console.log("---");
}