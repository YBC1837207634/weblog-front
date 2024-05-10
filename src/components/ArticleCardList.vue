<template>
  <div class="layout">
    <a-list class="list-demo-action-layout" :bordered="false" :data="dataSource">
      <template #item="{ item }">
        <a-list-item
          class="list-demo-item"
          action-layout="vertical"
          :style="{ padding: '12px 10px', cursor: 'pointer', 'font-size': '12px' }"
          @click="clickHandler(item.id)"
        >
          <template #actions>
            <div>{{ item.author.nickname }}</div>
            <div><icon-eye />{{ item.viewCounts }}</div>
            <div><icon-message />{{ item.commentCounts }}</div>
            <div><icon-thumb-up />{{ item.likeCount }}</div>
            <div><icon-star />{{ item.collectCount }}</div>
          </template>
          <a-list-item-meta :title="item.title" :description="item.summary"> </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

defineProps({
  dataSource: Array
})

const router = useRouter()

function clickHandler(id) {
  // router.push({name: 'article', params: {id}})
  const url = router.resolve({
    name: 'article',
    params: { id }
  })
  window.open(url.href, '_blank')
}
</script>

<style scoped>
.layout {
  width: 100%;
}
</style>
