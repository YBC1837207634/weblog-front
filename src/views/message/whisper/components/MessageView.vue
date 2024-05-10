<template>
  <div class="message-body" @scroll="scrollHandler" ref="messageBody">
    <div class="more-msg">没有更多消息了~</div>

    <div class="message" v-if="messageList?.length > 0">
      <template v-for="msg in messageList" :key="msg.id">
        <div class="message-time"  v-if="isShow(msg.sendTime)">
          <MessageTimeItem :time="msg.sendTime" />
        </div>
        <MessageItem
          v-if="msg.senderId === currentUser.id"
          :is-me="true"
          :user-info="currentUser"
          :msg="msg"
        />
        <MessageItem v-else :is-me="false" :user-info="TagUser" :msg="msg" />
      </template>
    </div>
  </div>
</template>

<script setup>
import MessageItem from './MessageItem.vue'
import MessageTimeItem from './MessageTimeItem.vue'
import { onMounted, ref, nextTick } from 'vue'



const emit = defineEmits(['scrollTop'])

defineExpose({setScrollEnd})

const props = defineProps({
  end: Boolean,
  messageList: Array,
  currentUser: Object,
  TagUser: Object,
  scrollPos: Number 
})

var messageBody = ref()
var timeRecord = 1


onMounted(() => {
  setTimeout(()=>{
    messageBody.value.scrollTop = messageBody.value.scrollHeight
  }, 50)
})

function scrollHandler(event) {
  const scrollTop = event.target.scrollTop
  if (scrollTop <= 0 && !props.end) {
    event.target.scrollTop = event.target.clientHeight / 2
    emit('scrollTop', event)
  }
}

function setScrollEnd() {
  nextTick(()=>{
    messageBody.value.scrollTop = messageBody.value.scrollHeight
  })
}

function isShow(time) {
  // 间隔十分钟
  let t = Number.parseInt(time)
  // console.log((timeRecord + 600000));
  if (t >= timeRecord && t <= (timeRecord + 600000)) {
    return false
  }  else {
    timeRecord = t
    return true
  }
}



</script>

<style scoped>
.message-body {
  height: 100%;
  width: 100%;
  overflow: auto;
}

.more-msg {
  padding-top: 16px;
  height: 40px;
  box-sizing: border-box;
  color: #999;
  font-size: 12px;
  text-align: center;
}
</style>
