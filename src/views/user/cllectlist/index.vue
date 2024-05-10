<template>
  <div>
    <div class="tool-nav" v-if="$route.params.id === getUid() && userStore.id === getUid()">
      <a-input :style="{ width: '200px' }" placeholder="搜索" allow-clear>
        <template #prefix>
          <icon-search />
        </template>
      </a-input>
      <a-button @click="edit = !edit">{{ edit ? '取消编辑' : '编辑' }}</a-button>
      <a-button @click="addFavorites">新建收藏夹</a-button>
    </div>
    <div class="setting-collapse">
      <a-collapse accordion @change="collapseHandler" destroy-on-hide>
        <a-collapse-item
          v-for="favorites in favoritesList"
          :key="favorites.id"
          :style="customStyle"
        >
          <template #header>
            <div>
              {{ favorites.title }}
              <a-tag bordered>{{ favorites.common === 0 ? '私密' : '公开' }}</a-tag>
            </div>
          </template>
          <template #extra v-if="$route.params.id === getUid() && userStore.id === getUid()">
            <div>
              <a-trigger trigger="click" :unmount-on-close="false" @click.stop>
                <icon-more-vertical style="font-size: 15px" />
                <template #content>
                  <div class="demo-basic">
                    <a-doption @click.stop="checkoutFavorites(favorites)">修改收藏夹</a-doption>
                    <a-doption @click.stop="deleteFavoritesHandler(favorites.id)"
                      >删除收藏夹</a-doption
                    >
                  </div>
                </template>
              </a-trigger>
            </div>
          </template>
          <div style="text-align: center" v-if="loading">
            <a-spin :size="32" />
          </div>
          <div v-else>
            <ArticleList v-if="!edit" :dataSource="dataSource"></ArticleList>
            <EditArticleList
              v-else
              @del="removeHandler"
              :data-source="dataSource"
              :needEdit="false"
            >
            </EditArticleList>
          </div>
        </a-collapse-item>
      </a-collapse>
    </div>
    <div></div>
  </div>
  <!-- dialog -->
  <a-modal
    v-model:visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :ok-button-props="{
      disabled: currentFavoritesEdit.name === null || currentFavoritesEdit.name === ''
    }"
  >
    <template #title> 修改收藏夹 </template>
    <div class="dialog-form">
      <div>收藏夹名称</div>
      <a-input v-model="currentFavoritesEdit.name" placeholder="文件夹名称" allow-clear />
      <a-checkbox v-model="currentFavoritesEdit.common">公开</a-checkbox>
    </div>
  </a-modal>
  <!-- dialog -->
  <a-modal
    v-model:visible="addVisible"
    @ok="HandleAddOk"
    @cancel="addVisible = false"
    :ok-button-props="{
      disabled:
        favoritesForm.name === null || favoritesForm.name === undefined || favoritesForm.name === ''
    }"
  >
    <template #title> 新增收藏夹 </template>
    <div class="dialog-form">
      <div>收藏夹名称</div>
      <a-input v-model="favoritesForm.name" placeholder="文件夹名称" allow-clear />
      <a-checkbox v-model="favoritesForm.common">是否公开</a-checkbox>
    </div>
  </a-modal>
</template>

<script setup>
import {
  getItemList,
  getFavoritesList,
  updateFavorites,
  createFavorites,
  deleteFavorites,
  updateItem
} from '@/api/collect'
import { ref, onMounted } from 'vue'
import ArticleList from '@/components/ArticleList.vue'
import EditArticleList from '@/components/EditArticleList.vue'
import { Message } from '@arco-design/web-vue'
import { useUserStore } from '@/stores/user'
import { getUid } from '@/utils/auth'
import { useRoute } from 'vue-router'

const userStore = useUserStore()
const route = useRoute()

let visible = ref(false)
let addVisible = ref(false)
let dataSource = ref([])
let favoritesList = ref([])
let edit = ref(false)
let loading = ref(true)
let currentFavoritesEdit = ref({})
let favoritesForm = ref({})

let params = {
  pageNum: 1,
  pageSize: 20,
  sort: 'desc',
  sortField: 'createTime',
  affiliationId: ''
}
const customStyle = {
  borderRadius: '6px'
}

onMounted(() => {
  // 查询当前用户的收藏夹
  getList()
})

function getList() {
  if (route.params.id != undefined && route.params.id != null && route.params.id.length == 19) {
    getFavoritesList({ sort: 'desc', userId: route.params.id }).then((res) => {
      favoritesList.value = res.data
    })
  }
}

function getItems() {
  loading.value = true
  getItemList(params).then((res) => {
    dataSource.value = res.data.list
    loading.value = false
  })
}

function reset() {
  params = {
    pageNum: 1,
    pageSize: 20,
    sort: 'desc',
    sortField: 'createTime'
  }
}

function loadMore() {
  // if (scrollBottom === false) {
  //     scrollBottom = true
  //     getItemList(params).then(res => {
  //         if (res.data.records.length === 0) {
  //             scrollBottom = true
  //             bottom.value = true // 到达底部
  //             return
  //         }
  //         if (res.data.records.length < params.pageSize) {
  //             bottom.value = true // 到达底部
  //         }
  //         scrollBottom = false
  //         dataSource.value = dataSource.value.concat(res.data)
  //         params.pageNum += 1
  //     })
  // }
}

// 新建收藏夹
function addFavorites() {
  addVisible.value = true
  favoritesForm.value = {}
}

function handleOk() {
  updateFavorites({
    favoritesId: currentFavoritesEdit.value.favoritesId,
    name: currentFavoritesEdit.value.name,
    common: currentFavoritesEdit.value.common ? 1 : 0
  }).then((res) => {
    Message.success(res.msg)
    // 查询当前用户的收藏夹
    getList()
  })
  visible.value = false
}

function handleCancel() {
  visible.value = false
}

function HandleAddOk() {
  createFavorites({
    name: favoritesForm.value.name,
    common: favoritesForm.value.common ? 1 : 0
  }).then((res) => {
    Message.success(res.msg)
    getList()
  })

  visible.value = false
}

// 编辑收藏夹名称
function checkoutFavorites(favorites) {
  currentFavoritesEdit.value.favoritesId = favorites.id
  currentFavoritesEdit.value.name = favorites.title
  currentFavoritesEdit.value.common = favorites.common !== 0 ? true : false
  visible.value = true
}

// 批量取消收藏
function removeHandler(ids) {
  let a = []

  updateItem({
    act: '2',
    favoritesId: params.affiliationId,
    ids: a.concat(ids)
  }).then((res) => {
    getItems()
  })
}

// 删除收藏夹
function deleteFavoritesHandler(id) {
  deleteFavorites(id).then((res) => {
    Message.success(res.msg)
    getList()
  })
}

function collapseHandler(key) {
  if (key.length != 0) {
    loading.value = true
    params.affiliationId = key[0]
    getItems()
  }
}
</script>

<style scoped>
.arco-collapse-item-content.arco-collapse-item-content-expend {
  background-color: #fff !important;
}

.arco-collapse-item-content {
  background-color: #fff !important;
}

.arco-list-item {
  overflow: auto !important;
}

.tool-nav {
  display: flex;
  /* justify-content: flex-end; */
  padding: 5px 10px;
  text-align: right;
  /* border: 1px solid; */
  box-sizing: border-box;
  border-top: 1px solid #e5e9ef;
}

.tool-nav > * {
  margin-left: 10px;
}

.dialog-form > * {
  margin-bottom: 10px;
}

.demo-basic {
  padding: 5px;
  background-color: var(--color-bg-popup);
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
}
</style>
