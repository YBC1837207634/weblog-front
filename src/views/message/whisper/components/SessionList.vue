<template>
  <div class="session-list">
    <div
      :class="`item ${session.receiverId == defaultSelect ? 'selected' : ''}`"
      v-for="session in sessionList"
      :key="session.id"
      @click="clickHandler(session.receiverId, $event)"
    >
      <div class="btn" @click="closeBtn(session.receiverId)">
        <icon-close />
      </div>
      <div class="avatar">
        <a-avatar>
          <img alt="avatar" :src="setting.baseUrl + session.user?.avatar" />
        </a-avatar>
      </div>
      <div class="info">
        <div class="title">
          {{ session.user?.nickname }}
        </div>
        <div class="extarinfo">{{ JSON.parse(session?.lastMsg?.content).content }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import setting from '@/config/setting'

defineProps({
  sessionList: Array,
  defaultSelect: String
})

const emits = defineEmits(['clickItem', 'removeSession'])

function clickHandler(id, event) {
  emits('clickItem', id)
  // event.classList.add('selected')
  event.currentTarget.classList.add('selected')
}

function closeBtn(id) {
  emits('removeSession', id)
}

</script>

<style scoped>
.item {
  height: 80px;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  display: flex;
}

.info {
  margin-left: 10px;
}

.info > .title {
  font-size: 14px;
}

.info > .extarinfo {
  overflow: hidden;
  width: 102px;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 12px;
  color: #999999;
  padding: 5px 0;
}

.item:hover {
  background-color: #e4e5e6;
  cursor: pointer;
}

.selected {
  background-color: #e4e5e6;
}

.btn {
  font-size: 16px;
    line-height: 40px;
    margin-right: 10px;
}

</style>
