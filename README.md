# Sensor Info Dashboard

Vue.js (3.3) + TypeScriptのSingle Page Application（SPA） 

## 動作環境

- Nodejs: 18.16.17
- TypeScript: 5.0.6
- vue: 3.3.4
- vue-router: 4.2.4

## 前提

通信先のWebAPIとして、以下のAPIサーバーが動作していること
- https://github.com/MineAP/home-sensor-api

## Project Setup

```sh
npm install
```

### Config

create `.env`, and write setting.

```
VITE_API_HOST=http://localhost:3000
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
