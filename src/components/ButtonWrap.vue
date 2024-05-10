<template>
  <div class="button-wrap">
    <div class="backtop" ref="backtopBtn" @click="backTop">
      <icon-up />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
var backtopBtn = ref(null)
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

function handleScroll() {
  if (document.documentElement.scrollTop >= 400) {
    backtopBtn.value.style.display = 'block'
  } else {
    backtopBtn.value.style.display = 'none'
  }
}

function backTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>

<style scoped>
.button-wrap {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 1010;
}

.backtop {
  font-size: 16px;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: rgb(255, 255, 255);
  text-align: center;
  line-height: 40px;
  box-sizing: border-box;
  box-sizing: border-box;
  border: 1px solid rgba(0, 0, 0, 0.08);
  cursor: pointer;
  display: none;
}

.backtop:hover {
  box-shadow: 0px 0px 6px rgb(0 21 41 / 35%);
  transition: all 0.28s;
}
</style>
