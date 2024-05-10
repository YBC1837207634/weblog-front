<template>
  <div class="whisper">
    <div class="whisper-left">
      <div class="title">近期消息</div>
      <div class="seesion-list" v-infinite-scroll="loadMore">
        <SessionList
          @removeSession="removeSeesionHandler"
          @clickItem="clickItemHandler"
          :sessionList="sessionList"
          :default-select="currentSessionId"
        />
      </div>
    </div>
    <div class="whisper-right">
      <div class="message-view" v-if="$route.params?.id !== undefined">
        <div class="title">
          <span>正在和 {{ userMap[currentSessionId]?.nickname }} 聊天</span>
          <span style="font-size: 18px; position: absolute; right: 10px;">
            <icon-more-vertical @click="visible = true" />
          </span>
        </div>
        <div class="whisper-main-container">
          <MessageView
            ref="messageViewRef"
            :end="messageEnd"
            :messageList="messageMap[currentSessionId]"
            :currentUser="userStore.getUser"
            :TagUser="userMap[currentSessionId]"
            @scroll-top="handleScroll"
          />
        </div>
        <div class="edit">
          <div class="edit-title">
            <icon-image :size="24" />
            <icon-face-smile-fill :size="24" />
          </div>
          <div class="edit-input">
            <textarea
              class="msg-textarea"
              v-model="text"
              :maxlength="MAXCOUNT"
              placeholder="回复一下吧~"
              @keyup.enter="sendMsg"
            ></textarea>
            <div class="edit-foot">
              <span> {{ textLenght }}/{{ MAXCOUNT }} </span>
              <button  @click="sendMsg">发送</button>
            </div>
          </div>
        </div>
      </div>
      <div class="empty-view" v-else>
        <div class="info">快找小伙伴聊天吧 ( ゜- ゜)つロ</div>
      </div>
    </div>
    <!-- 会话列表抽屉 -->
    <a-drawer width="50vw" :visible="visible" @ok="handleOk" @cancel="handleCancel" :footer="false" unmountOnClose>
      <div class="title">近期消息</div>
      <div class="seesion-list" v-infinite-scroll="loadMore">
        <SessionList
          @clickItem="clickItemHandler"
          :sessionList="sessionList"
          :default-select="currentSessionId"
        />
      </div>
    </a-drawer>
  </div>
</template>

<script setup>
import { getToken } from '@/utils/auth'
import { useUserStore } from '@/stores/user'
import { getUserCards } from '@/api/user'
import { Message } from '@arco-design/web-vue'
import { onMounted, watch, ref } from 'vue'
import { getWhisperList, getSessionRecord, getSeesion, removeSeesion } from '@/api/whisper'
import MessageView from './components/MessageView.vue'
import SessionList from './components/SessionList.vue'
import setting from '@/config/setting'
import { useRoute } from 'vue-router'
import router from '@/router'

const userStore = useUserStore()
const route = useRoute()

const MAXCOUNT = 500

const messageViewRef = ref()

var currentSessionId = ref(route.params.id)
var scrollBottom = ref(false)
var messageEnd = ref(false)
var text = ref('')
var textLenght = ref(0)
var messageMap = ref({})
var sessionList = ref([])
var userMap = ref([])
var total = ref(1)
var messageListTotal = ref(1)
var visible = ref(false)


var isLoad = false
var sessionListParams = {
  pageNum: 1,
  pageSize: 10
}

var messageListParams = {
  pageNum: 1,
  pageSize: 10,
  sessionId: currentSessionId.value
}

/* 检查输入框字数 */
watch(text, (newV) => {
  textLenght.value = newV.length
})

watch(
  () => route.params,
  (newV) => {
    if (newV?.id != undefined) {
      resetMessageListParams()
      currentSessionId.value = newV.id
      messageMap.value[currentSessionId.value] = []
      getMessageList()
      messageListParams.pageNum += 1
      setTimeout(()=>messageViewRef.value.setScrollEnd(), 50)
    }
  }
)

var ws = new WebSocket(setting.WebSocketUrl + '/ws/whisper?access=' + getToken())

ws.onopen = () => {
  console.log('连接成功')
}

ws.onmessage = async (message) => {
  let data = JSON.parse(message.data) // 接受从服务器发送的消息 是一个字符串
  let sessionId = route.params.id
  let isEmp = sessionList.value.filter((item) => item.receiverId === data.senderId).length === 0
  // 查看当前会话列表中是否有该用户
  if (isEmp) {
    sessionId = data.senderId
    await getSeesion({ talkerUid: data.senderId })
    resetSessionListParams()
    sessionList.value = []
    loadMore()
  }
  if (
    messageMap.value[sessionId] === null ||
    messageMap.value[sessionId] === undefined
  )
  {
    messageMap.value[sessionId] = []
  }
  // 更新最新消息的展示
  sessionList.value.forEach(item=>{
    // console.log(item);
    if (item.receiverId === data.senderId) {
      item.lastMsg = data
    }
  })
  try {
    messageViewRef.value.setScrollEnd()
  } catch(e){
  }
  messageMap.value[sessionId] = messageMap.value[sessionId].concat(data)
}

ws.onerror = () => {
  Message.error('连接异常')
}

ws.onclose = (event) => {
  // 正常关闭
  if (event.code === 1000) {
    // Message.info('会话关闭')
    console.log('close')
  } else {
    // 服务器断开
    Message.error('与服务器断开连接。')
  }
}

onMounted(() => {
  if (route.params?.id != undefined) {
    getSeesion({ talkerUid: currentSessionId.value }).then(res=> {
      isLoad = true
      loadMore()
    })
    // currentSessionId.value = route.params.id
    messageMap.value[currentSessionId.value] = []
    getMessageList()
    messageListParams.pageNum += 1
  } else {
    isLoad = true
  }
})

// 滚动事件，是否到达元素顶部，分页获取聊天记录
function handleScroll() {
  getMessageList()
  messageListParams.pageNum += 1
}

function resetMessageListParams() {
  messageListTotal.value = 1
  messageListParams = {
    pageNum: 1,
    pageSize: 10,
    sessionId: currentSessionId.value
  }
}

function resetSessionListParams() {
  total.value = 1
  scrollBottom.value = false
  sessionListParams = {
    pageNum: 1,
    pageSize: 10
  }
}

// 获取聊天记录
function getMessageList() {
  if (messageListTotal.value > messageMap.value[currentSessionId.value].length) {
    getWhisperList(messageListParams).then((res) => {
      messageMap.value[currentSessionId.value] = res.data.records
        .reverse()
        .concat(messageMap.value[currentSessionId.value])
      messageListTotal.value = res.data.total
    })
  } else {
    messageEnd.value = true
  }
}

// 加载更多
function loadMore() {
  if ((sessionList.value.length < total.value) && isLoad) {
    getSessionRecord(sessionListParams).then((res) => {
      let userIds = []
      let temp = res.data.records
      temp.forEach((item) => {
        userIds.push(item.receiverId)
      })
      getUserCards({ uids: encodeURI(userIds) }).then((res) => {
        let userlist = res.data
        userlist.forEach((e, i) => {
          temp[i].user = e
          userMap.value[userlist[i].id] = userlist[i]
        })
        sessionList.value = sessionList.value.concat(temp)
      })
      total.value = res.data.total
      sessionListParams.pageNum += 1
    })
  } else {
    scrollBottom.value = true
  }
}

function removeSeesionHandler(id) {
  removeSeesion({talkerUid: id}).then(res=>{
    location.href = '/message/whisper'
    resetSessionListParams()
    loadMore()
  })
}

/**
 * 选中某个用户
 */
function clickItemHandler(uid) {
  if (route.params.id !== uid) {
    currentSessionId.value = uid
    router.push({ name: 'whisper', params: { id: uid } })
  }
}

// 发送消息
function sendMsg() {
  var message = {
    receiverId: '',
    content: '',
    extraInfo: {}
  }
  message.receiverId = currentSessionId.value
  message.content = JSON.stringify({
    content: text.value
  })
  ws.send(JSON.stringify(message))
  message.sendTime = Date.now()
  message.senderId = userStore.getUser.id
  messageMap.value[currentSessionId.value] = messageMap.value[currentSessionId.value].concat(message)
  sessionList.value.forEach(item=>{
    // console.log(item);
    if (item.receiverId === message.receiverId) {
      item.lastMsg = message
    }
  })
  messageViewRef.value.setScrollEnd()
  text.value = ''
}

// 抽屉
function handleOk() {
  visible.value = true
}

function handleCancel() {
  visible.value = false
}

</script>

<style scoped>
.whisper {
  display: flex;
  /* height: 100%; */
  box-sizing: border-box;
  box-shadow: 0 2px 4px 0 rgb(121 146 185 / 54%);
}

.whisper-left {
  width: 200px;
  border-right: 1px solid #e9eaec;
  height: 100%;
}

.whisper-left > .title {
  padding-left: 20px;
}

.seesion-list {
  height: 100%;
  overflow: auto;
}

.whisper-right {
  width: 800px;
  height: 100%;
  box-sizing: border-box;
  background: #f7f8f9;
}

.whisper-right > .empty-view {
  height: 839px;
  width: 100%;
}

.whisper-right > .empty-view > .info{
  text-align: center;
  line-height: 839px;
}

.whisper-right .title {
  background-color: #fff;
  text-align: center;
}

.title {
  position: relative;
  border-bottom: 1px solid #e9eaec;
  height: 40px;
  line-height: 40px;
  box-sizing: border-box;
}

/* 聊天内容展示 */
.whisper-main-container {
  font-size: 12px;
  color: #666;
  height: 600px;
}

/*编辑区 */
.edit {
  box-sizing: border-box;
  height: calc(100% - 640px);
  border-top: 1px solid #d8d8d8;
}

.edit-title {
  height: 48px;
  line-height: 48px;
  padding: 5px 10px;
  box-sizing: border-box;
}

.edit-title > * {
  margin-right: 5px;
}

.msg-textarea {
  font-size: 14px;
  color: var(--juejin-font-1);
  flex: 1;
  width: 100%;
  resize: none;
  height: 100px;
  border: none;
  outline: none;
  background: #f7f8f9;
  padding: 0 10px;
  box-sizing: border-box;
}

.edit-foot {
  height: 45px;
  line-height: 45px;
  text-align: right;
  vertical-align: middle;
  font-size: 12px;
}

.edit-foot > span {
  margin-right: 10px;
  color: #c0c0c0;
}

.edit-foot > button {
  cursor: pointer;
  margin: 0;
  position: relative;
  width: 88px;
  height: 30px;
  text-align: center;
  border: 1px solid #e7e7e7;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 4px;
  margin-right: 10px;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background-color: silver;
  border-radius: 3px;
}

::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}


@media (max-width: 768px) {
  .whisper {
    width: 100vw;
    height: 100%;
  }
  .whisper > .whisper-left {
    display: none;
  }
  .whisper > .whisper-right {
    width: 100%;
    height: 100%;
  }

}
</style>
