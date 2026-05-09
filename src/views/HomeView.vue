<script setup lang="ts">
import Title from '../components/Title.vue'
import Summary from '../components/Summary.vue'
</script>

<template>
  <header>
    <div class="wrapper">
      <Title msg="Sensor Info Dashboard" />
    </div>
  </header>

  <main>
    <Summary />
  </main>
</template>

<style scoped>
header,
main {
  width: 100%;
}

header {
  margin-bottom: 1.75rem;
}

@media (min-width: 1024px) {
  header {
    margin-bottom: 2.25rem;
  }

  header .wrapper {
    display: flex;
    align-items: flex-start;
  }
}
</style>
