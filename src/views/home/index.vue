<template>
    <div class="article-view">
        <!-- 内容 -->
        <div class="article-view-info" v-infinite-scroll="loadMore">
            <a-tabs default-active-key="createTime" class="tabs" :size="'large'" @tab-click="tagClickHandler" hide-content :type="'card-gutter'" :destroy-on-hide="true">
                <a-tab-pane key="createTime" title="最新" />
                <a-tab-pane key="viewCounts" title="推荐" />
                <a-tab-pane v-for="tag in category" :key="tag.id" :title="tag.tagName" />
            </a-tabs>
            <div class="article-list">
                <ArticleList :data-source="dataSource"></ArticleList>
                <div v-if="bottom" style="text-align: center; padding: 10px;">到达底部</div>
            </div>
        </div>
        <!-- 右侧导航 -->
        <div class="article-view-aside">
            <div class="item">
                <a-card title="用户排行" hoverable :bordered="false">
                    <template #extra>
                        <a-link>更多</a-link>
                    </template>
                    <ul class="title-list">
                        <!-- <ol v-for="data in dataList" :key="data.id">{{ data.title }}</ol> -->
                    </ul>
                </a-card>
            </div>
            <div class="item">
                <a-card :title="'最多收藏'" hoverable :bordered="false">
                    <template #extra>
                        <a-link>更多</a-link>
                    </template>
                    <ul class="title-list">
                        <!-- <ol v-for="data in dataList" :key="data.id">{{ data.title }}</ol> -->
                    </ul>
                </a-card>
            </div>
        </div>

    </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { page } from '@/api/article';
import { getCategory } from '@/api/tag'
import ArticleList from '@/components/ArticleList.vue'
import { getToken } from '@/utils/auth';



let dataSource = ref([])
let bottom = ref(false)
let category = ref([])


let canSlide = true
let scrollBottom = false

let params = {
    pageNum: 1,
    pageSize: 10 ,
    sort: 'desc',
    sortField: 'createTime'
}

onBeforeMount(() => {
    getCategory({sortField: 'sortNum',  pageSize: 20}).then(res => {
        category.value = res.data.records
    })
})

function tagClickHandler(k) {
    bottom.value = false
    dataSource.value = []
    params.pageNum = 1
    params.sortField = k
    params.tags = null
    scrollBottom = false
    if (k !== 'createTime' && k !== 'viewCounts') {
        params.tags = encodeURI([k])
        params.sortField = 'createTime'
    }
    page(params).then(res => {
        dataSource.value = res.data.records
    })
    params.pageNum += 1
}

function loadMore () {
    if (scrollBottom === false && canSlide) {
        scrollBottom = true
        page(params).then(res => {
            if (res.data.records.length === 0) {
                scrollBottom = true
                bottom.value = true // 到达底部
                return 
            }
            scrollBottom = false
            dataSource.value = dataSource.value.concat(res.data.records)
            params.pageNum += 1
            if (!getToken()) {
                canSlide = false
            }
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
    max-width: 850px;
    width: 850px;
    background-color: #fff;
}

.arco-tabs-nav-tab {
 width: 100% !important;
}


.article-view-aside {
    height: 100%;
    width: 320px;
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