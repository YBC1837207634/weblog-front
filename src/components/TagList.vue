<template>
  <div class="list">
    <a-tag
      :style="{ 'margin-right': '10px', cursor: 'pointer', 'margin-bottom': '10px' }"
      v-for="tag in dataSoure"
      :key="tag.id"
      @click="clickHandler(tag)"
    >
      <span>{{ tag.tagName }}</span>
      <span v-if="showNum">{{ tag.articleCount === 0 ? '' : '(' + tag.articleCount + ')' }}</span>
    </a-tag>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

defineProps({
  dataSoure: Array,
  showNum: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()

function clickHandler({ id, tagName }) {
  // router.push({name: 'tag', query: })
  const url = router.resolve({
    name: 'tag',
    query: { tName: tagName, tId: id }
  })

  window.open(url.href, '_blank')
}
</script>

<style scoped></style>
