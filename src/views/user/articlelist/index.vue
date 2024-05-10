<template>
  <div v-infinite-scroll="loadMore">
    <div class="setting-collapse" v-if="$route.params.id === getUid() && userStore.id === getUid()">
      <a-collapse accordion>
        <a-collapse-item header="文章设置" key="1">
          <div>编辑模式：<a-switch v-model="edit" /></div>
        </a-collapse-item>
      </a-collapse>
    </div>
    <div>
      <ArticleList v-if="!edit" :author="false" :dataSource="dataSource"></ArticleList>
      <EditArticleList
        v-else
        @del="removeHandler"
        @editArticle="editHandler"
        :dataSource="dataSource"
      ></EditArticleList>
    </div>
    <div
      v-if="bottom && dataSource.length > 0"
      style="text-align: center; padding: 10px; border-top: 1px solid rgba(0, 0, 0, 0.06)"
    >
      到达底部
    </div>
  </div>
</template>

<script setup>
import { page, removeArticle } from '@/api/article'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ArticleList from '@/components/ArticleList.vue'
import EditArticleList from '@/components/EditArticleList.vue'
import { Message } from '@arco-design/web-vue'
import { useRouter } from 'vue-router'
import { getUid } from '@/utils/auth'
import { useUserStore } from '@/stores/user'

defineOptions({
  name: 'ArticleList'
})

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

let dataSource = ref([])
let bottom = ref(false)
let edit = ref(false)

let scrollBottom = false
let params = {
  pageNum: 1,
  pageSize: 10,
  sort: 'desc',
  sortField: 'createTime',
  authorId: route.params.id
}

function reset() {
  params = {
    pageNum: 1,
    pageSize: 10,
    sort: 'desc',
    sortField: 'createTime',
    authorId: route.params.id
  }
}

// 解决组件复用组件不刷新
watch(
  () => route.params,
  (toParams, previousParams) => {
    // 对路由变化做出响应...
    // console.log(toParams.id, previousParams);
    if (
      toParams.id !== previousParams.id &&
      toParams.id != undefined &&
      route.path.startsWith('/user/')
    ) {
      reset()
      page(params).then((res) => {
        dataSource.value = res.data.records
      })
    }
  }
)

function loadMore() {
  if (scrollBottom === false) {
    scrollBottom = true
    page(params).then((res) => {
      if (res.data.records.length === 0) {
        scrollBottom = true
        bottom.value = true // 到达底部
        return
      }
      if (res.data.records.length < params.pageSize) {
        bottom.value = true // 到达底部
      }
      scrollBottom = false
      dataSource.value = dataSource.value.concat(res.data.records)
      params.pageNum += 1
    })
  }
}

function removeHandler(ids) {
  removeArticle(ids)
    .then((res) => {
      reset()
      bottom.value = false
      scrollBottom = false
      edit.value = false
      page(params).then((res) => {
        dataSource.value = res.data.records
      })
      Message.success(res.msg)
    })
    .catch((e) => console.error(e))
}

function editHandler(id) {
  router.push({ name: 'editArt', params: { id } })
}
</script>

<style scoped>
.setting-collapse {
  margin-top: 10px;
}
@media (max-width: 768px) {
}
</style>
