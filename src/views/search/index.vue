<template>
  <div class="search-container">
    <div class="search-info">
      共查询到 {{ total }} 条数据,当前显示 {{ dataSource.length }} 条数据
    </div>
    <div class="search-result" v-infinite-scroll="loadMore">
      <ArticleListPlus :data-source="dataSource" />
      <div v-if="scrollBottom && dataSource.length != 0" style="text-align: center; padding: 10px">
        已经到达底部~~
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { searchArticle } from '@/api/article'
import ArticleListPlus from '@/components/ArticleListPlus.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
var dataSource = ref([])
var total = ref(1)
var scrollBottom = ref(false)

var params = {
  pageNum: 1,
  pageSize: 10,
  keyword: route.query.keyword
}

// 单个 ref
watch(
  () => route.query.keyword,
  () => {
    reset()
    getList()
  }
)

var reset = () => {
  scrollBottom.value = false
  total.value = 1
  params = {
    pageNum: 1,
    pageSize: 10,
    keyword: route.query.keyword
  }
  dataSource.value = []
}
// onMounted(() => {
//     // console.log(params);
//     getList()
// })

function getList() {
  // searchArticle(params).then(res=> {
  //     dataSource.value = res.data.records
  //     total.value = res.data.total
  //     // console.log(dataSource.value);
  // })
  loadMore()
}

// 加载更多
function loadMore() {
  if (dataSource.value.length < total.value) {
    searchArticle(params).then((res) => {
      total.value = res.data.total
      dataSource.value = dataSource.value.concat(res.data.records)
      params.pageNum += 1
    })
  } else {
    scrollBottom.value = true
  }
}
</script>

<style scoped>
.search-container {
  height: 100%;
  width: 800px;
  margin: 0 auto;
}

.search-info {
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  font-weight: 800;
}

.search-result {
  background-color: #fff;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .search-container {
    width: 100vw;
  }
}
</style>
