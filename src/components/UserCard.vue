<template>
  <div class="user-info-container">
    <div class="bg" :style="{ 'background-image': `url(${background})` }"></div>
    <div class="user-info">
      <div class="avatar">
        <a-avatar
          :size="48"
          @click="$router.push({ name: 'userDefault', params: { id: userInfo.id } })"
        >
          <img
            alt="avatar"
            style="cursor: pointer"
            :src="setting.baseUrl + userInfo.avatar"
            v-if="userInfo.avatar != null && userInfo.avatar != ''"
          />
          <span v-else>U</span>
        </a-avatar>
      </div>
      <div class="main">
        <div class="title">
          <span class="nickname">{{ userInfo.nickname }}</span>
          <a-tag
            style="margin-top: 8px"
            v-if="userInfo.role.ident === 'admin'"
            :color="'magenta'"
            bordered
            >{{ userInfo.role.roleName }}</a-tag
          >
          <a-tag style="margin-top: 8px" v-else>{{ userInfo.role.roleName }}</a-tag>
        </div>
        <div class="info">
          <div><span>文章数</span>{{ userInfo.articleCount }}</div>
          <div><span>粉丝</span>{{ userInfo.fansCount }}</div>
          <div><span>关注</span>{{ userInfo.followCount }}</div>
        </div>
        <div class="blurb">
          {{ userInfo.description }}
        </div>
        <div class="btn" v-if="userInfo.id !== getUid()">
          <a-button shape="round" type="primary" @click="relationHandler(userInfo.id)">{{
            relationOk ? '取消关注' : '关注'
          }}</a-button>
          <a-button shape="round" @click="sendMsg">发消息</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import setting from '@/config/setting'
import { relation, query } from '@/api/relation'
import { Message } from '@arco-design/web-vue'
import { getUid, getToken } from '@/utils/auth'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  userInfo: Object,
  title: String
})

const router = useRouter()
const userStore = useUserStore()

const background = computed(() => {
  return props.userInfo.background != null &&
    props.userInfo.background &&
    props.userInfo.background != ''
    ? setting.baseUrl + props.userInfo.background
    : setting.failImg
})

let relationOk = ref(false)

onMounted(() => {
  if (getUid() !== props.userInfo.id) {
    // 检查是否关注
    query({ id: props.userInfo.id })
      .then((res) => {
        if (res.msg === 'ok') relationOk.value = true
      })
      .catch((e) => e)
  }
})

function relationHandler(id) {
  if (getToken() === userStore.token) {
      relation({ goalId: id, act: relationOk.value ? 0 : 1 }).then((res) => {
      Message.success(res.msg)
      props.userInfo.fansCount += relationOk.value ? -1 : 1
      relationOk.value = !relationOk.value
    })
  } else {
    router.push({ name: 'login', params: location.href })
  }
}

function sendMsg() {
  // console.log(props.userInfo.id);
  router.push({ name: 'whisper', params: { id: props.userInfo.id } })
}
</script>

<style scoped>
.user-info-container {
  width: 320px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 4px 0 rgb(50 50 50 / 4%);
  /* cursor: default; */
  /* box-shadow: 0px 0px 30px rgb(0 0 0 / 10%);
    border: 0.5px solid #F1F2F3;
    border: 0.5px solid var(--line_light); */

  /* transition: left 0.3s, top 0.3s; */
  box-sizing: border-box;
}

.bg {
  height: 100px;
  background-size: cover;
  border-radius: 8px 8px 0 0;
}
.user-info {
  display: flex;
}

.main {
  margin-left: 10px;
}
.main > .title {
  margin-bottom: 10px;
  display: flex;
  align-items: baseline;
}

.main > .title > .nickname {
  font-weight: 800;
}

.main > .title > * {
  margin-right: 10px;
}

.main > .info span {
  /* margin-right: 10px; */
  color: #9494a0;
}

.main > .info > div {
  margin-right: 15px;
}

.main > .info {
  font-size: 12px;
  display: flex;
}

.user-info {
  padding: 10px;
}
.user-info > .title {
  text-align: center;
}

.user-info > .info {
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
}

.main > .blurb {
  font-size: 12px;
  color: #9494a0;
  margin: 10px 0;
}

.user-info .btn {
  margin: 10px 0;
}

.user-info .btn > * {
  margin-right: 20px;
}

@media (max-width: 768px) {
  .user-info-container {
    width: 80vw;
  }
}
</style>
