<template>
    <div class="article-container">
        <div class="left-info">
            <div class="content">
                <div class="title">
                <h1>{{ articleContent.title }}</h1>
                </div>
                <div class="author-info-box" v-if="articleContent.author">
                    <div class="author">{{ articleContent.author.nickname }}</div>
                    <!-- <div class="tag">{{ articleContent.category }}</div> -->
                    <div class="category">类别：{{ articleContent.category }}</div>
                    <div class="time">{{ articleContent.createTime }}</div>
                    <div class="lookCount"><icon-eye />{{ articleContent.viewCounts }}</div>
                    <div class="info"><a-link @click="drawerVisible = true">详情</a-link></div>
                </div>
                <mavon-editor 
                    v-if="articleContent != null && articleContent.content"
                    :fontSize="'16px'"
                    :subfield="false"
                    :editable="false"
                    :defaultOpen="'preview'"
                    :previewBackground="'#fff'"
                    :boxShadow="false"
                    :toolbarsFlag="false"
                    v-model="articleContent.content.content"
                />
            </div>
                <!-- 评论 -->
                <div class="comment">
                    <div class="comment-nav">
                    <ul class="comment-title">
                        <li><span style="font-size: 20px;">评论</span></li>
                        <li>{{ articleContent.commentCounts }}</li>
                    </ul>
                    <ul class="comment-sort">
                        <li @click="commentSort(false)" ref="hot">最热</li>
                        <li @click="commentSort(true)" ref="news">最新</li>
                    </ul>
                </div>
                <div class="comment-text">
                    <a-textarea 
                    style="height: 120px;" 
                    :placeholder="userStore.isLogin ? '平等表达，友善交流' : '非登录用户不可评论'" 
                    :disabled="!userStore.isLogin"
                    v-model="commentText" 
                    :max-length="1000" 
                    allow-clear 
                    show-word-limit
                    @focus="currentReply = -1" />
                    <a-button type="primary" size="large" @click="commentHandler" v-if="userStore.isLogin">发送</a-button>
                </div>
                <a-comment 
                    v-for="comment, index in commentList"
                    :key="comment.id"
                    :author="comment.commentator.nickname"
                    :content="comment.content" 
                    :datetime="comment.createTime"
                    >
                        <template #avatar>
                            <a-trigger position="top" scroll-to-close auto-fit-position unmount-on-close>
                                <a-avatar>
                                    <img
                                    alt="avatar"
                                    :src="getAvatar(comment.commentator.avatar)"
                                    />
                                </a-avatar>
                                <template #content>
                                    <UserCard title="用户信息" :user-info="comment.commentator"></UserCard>
                                </template>
                            </a-trigger>
                        </template>
                        <template #actions>
                            <span class="action" @click="onLikeChange({one: index, two: -1})" >
                                <icon-thumb-up-fill v-if="comment.like" :style="{ color: '#00AEEC' }" /> 
                                <icon-thumb-up v-else /> 
                                {{ comment.likeCount + comment.like ? 1 : 0 }}
                            </span>
                            <span class="action" @click="onTrampleChange({one: index, two: -1})">
                                <icon-thumb-down-fill v-if="comment.trample" :style="{ color: '#00AEEC' }" /> 
                                <icon-thumb-down v-else /> 
                                {{ comment.trampleCount + comment.trample ? 1 : 0 }}
                            </span>
                            <span class="action" @click="openReply(comment.id)" v-if="!(currentReply === comment.id)">
                                <IconMessage /> 回复
                            </span> 
                        </template>
                        <!-- 回复框 -->
                        <ReplyInput 
                            v-if="currentReply === comment.id"
                            :scope="{articleId: $route.params.id, parentId: comment.id, commentType: '2'}"
                            :avatar="getAvatar(userStore.getUser.avatar)"
                            @cancel="cancel"
                            @relpy="relpy"
                            ></ReplyInput>
                        <!-- 子评论 -->
                        <a-comment 
                            v-for="subComment, subIndex in comment.subComments.slice(currentComment === comment.id ? start : 0
                                    , currentComment === comment.id ? end : 2)" 
                            v-if = "comment.subComments != null && comment.subComments.length > 0"
                            :key="subComment.id"
                            :author="subComment.target == null ? subComment.commentator.nickname : subComment.commentator.nickname + ' 回复 ' + subComment.target.nickname"
                            :content="subComment.content" 
                            :datetime="subComment.createTime"
                            >
                            <template #avatar>
                            <a-trigger position="top" scroll-to-close auto-fit-position unmount-on-close>
                                <a-avatar>
                                    <img
                                    alt="avatar"
                                    :src="getAvatar(subComment.commentator.avatar)"
                                    />
                                </a-avatar>
                                <template #content>
                                    <UserCard title="用户信息" :user-info="comment.commentator"></UserCard>
                                </template>
                            </a-trigger>
                            </template>
                            <template #actions  >
                                <span class="action" @click="onLikeChange({one: index, two: subIndex})" >
                                <icon-thumb-up-fill v-if="subComment.like" :style="{ color: '#00AEEC'  }" /> 
                                <icon-thumb-up v-else /> 
                                {{ subComment.likeCount + subComment.like ? 1 : 0 }}
                            </span>
                            <span class="action" @click="onTrampleChange({one: index, two: subIndex})">
                                <icon-thumb-down-fill v-if="subComment.trample" :style="{ color: '#00AEEC' }" /> 
                                <icon-thumb-down v-else /> 
                                {{ subComment.trampleCount + subComment.trample ? 1 : 0 }}
                            </span>
                                <span class="action" @click="openReply(subComment.id)" v-if="!(currentReply === subComment.id)">
                                    <IconMessage /> 回复 
                                </span>
                            </template>
                            <ReplyInput 
                            v-if="currentReply === subComment.id" 
                            :scope="{articleId: $route.params.id, toId: subComment.commentator.id, parentId: comment.id, commentType: '3'}"
                            :avatar="getAvatar(userStore.getUser.avatar)"
                            @cancel="cancel"
                            @relpy="relpy"
                            ></ReplyInput>
                        </a-comment>
                        <!-- 展开子评论 -->
                        <div 
                            v-if="currentComment !== comment.id && comment.subComments instanceof Array && comment.subComments.length > 3"
                            class="expand-comment"
                            >
                            共{{ comment.subComments.length }}条消息，<span class="click-look" @click="expandComment(comment.id)">点击查看</span></div>
                        <a-pagination 
                            v-else-if="currentComment == comment.id" 
                            size="small" 
                            :total="comment.subComments.length"
                            hide-on-single-page
                            :page-size="pageCount"
                            @change="subCommitPageHandler"/>
                    </a-comment>
            </div>
        </div>
        <div class="right-card">
            <!-- 角色卡片 -->
            <UserCard v-if="articleContent.author" title="作者信息" :userInfo="articleContent.author"></UserCard>
            <a-card  title="文章信息">
                <a-list :bordered="false" :split="false">
                    <a-list-item>
                        <span>类别：{{ articleContent.category }}</span>
                    </a-list-item>
                    <a-list-item>
                        <span>标签：</span>
                        <a-tag style="margin-right: 5px;" color="arcoblue" v-for="tag in articleContent.tags" :key="tag.id">{{ tag.tagName }}</a-tag>
                    </a-list-item>
                </a-list>
            </a-card>
        </div>

        <!-- 抽屉 -->
        <a-drawer
            :height="500"
            :visible="drawerVisible"
            :placement="'bottom'"
            @cancel="drawerVisible = false"
            :footer="false"
            unmountOnClose
        >
            <div class="drawer-card">
                <div class="item1">
                    <!-- 角色卡片 -->
                    <UserCard v-if="articleContent.author" title="作者信息" :userInfo="articleContent.author"></UserCard>
                </div>
                <div class="item2">
                    <a-card  title="文章信息">
                    <a-list :bordered="false" :split="false">
                        <a-list-item>
                            <span>类别：{{ articleContent.category }}</span>
                        </a-list-item>
                        <a-list-item>
                            <span>标签：</span>
                            <a-tag style="margin-right: 5px;" color="arcoblue" v-for="tag in articleContent.tags" :key="tag.id">{{ tag.tagName }}</a-tag>
                        </a-list-item>
                    </a-list>
                    </a-card>
                </div>
                
            </div>
        </a-drawer>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import UserCard from '@/components/UserCard.vue';
import ReplyInput from './components/ReplyInput.vue'
import { Message } from '@arco-design/web-vue'
import { useRoute, useRouter } from 'vue-router';
import { getToken } from '@/utils/auth';
import { getArticleContent } from '@/api/article'
import { getComment, push } from '@/api/comment'
import { useUserStore } from '@/stores/user';
import setting from '@/config/setting';


let route = useRoute()
let router = useRouter()
const userStore = useUserStore();

const articleContent = ref({})
const commentList = ref([])
let drawerVisible = ref(false)
let commentText = ref('')
let currentReply = ref('')
let currentComment = ref('')   // 当前选择的评论
let start = ref(0)  // 子评论
let end = ref(8)   // 子评论截止长度

// 非响应式
let params = {
    pageNum: 1,
    pageSize: 20,
    getNew: false,
    articleId: route.params.id
}
let pageCount = 5

// ref
let hot = ref(null)
let news = ref(null)

onMounted(() => {
    hot.value.classList.add('comment-sort-item-select')
    getArticleContent(route.params.id)
        .then((res) => {
            articleContent.value = res.data
        }).catch(e=>router.replace('/'))
    if (getToken()) {
        getList()
    }
})

function getAvatar(url) {
    return url != null && url != '' ? setting.baseUrl + url : setting.baseUrl + setting.failImg
}

function reset() {
    params = {
        pageNum: 1,
        pageSize: 20,
        getNew: false,
        articleId: route.params.id
    }
}

function getList() {
    getComment(params).then(res=>{
        commentList.value = res.data.records
    })
}

const onLikeChange = (data) => {
    if (data.two === -1) {
        commentList.value[data.one].like = !commentList.value[data.one].like
    } else {
        commentList.value[data.one].subComments[data.two].like 
            = !commentList.value[data.one].subComments[data.two].like
    }
};

const onTrampleChange = (data) => {
    if (data.two === -1) {
        commentList.value[data.one].trample 
            = !commentList.value[data.one].trample
    } else {
        commentList.value[data.one].subComments[data.two].trample 
            = !commentList.value[data.one].subComments[data.two].trample
    }
};

function expandComment(id) {
    start.value = 0
    end.value = pageCount
    currentComment.value = id  //展开当前评论的子评论
}

function subCommitPageHandler(currenPage) {
    start.value = (currenPage - 1) * pageCount   // 评论开始
    end.value = start.value + pageCount  // 子评论结尾
}

// 回复框的位置
function openReply(id) {
    currentReply.value = id
}

// 排序按钮
function commentSort(isNew) {
    let className = 'comment-sort-item-select'
    if (params.getNew !== isNew) {
        reset()
        params.getNew = isNew
        if (isNew) {
            hot.value.classList.remove(className)
            news.value.classList.add(className)
        } else {
            news.value.classList.remove(className)
            hot.value.classList.add(className)
        }
        getList()
    }
}

function cancel() {
    currentReply.value = -1
}

function relpy(content, scope) {
    cancel()
    push({...scope, content}).then((res=>{
        if (res.code === 200) {
            Message.success(res.msg)
            getList()
        }
    }))
}

function commentHandler() {
    relpy(commentText.value, {articleId: route.params.id, commentType: '1'})
    commentText.value = ''
}

</script>

<style scoped>

.article-container {
    display: flex;
    justify-content: space-between;
    max-width: 1200px;
    width: 1200px;
    box-sizing: border-box;
    font-size: 16px;
    margin: 0 auto;
}

.left-info {
    max-width: 850px;
    width: 850px;
    font-size: 16px;
}

.title {
    padding: 0 10px;
    word-wrap: break-word;   /* 超出父元素的部分自动换行 */
}


.author-info-box {
    height: 24px;
    font-size: 12px;
    display: flex;
    border-bottom: 1px solid rgba(0,0,0,.06);
    padding: 10px 0;
}
.author-info-box > * {
    margin-left: 24px;
}

.author-info-box > :first-child {
    margin-left: 10px;
}

.author-info-box > .author  {
    font-weight: bolder;
}
.author-info-box > .info  {
    display: none;
}
.content {
    /* margin-top: 40px; */
    width: 100%;
    padding: 20px 20px;
    box-sizing: border-box;
    background-color: #fff;
}

.comment {
    margin-top: 20px;
    width: 100%;
    box-sizing: border-box;
    background-color: #fff;
    padding: 20px 20px;
    font-size: 15px !important;
}

.arco-comment {
    font-size: 15px;
}

.arco-comment .arco-comment-inner-comment {
    margin-top: 0 !important;
}

.v-note-wrapper.markdown-body {
    margin: 0px !important;
}

.comment-nav {
    display: flex;
    align-items: center;
}

.comment-title {
    display: flex;
    align-items: center;
}
.comment-title li:last-child {
    margin-left: 5px;
}

.comment-nav > .comment-sort {
    display: flex;
    margin-left: 10px;
    align-items: center;
    font-size: 15px;
}
.comment-nav > .comment-sort li {
    font-size: 13px;
    padding: 0 10px;
    vertical-align: middle;
    border-left: 0.5px black solid;
}

.comment-sort > li:hover {
    cursor: pointer;
}

.comment-sort-item-select {
    font-weight: bold;
}

.comment-sort :first-child {
    border: 0 !important;
}
.comment > .comment-text {
    padding-top: 20px;
    text-align: right;
}

.action {
    font-size: 15px;
    display: inline-block;
    padding: 0 4px;
    color: var(--color-text-1);
    line-height: 24px;
    background: transparent;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.1s ease;
}

.action:hover {
    background: var(--color-fill-3);
}

.expand-comment {
    font-size: 13px;
    color: #9499A0;
}

.click-look:hover {
    cursor: pointer;
    color: #00aeec;
}

.v-note-wrapper {
    border: 0 !important;
    margin-top: 20px;
}


.right-card {
    width: 320px;
}


.right-card > div {
    margin-bottom: 10px;
}

@media (max-width: 768px) {
    /* 抽屉 */

    .author-info-box > .info  {
        display: block;
    }
    .article-container {
        /* display: block; */

        width: 100vw;
    }
    .left-info {
        width: 100vw;
    }
    .right-card {
        display: none;
    }

    .drawer-card {
        width: 100%;
    }
    .drawer-card > div {
        margin-bottom: 20px !important;
    }
    .drawer-card .item1 {
        width: 298px;
        margin: 0 auto;
    }
    .v-note-wrapper.markdown-body {
        z-index: 1001;
    }
}

</style>