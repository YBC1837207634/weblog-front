<template>
  <div class="msg-time-item">
    {{ getTimeStr(time) }}
  </div>
</template>

<script setup>
import dayjs from 'dayjs'

defineProps(['time'])

function getTimeStr(time) {
  let postTime = dayjs(Number.parseInt(time))
  let currentTime = dayjs()
  if (postTime.get('D') === currentTime.get('D'))
    return '今天' + postTime.format('HH:mm')
  
  return postTime.format('YYYY-MM-DD HH:mm:ss')
}

</script>

<style scoped>
.msg-time-item {
  height: 54px;
  min-height: 54px;
  line-height: 22px;
  padding: 16px 0;
  color: #999;
  font-size: 12px;
  box-sizing: border-box;
  text-align: center;
}
</style>
