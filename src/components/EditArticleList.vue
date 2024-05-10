<template>
  <div>
    <div class="btn">
      <a-popconfirm
        v-if="checked.length > 0"
        :content="`确认删除${checked.length}条数据`"
        type="warning"
        @ok="batchDelHandler"
      >
        <a-button type="primary" size="large" long
          ><template #icon> <icon-delete style="font-size: 14px" /> </template>确认删除：{{
            checked.length
          }}</a-button
        >
      </a-popconfirm>
    </div>
    <a-list class="list-demo-action-layout" :bordered="false" :data="dataSource">
      <template #item="{ item }">
        <a-list-item class="list-demo-item">
          <a-list-item-meta :title="item.title">
            <template #description>
              <div class="article-summary">
                {{ item.summary }}
              </div>
            </template>
            <template #avatar>
              <a-checkbox @change="select(item.id)"></a-checkbox>
            </template>
          </a-list-item-meta>
          <template #actions>
            <icon-edit
              v-if="needEdit"
              @click="$emit('editArticle', item.id)"
              style="font-size: 18px"
            />
            <a-popconfirm content="确认删除？" type="warning" @ok="okHandler(item.id)">
              <icon-delete style="font-size: 18px" />
            </a-popconfirm>
            <icon-expand style="font-size: 18px" @click="lookArticle(item)" />
          </template>
        </a-list-item>
      </template>
    </a-list>

    <!-- 抽屉 -->
    <a-drawer
      :height="500"
      :visible="drawerVisible"
      :placement="'bottom'"
      @cancel="drawerVisible = false"
      :footer="false"
      unmountOnClose
    >
      <div class="drawer-item">
        <div class="title">
          <a-card title="文章信息">
            <a-list :bordered="false" :split="false">
              <a-list-item>
                <span style="color: palevioletred">标题：{{ currentArticle.title }}</span>
              </a-list-item>
              <a-list-item>
                <span>类别：{{ currentArticle.category }}</span>
              </a-list-item>
              <a-list-item>
                <span>标签：</span>
                <a-tag
                  style="margin-right: 5px"
                  color="arcoblue"
                  v-for="tag in currentArticle.tags"
                  :key="tag.id"
                  >{{ tag.tagName }}</a-tag
                >
              </a-list-item>
            </a-list>
          </a-card>
        </div>
        <div class="title">
          <a-card>
            <div class="author-info-box" v-if="currentArticle.author">
              <div class="author">{{ currentArticle.author.nickname }}</div>
              <div class="category">类别：{{ currentArticle.category }}</div>
              <div class="time">{{ currentArticle.createTime }}</div>
              <div class="lookCount"><icon-eye />{{ currentArticle.viewCounts }}</div>
            </div>
          </a-card>
        </div>
        <div class="title">
          <a-card title="概要">
            <a-list :bordered="false" :split="false">
              <a-list-item>
                <div class="drawer-item-category">
                  <span style="word-wrap: break-word">类别：{{ currentArticle.summary }}</span>
                </div>
              </a-list-item>
            </a-list>
          </a-card>
        </div>
        <div class="title">
          <a-card title="封面">
            <a-image
              v-if="currentArticle.img != null && currentArticle.img != ''"
              width="320"
              :src="setting.baseUrl + currentArticle.img"
            />
            <a-image v-else width="320" height="320" alt="没有设置封面" src="some-error.png" />
          </a-card>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script setup>
import setting from '@/config/setting'
import { reactive } from 'vue'
import { ref } from 'vue'

const props = defineProps({
  dataSource: Array,
  needEdit: {
    type: Boolean,
    default: true
  }
})

const emits = defineEmits(['del', 'editArticle'])

let drawerVisible = ref(false)
let currentArticle = ref({})

let checked = reactive([])

function lookArticle(article) {
  currentArticle.value = article
  drawerVisible.value = true
}

function select(id) {
  if (checked.indexOf(id) != -1) {
    checked.splice(checked.indexOf(id), 1)
  } else {
    checked.push(id)
  }
}

function okHandler(ids) {
  emits('del', ids)
}

function batchDelHandler() {
  emits('del', checked)
  checked.splice(0, checked.length)
}
</script>

<style scoped>
/* .list-demo-action-layout {
    width: 100% !important;
} */

.btn {
  /* padding: 10px 0; */
  box-shadow: 2px 0 6px rgb(0 21 41 / 35%);
}

.list-demo-item:hover {
  cursor: pointer;
  background: #f7f8f9;
}

.arco-list-item {
  overflow: auto;
}

.drawer-item > div {
  margin-bottom: 20px;
}

.article-summary {
  /* overflow: hidden;
    width: 154px; */
  overflow-wrap: break-word;
}
.author-info-box {
  height: 24px;
  font-size: 12px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding: 10px 0;
}
.author-info-box > * {
  margin-left: 24px;
}

.author-info-box > :first-child {
  margin-left: 10px;
}

.author-info-box > .author {
  font-weight: bolder;
}
.author-info-box > .info {
  display: none;
}
.drawer-item-category {
  width: 100%;
}
@media (max-width: 768px) {
  .drawer-item-category {
    width: 280px;
  }
}
</style>
