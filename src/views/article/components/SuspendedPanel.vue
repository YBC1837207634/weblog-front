<template>
  <div class="panel-container">
    <a-badge
      :count="Number(articleInfo.likeCount)"
      :dotStyle="{ background: '#E5E6EB', color: '#86909C', 'box-shadow': '0 0 0 0' }"
    >
      <div class="like-btn" @click="likeHandler">
        <icon-thumb-up v-if="!liked" />
        <icon-thumb-up-fill :style="{ color: '#00AEEC' }" v-else />
      </div>
    </a-badge>

    <a-badge
      :count="Number(articleInfo.collectCount)"
      :dotStyle="{ background: '#E5E6EB', color: '#86909C', 'box-shadow': '0 0 0 0' }"
    >
      <div class="collect-btn" @click="clickCollect">
        <icon-star v-if="!isCollect" />
        <icon-star-fill :style="{ color: '#00AEEC' }" v-else />
      </div>
    </a-badge>

    <a-badge
      :count="Number(articleInfo.commentCounts)"
      :dotStyle="{ background: '#E5E6EB', color: '#86909C', 'box-shadow': '0 0 0 0' }"
    >
      <div class="message-btn">
        <icon-message />
      </div>
    </a-badge>

    <div class="btn">
      <icon-launch />
    </div>
    <div class="btn">
      <icon-more />
    </div>
  </div>
  <!-- dialog -->
  <div class="collect-dialog">
    <a-modal
      v-model:visible="collectDialogvisible"
      @ok="collectOkHandler"
      @cancel="collectCancelHandler"
      :ok-button-props="{ disabled: checked.length === 0 }"
    >
      <template #title>
        <div style="text-align: center">
          <h4>{{ isCollect ? '取消收藏' : '选择收藏夹' }}</h4>
          <div style="font-size: 12px; padding-top: 2px">
            {{ isCollect ? '选取需要取消收藏的收藏夹' : '选择你的收藏集' }}
          </div>
        </div>
      </template>
      <div class="collect-dialog-item" v-for="favorites in favoritesList" :key="favorites.id">
        <a-checkbox
          :default-checked="memoryChecked.includes(favorites.id) ? true : false"
          @change="clickItem(favorites.id)"
          :key="favorites.id"
        >
          <div class="title">
            {{ favorites.title }}
            <a-tag bordered>{{ favorites.common === 0 ? '私密' : '公开' }}</a-tag>
          </div>
          <div class="description">共收藏{{ favorites.total }} 篇文章</div>
        </a-checkbox>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { queryFavorites, getFavoritesList, updateItem } from '@/api/collect'
import { like, isLike } from '@/api/article_like'
import { Message } from '@arco-design/web-vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import router from '@/router'
import { getToken } from '@/utils/auth'

const props = defineProps({
  articleInfo: Object
})

const userStore = useUserStore()
const route = useRoute()

let collectDialogvisible = ref(false)
let favoritesList = ref([])
let isCollect = ref(false)
let memoryChecked = ref([])
let liked = ref(false)
// 复选框选择
let checked = ref([])

// 点赞
function likeHandler() {
  if (getToken() === userStore.token) {
    let form = {
      goalId: props.articleInfo.id,
      act: liked.value ? 2 : 1
    }
    like(form).then(({ msg }) => {
      // Message.success(msg)
      liked.value = !liked.value
      props.articleInfo.likeCount += liked.value ? 1 : -1
    })
  } else {
    router.push({ name: 'login', params: location.href })
  }
  
}

function getList() {
  getFavoritesList({ sort: 'desc' }).then((res) => {
    favoritesList.value = res.data
    // 查询是否收藏该文章
    queryFavorites({ articleId: route.params.id }).then((res) => {
      if (res.data.length > 0) {
        isCollect.value = true
        // 获取收藏该文章的收藏夹id
        memoryChecked.value = res.data
        favoritesList.value = favoritesList.value.filter((item) =>
          memoryChecked.value.includes(item.id)
        )
      }
    })
  })
}

onMounted(() => {
  // 查询是否收藏该文章
  queryFavorites({ articleId: route.params.id }).then((res) => {
    if (res.data.length > 0) {
      isCollect.value = true
      // 获取收藏该文章的收藏夹id
      memoryChecked.value = res.data
    }
  })
  isLike(route.params.id).then((res) => {
    if (res.msg === 'ok') {
      liked.value = true
    }
  })
})

// 收藏事件
function clickCollect() {
  if (getToken() === userStore.token) {
    collectDialogvisible.value = true
    getList()
  } else {
    router.push({ name: 'login', params: location.href })
  }
}

function collectOkHandler() {
  updateItem({
    act: isCollect.value ? '2' : '1',
    favoritesIds: checked.value,
    itemId: route.params.id
  }).then((res) => {
    if (isCollect.value) {
      if (checked.value.length === memoryChecked.value.length) isCollect.value = false

      Message.success('取消收藏成功')
      props.articleInfo.collectCount += -1
    } else {
      isCollect.value = true
      props.articleInfo.collectCount += 1
      Message.success('收藏成功')
    }
  })
  checked.value = []
  memoryChecked.value = []
  collectDialogvisible.value = false
}

function collectCancelHandler() {
  checked.value = []
  // memoryChecked.value = []
  favoritesList.value = []
  collectDialogvisible.value = false
}

// 选中收藏项
function clickItem(id) {
  if (checked.value.indexOf(id) != -1) {
    checked.value.splice(checked.value.indexOf(id), 1)
  } else {
    checked.value.push(id)
  }
}
</script>

<style scoped>
.panel-container {
  width: 48px;
  height: auto;
  position: fixed;
  top: 140px;
  margin-left: -120px;
}

.panel-container > div,
.panel-container .like-btn,
.panel-container .collect-btn,
.panel-container .message-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  text-align: center;
  line-height: 48px;
  box-sizing: border-box;
  background-color: #fff;
  margin-bottom: 20px;
  background-position: 50%;
  background-repeat: no-repeat;
  box-shadow: 0 4px 4px 0 rgb(50 50 50 / 4%);
  cursor: pointer;
  font-size: 20px;
}

.panel-container > div:hover {
  color: #165dff;
}

.collect-dialog-item {
  height: 60px;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 10px;
  /* border: #165DFF 1px solid; */
  border-radius: 8px;
  cursor: pointer;
}

.title {
  font-size: 16px;
}

.description {
  color: #8a919f;
}

.collect-dialog-item:hover {
  border-color: rgb(var(--primary-6));
  background-color: var(--color-primary-light-1);
  color: rgb(var(--primary-6));
  /* background-color: rgb(var(--primary-6)); */
}

.collect-dialog-item-checked {
  border-color: rgb(var(--primary-6));
  background-color: var(--color-primary-light-1);
  color: rgb(var(--primary-6));
  /* background-color: rgb(var(--primary-6)); */
}

@media (max-width: 768px) {
  .panel-container {
    /* width: 48px; */
    width: 100%;
    height: auto;
    position: relative;
    top: 10px;
    margin-left: 0;
    display: flex;
    justify-content: space-between;
  }
  .panel-container > div {
    background-color: #f7f8f9;
    margin-bottom: 0px;
    box-shadow: 0 0px 0px 0 rgb(50 50 50 / 4%);
  }
}
</style>
