# AGENTS.md

## Overview

This repository is a Vue 3 + TypeScript single-page app for displaying Raspberry Pi sensor data.

The app shows:

- CPU status
- Temperature and humidity
- Raspberry Pi camera images
- Temperature and humidity history charts
- Optional posture estimation overlay for camera images

## Tech Stack

- Vue 3
- Vue Router 4
- TypeScript
- Vite
- Chart.js
- moment

## Project Structure

- `src/main.ts` sets up the app and router
- `src/views/HomeView.vue` renders the top summary view
- `src/History.vue` renders the temperature and humidity history view
- `src/Camera.vue` renders the camera view
- `src/components/` contains reusable UI pieces and icons
- `src/utils/api.ts` wraps JSON API requests

## Routing

- `/` shows the main summary page
- `/temphistory` shows the history page
- `/camera` shows the camera page

The router uses hash history, so server-side rewrites are not required.

## Data Flow

The app reads data from the API host defined by `VITE_API_HOST`.

Common endpoints used by the UI:

- `GET /raspicpuinfo`
- `GET /sensorlogs/last`
- `GET /sensorlogs?count=...`
- `GET /raspicameradata`
- `POST /movenet/inference/`

## Local State

Some UI preferences are stored in `localStorage`:

- `autoUpdateChecked`
- `movenetEnableChecked`
- `tempHistoryCount`

## Common Commands

- `pnpm install`
- `pnpm run dev`
- `pnpm run type-check`
- `pnpm run build`
- `pnpm run preview`

## Conventions

- Prefer the shared `requestJson` helper for API calls
- Keep UI copy in Japanese unless there is a strong reason not to
- Match the existing component style and layout patterns
- Clean up timers and event listeners in `onBeforeUnmount`
- Update README when routes, setup steps, or dependencies change

## Verification

When making changes, check at least:

- TypeScript and Vue type safety with `pnpm run type-check`
- Production build with `pnpm run build`
- Visual behavior for pages that use charts, timers, or camera images

## Notes

- The project depends on an external API server
- Camera and chart layouts currently assume wide screens in some places
- If API response shapes change, update the relevant view typings together with the UI
