<template>
  <div class="article-view">
    <!-- 内容 -->
    <div class="article-view-info" v-infinite-scroll="loadMore">
      <div style="background-color: #fff">
        <a-tabs
          default-active-key="createTime"
          class="tabs"
          :size="'large'"
          @tab-click="tagClickHandler"
          hide-content
          :type="'line'"
          :destroy-on-hide="true"
        >
          <a-tab-pane key="createTime" title="最新" />
          <a-tab-pane key="viewCounts" title="推荐" />
          <a-tab-pane v-for="tag in category" :key="tag.id" :title="tag.tagName" />
        </a-tabs>
      </div>
      <div class="article-list" v-if="!loading">
        <!-- <ArticleList :data-source="dataSource"></ArticleList> -->
        <ArticlePlus :data-source="dataSource"></ArticlePlus>
        <div v-if="bottom" style="text-align: center; padding: 10px">到达底部</div>
      </div>
      <div class="loading" v-else>
        <a-spin :size="32" />
      </div>
      <div
        class="empty"
        v-if="
          (dataSource == null || dataSource.length === 0 || dataSource === undefined) && !loading
        "
      >
        <a-empty />
      </div>
    </div>
    <!-- 右侧导航 -->
    <div class="article-view-aside">
      <div class="item">
        <a-card title="文章推荐" hoverable :bordered="false">
          <ArticleCardList :data-source="articleRankList" />
        </a-card>
      </div>
      <div class="item">
        <!-- <a-card title="热门标签" hoverable :bordered="false">
          <TagList :data-soure="tagList" :show-num="true" />
        </a-card> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue'
import { page } from '@/api/article'
import { getCategory, getHostTagList } from '@/api/tag'
import ArticlePlus from '@/components/ArticleListPlus.vue'
import ArticleCardList from '@/components/ArticleCardList.vue'
import { articleRank } from '@/api/reveal'
import TagList from '@/components/TagList.vue'

let dataSource = ref([])
let bottom = ref(false)
let category = ref([])
let articleRankList = ref([])
let tagList = ref([])
let loading = ref(false)

// let canSlide = true
let scrollBottom = false

let params = {
  pageNum: 1,
  pageSize: 10,
  sort: 'desc',
  sortField: 'createTime'
}

onBeforeMount(() => {
  getCategory({ sortField: 'sortNum', pageSize: 20 }).then((res) => {
    category.value = res.data.records
  })
  articleRank().then((res) => (articleRankList.value = res.data))
  getHostTagList().then((res) => (tagList.value = res.data))
})

function tagClickHandler(k) {
  loading.value = true
  bottom.value = false
  dataSource.value = []
  params.pageNum = 1
  params.sortField = k
  params.categoryId = null
  scrollBottom = false
  if (k !== 'createTime' && k !== 'viewCounts') {
    params.categoryId = encodeURI([k])
    params.sortField = 'createTime'
  }
  page(params).then((res) => {
    dataSource.value = res.data.records
    loading.value = false
  })
  params.pageNum += 1
}

function loadMore() {
  if (scrollBottom === false) {
    scrollBottom = true
    page(params).then((res) => {
      if (res.data.records.length === 0) {
        scrollBottom = true
        bottom.value = true // 到达底部
        return
      }
      scrollBottom = false
      dataSource.value = dataSource.value.concat(res.data.records)
      params.pageNum += 1
      // if (!getToken()) {
      //   canSlide = false
      // }
    })
  }
}
</script>

<style scoped>
.article-view {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 1200px;
  margin: 0 auto;
  height: 100%;
}
.article-view-info {
  max-width: 800px;
  width: 800px;
}

.arco-tabs-nav-tab {
  width: 100% !important;
}

.article-view-aside {
  height: 100%;
  width: 360px;
}

/* 卡片 */
.item {
  margin-bottom: 20px;
  text-align: left;
}
.title-list > ol {
  padding: 8px 0px;
}
.title-list > ol:hover {
  background: #f7f8f9;
  cursor: pointer;
}

.loading {
  display: flex;
  justify-content: center;
  align-content: center;
  margin-top: 30px;
}

@media (max-width: 768px) {
  .article-view {
    width: 100vw;
  }
  .article-view-info {
    width: 100%;
  }
  .article-view-aside {
    display: none;
  }
}
</style>
