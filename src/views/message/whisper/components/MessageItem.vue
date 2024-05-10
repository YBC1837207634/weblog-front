<template>
  <div :class="isMe ? 'msg-item msg-item-is-me' : 'msg-item msg-item-not-me'">
    <a
      href="#"
      class="avatar"
      :style="{ 'background-image': `url(${setting.baseUrl + userInfo?.avatar})` }"
      v-if="!isMe && userInfo?.avatar"
    ></a>
    <div class="msg-content">
      <div class="text-msg">
        {{ JSON.parse(msg?.content).content }}
      </div>
    </div>
    <a
      href="#"
      class="avatar"
      :style="{ 'background-image': `url(${setting.baseUrl + userInfo.avatar})` }"
      v-if="isMe && userInfo.avatar"
    ></a>
  </div>
</template>

<script setup>
import setting from '@/config/setting'

defineProps({
  isMe: Boolean,
  userInfo: Object,
  avatar: String,
  msg: Object
})
</script>

<style scoped>
.msg-item {
  box-sizing: border-box;
  font-size: 14px;
  padding: 0 16px;
  padding-bottom: 16px;
  display: flex;
  align-items: stretch;
}

.avatar {
  display: block;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background-size: cover;
}

.msg-content {
  margin: 0 10px;
  box-sizing: border-box;
  line-height: 1.5;
  min-width: 40px;
  color: #333333;
}

.msg-item-not-me > .msg-content {
  background: #fff;
  border-radius: 0 16px 16px 16px;
}

.msg-item-is-me > .msg-content {
  background: #80b9f2;
  border-radius: 16px 0 16px 16px;
}

.msg-item-is-me {
  justify-content: flex-end;
}

.msg-item-not-me {
}

.text-msg {
  display: inline-block;
  box-sizing: border-box;
  padding: 12px;
  max-width: 708px;
  /* background-color: #95ec69; */
  overflow-wrap: break-word;
  word-wrap: break-word;
  /* border-radius: 8px; */
}

@media (max-width: 768px) {
  .msg-item {
    width: 100%;
  }
  /* .avatar {
    width: 36px;
    height: 36px;
  } */
  .msg-content {
    /* width: calc(100% - 36px); */
    min-width: 40px;
    max-width: calc(100% - 60px);
  }
  .text-msg {
    /* max-width: calc(100% -40px) */
    /* max-width: calc(100% - 50px); */
    max-width: 100%;
  }
}
</style>
