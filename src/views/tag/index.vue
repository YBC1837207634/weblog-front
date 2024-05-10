<template>
  <div class="main">
    <div class="title">
      <h1>{{ $route.query.tName }}</h1>
      <div>共 {{ total }} 篇文章, 当前显示 {{ dataSource.length }} 篇文章</div>
    </div>
    <div class="info" v-infinite-scroll="loadMore">
      <ArticleListPlus :data-source="dataSource" />
      <div v-if="scrollBottom && dataSource.length != 0" style="text-align: center; padding: 10px">
        已经到达底部~~
      </div>
    </div>
  </div>
</template>

<script setup>
import ArticleListPlus from '@/components/ArticleListPlus.vue'
import { onMounted, ref } from 'vue'
import { page } from '@/api/article'
import { useRoute } from 'vue-router'

var dataSource = ref([])
var total = ref(1)
var scrollBottom = ref(false)

const route = useRoute()

let params = {
  pageNum: 1,
  pageSize: 10,
  tags: route.query.tId,
  sortField: 'updateTime'
}

onMounted(() => {
  // reset()
  document.title = route.query.tName
})

// 加载更多
function loadMore() {
  if (dataSource.value.length < total.value && scrollBottom.value != true) {
    scrollBottom.value = true
    page(params).then((res) => {
      total.value = res.data.total
      dataSource.value = dataSource.value.concat(res.data.records)
      params.pageNum += 1
      scrollBottom.value = false
    })
  } else {
    scrollBottom.value = true
  }
}
</script>

<style scoped>
.main {
  height: 100%;
  width: 800px;
  margin: 0 auto;
}

.title {
  margin: 0 auto;
  height: 150px;
  text-align: center;
  color: #666;
  padding: 4rem 0;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .main {
    width: 100vw;
  }
  .title {
    width: 100vw;
    margin: 0 0;
  }
}
</style>
