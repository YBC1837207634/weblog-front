<template>
  <a-comment class="reply" align="right" :avatar="avatar">
    <template #actions>
      <a-button key="0" type="secondary" @click="cancle"> 取消 </a-button>
      <a-button key="1" type="primary" @click="commit"> 回复 </a-button>
    </template>
    <template #content>
      <a-input placeholder="输入文本" v-model="replyContent" @blur="handlerBlur" ref="inp" />
    </template>
  </a-comment>
</template>

<script setup>
import { onMounted } from 'vue'
import { ref } from 'vue'

const props = defineProps({
  avatar: String,
  scope: Object
})

const inp = ref(null)

const emits = defineEmits(['cancel', 'relpy', 'r-blur'])

const replyContent = ref('')

onMounted(() => {
  inp.value.focus()
})

function cancle() {
  emits('cancel')
}

function commit() {
  emits('relpy', replyContent.value, props.scope)
}

function handlerBlur() {
  emits('r-blur')
}
</script>

<style scoped></style>
