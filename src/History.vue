<script setup lang="ts">
import LineChart from './components/LineChart.vue'
</script>

<template>
    <main class="history-page">
        <router-link class="back-link" to="/">Back To Top</router-link>
        <h2>温度・湿度</h2>
        <p class="page-note">過去の温度・湿度を時系列で確認できます。</p>
        <LineChart />
    </main>
</template>

<style scoped>

.history-page {
    display: grid;
    align-content: start;
    grid-auto-rows: min-content;
    gap: 0.55rem;
    max-width: 1120px;
    margin: 0 auto;
    padding: 0 0 2rem;
}

.back-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    height: 34px;
    padding: 0 0.58rem;
    box-sizing: border-box;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.75);
    border: 1px solid rgba(148, 163, 184, 0.18);
    box-shadow: 0 6px 16px rgba(15, 23, 42, 0.04);
    font-size: 0.88rem;
    line-height: 1;
}

h2 {
    margin: 0;
    line-height: 1.15;
    letter-spacing: -0.02em;
}

.page-note {
    margin: -0.2rem 0 0.05rem;
    color: var(--color-text);
    opacity: 0.82;
    line-height: 1.45;
}

</style>
