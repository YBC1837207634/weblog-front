<template>
  <div class="mark" v-if="loading">
    <div class="pos"><a-spin :size="32" /></div>
  </div>
</template>

<script setup>
defineProps({
  loading: Boolean
})
</script>

<style scoped>
.mark {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10086;
  background: rgba(0, 0, 0, 0.45);
  pointer-events: auto;
}

.pos {
  position: relative;
  top: 25%;
  left: 40%;
}
</style>
