<template>
  <div class="article-entry-item" v-for="item in dataSource" :key="item.id">
    <div class="article-entry-item-main">
      <div class="header">
        <div class="avatar">
          <a-avatar
            :size="20"
            v-if="
              item.author.avatar != null &&
              item.author.avatar != undefined &&
              item.author.avatar != ''
            "
          >
            <a-image
              :src="setting.baseUrl + item.author.avatar"
              width="500"
              height="500"
              style="border-radius: 50%"
            />
          </a-avatar>
          <a-avatar :size="20" v-else> U </a-avatar>
          <p>{{ item.author.nickname }}</p>
        </div>
        <p style="color: #888">发表于 {{ item.createTime }}</p>
      </div>
      <div class="body" @click="clickHandler(item.id)">
        <div class="title">
          {{ item.title }}
          <!-- <span v-if="item.title.length >= 30">...</span> -->
        </div>
        <div class="info">
          <div class="img" v-if="item.img != null && item.img && item.img != ''">
            <img :src="setting.baseUrl + item.img" alt="图片" />
          </div>
          <template v-if="item.img != null && item.img && item.img != ''">
            <div class="text">
              <p>{{ item.summary }}</p>
            </div>
            <div class="text-pe">
              <p>
                {{ item.summary
                }}<span style="font-weight: 600" v-if="item.summary.length >= 130"
                  >...展开更多</span
                >
              </p>
            </div>
            <div velse></div>
          </template>
          <template v-else>
            <div class="text-pp">
              <p>{{ item.summary.substring(0, 254) }}</p>
            </div>
          </template>
        </div>
      </div>
      <div class="action">
        <div class="light-btn"><icon-eye />浏览量 {{ item.viewCounts }}</div>
        <div><icon-message />评论 {{ item.commentCounts }}</div>
        <div><icon-thumb-up-fill /> {{ item.likeCount }}</div>
        <div><icon-star-fill />收藏 {{ item.collectCount }}</div>
        <div class="tags"><TagList :data-soure="item.tags" /></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import setting from '@/config/setting'
import { useRouter } from 'vue-router'
import TagList from './TagList.vue'

const router = useRouter()
const props = defineProps({
  dataSource: Array,
  author: {
    type: Boolean,
    default: true
  }
})

function clickHandler(id) {
  // window.open('/article/' + id, '_blank')
  router.push({ name: 'article', params: { id } })
}
</script>

<style scoped>
.article-entry-item {
  width: 800px;
  height: 245px;
  padding: 0 20px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 5px;
  -webkit-box-shadow: 0 2px 4px 0 rgb(0 0 0 / 5%);
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 5%);
  margin-top: 10px;
}

.article-entry-item {
}

.article-entry-item-main {
  width: 100%;
  height: 100%;
  padding: 20px 0;
  box-sizing: border-box;
}

.header {
  height: 20px;
  max-height: 20px;
  font-size: 13px;
  display: flex;
  margin-bottom: 10px;
  justify-items: center;
}

.header > .avatar {
  display: flex;
}
.header > .avatar > p {
  margin-left: 5px;
}

.header > * {
  margin-right: 10px;
}

.body {
  height: 125px;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 12px;
  cursor: pointer;
}

.body > .title {
  font-size: 18px;
  font-weight: 500;
  word-wrap: break-word; /* 超出父元素的部分自动换行 */
}

.body > .info {
  display: flex;
  height: 95px;
  margin-top: 8px;
  word-wrap: break-word; /* 超出父元素的部分自动换行 */
  align-items: center;
}

.body > .info > .text {
  font-size: 14px;
  width: 100%;
  margin-left: 16px;
}

.action {
  height: 32px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #999;
}

.action > div {
  margin-left: 16px;
  cursor: pointer;
}
.action > :first-child {
  margin-left: 0px;
}

.action > .light-btn {
  min-width: 84px;
  height: 32px;
  display: block;
  padding: 6px 12px;
  border-radius: 3px;
  background: rgba(33, 179, 81, 0.1);
  -webkit-transition: background 0.2s ease;
  transition: background 0.2s ease;
  color: #21b351;
  box-sizing: border-box;
}

.text-pp {
  overflow: auto;
  width: 100%;
  height: 100%;
}

.tags {
  position: relative;
  top: 5px;
}

img {
  object-fit: cover;
  width: 160px;
  height: 90px;
}

.body > .info > .text-pe {
  display: none;
  overflow: auto;
}

@media (max-width: 768px) {
  .article-entry-item {
    width: 100vw;
    height: 250px;
    min-height: 250px;
    padding: 0 10px;
    margin-bottom: 10px;
  }
  .article-entry-item-main {
    padding: 8px 0;
    padding-top: 16px;
    box-sizing: border-box;
  }
  .body {
    height: 165px;
    min-height: 165px;
    max-height: 165px;
    margin-bottom: 0;
  }

  .tags {
    display: none;
  }
  .body > .info {
    display: flex;
    height: 128px;
    word-wrap: break-word; /* 超出父元素的部分自动换行 */
    max-height: 128px;
    margin-top: 8px;
    align-items: center;
  }

  img {
    width: 120px;
    height: 108px;
  }

  .body > .info > .text {
    display: none;
  }
  .body > .info > .text-pe {
    display: block;
    /* width: calc(100% - 80px); */
    width: 100%;
    height: 100%;
    margin-left: 8px;
    overflow: auto;
  }
}
</style>
