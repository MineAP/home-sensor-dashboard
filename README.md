# Sensor Info Dashboard

Raspberry Pi のセンサー情報を表示する Vue 3 の SPA です。  
ホーム画面で CPU 情報、温度・湿度、カメラ画像の概要を確認でき、履歴画面とカメラ画面へ遷移できます。

![preview](./preview.jpeg)

## 概要

- `/` では CPU 情報、温度・湿度、カメラ画像の概要を表示します
- `/temphistory` では温度・湿度の履歴を表示します
- `/camera` では Raspberry Pi カメラ画像と姿勢推定の切り替えを行います
- ルーティングは hash ベースです
- データ取得先は別途起動した API サーバーです

## 動作環境

- Node.js 24 以上
- pnpm 9 以上
- Vue 3
- Vue Router 4
- TypeScript 5.9 系
- Vite 4 系
- Chart.js 4 系
- moment 2 系

## 前提

このアプリが参照する API サーバーを別途起動しておく必要があります。

- https://github.com/MineAP/home-sensor-api

主な参照 API は次の通りです。

- `GET /raspicpuinfo`
- `GET /sensorlogs/last`
- `GET /sensorlogs?count=...`
- `GET /raspicameradata`
- `POST /movenet/inference/`

## セットアップ

```sh
pnpm install
```

## 環境変数

プロジェクトルートに `.env` を作成し、API の接続先を設定します。

```env
VITE_API_HOST=http://localhost:3000
VITE_SUMMARY_UPDATE_MOCK_MODE=normal
```

`VITE_SUMMARY_UPDATE_MOCK_MODE` は `normal` / `stale` / `invalid` を指定できます。
URL の `?summaryUpdateMockMode=...` を付けると、`.env` の設定を一時的に上書きできます。

URL の例:

- `http://localhost:5173/?summaryUpdateMockMode=normal#/`
- `http://localhost:5173/?summaryUpdateMockMode=stale#/`
- `http://localhost:5173/?summaryUpdateMockMode=invalid#/`

## 開発

```sh
pnpm run dev
```

## チェックとビルド

```sh
pnpm run type-check
pnpm run build
```

## プレビュー

```sh
pnpm run preview
```

## Docker

`dockerfile` からビルドできます。

```sh
docker build -t home-sensor-dashboard .
docker run --rm -p 80:80 home-sensor-dashboard
```

## AI 向け資料

- [AGENTS.md](./AGENTS.md)
