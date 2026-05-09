<template>
  <div class="item">
    <div class="heading-row">
      <i>
        <slot name="icon"></slot>
      </i>
      <h3>
        <slot name="heading"></slot>
      </h3>
    </div>
    <div class="details">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.item {
  margin-top: 1.25rem;
  display: grid;
  gap: 0.75rem;
  padding: 1.1rem 1.15rem 1.15rem;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 20px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.84), rgba(248, 250, 252, 0.92));
  box-shadow:
    0 18px 40px rgba(15, 23, 42, 0.06),
    0 2px 8px rgba(15, 23, 42, 0.04);
  backdrop-filter: blur(8px);
}

.heading-row {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  min-width: 0;
}

.details {
  min-width: 0;
  padding-left: calc(32px + 0.8rem);
}

i {
  display: flex;
  place-items: center;
  place-content: center;
  width: 32px;
  height: 32px;
  flex: 0 0 auto;
  color: var(--color-text);
}

h3 {
  margin: 0;
  min-width: 0;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--color-heading);
}

@media (min-width: 1024px) {
  .item {
    margin-top: 0;
    padding: 1.15rem 1.25rem 1.2rem;
  }

  .heading-row {
    gap: 0.9rem;
  }

  i {
    width: 42px;
    height: 42px;
    border: 1px solid rgba(148, 163, 184, 0.24);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.96));
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
  }

  .details {
    padding-left: calc(42px + 0.9rem);
  }
}
</style>
