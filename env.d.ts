/// <reference types="vite/client" />

declare module 'vue/dist/vue.esm-bundler.js';

interface ImportMetaEnv {
    readonly API_HOST: string
}
  
interface ImportMeta {
    readonly env: ImportMetaEnv
}
