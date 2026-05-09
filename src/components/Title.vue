<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      センサー情報ダッシュボード
      <!-- <a href="https://github.com/MineAP" target="_blank" rel="noopener">MineAP(GitHub)</a>  -->
    </h3>
  </div>
</template>

<style scoped>
.greetings {
  max-width: 640px;
}

h1 {
  font-size: clamp(2.1rem, 4vw, 3.2rem);
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: 0.5rem;
}

h3 {
  font-size: 1rem;
  line-height: 1.5;
  color: var(--color-text);
  opacity: 0.9;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings {
    padding-top: 0.25rem;
  }

  .greetings h1,
  .greetings h3 {
    text-align: left;
  }

  h3 {
    max-width: 32rem;
  }
}
</style>
