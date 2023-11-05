<template>
    <div class="user-container">
        <div class="user-inner" :style="{ 'background-image': `url(${background})` }">
            <div class="block-wrap">
                <div class="user-info-block">
                    <div class="avatar">
                        <a-upload show-preview-button :show-file-list="false" :custom-request="customRequest" v-if="user.id === getUid() && userStore.user.id === getUid()">
                            <template #upload-button>
                                <div style="
                                background-color: var(--color-fill-2);
                                color: var(--color-text-1);
                                border: 1px dashed var(--color-fill-4);
                                width: 80px;
                                height: 80px;
                                border-radius: 50%;
                                text-align: center;" v-if="user.avatar === null || user.avatar == undefined || user.avatar === ''">
                                    <div>
                                        <span style="color: #3370FF; line-height: 120px;">点击上传图片</span>
                                    </div>
                                </div>
                                <img style="width: 80px;  border-radius: 50%;height: 80px;" :src="setting.baseUrl + user.avatar" alt=""
                                    v-else>
                            </template>
                        </a-upload>
                        <a-image width="80" style="border-radius: 50%;" :src="setting.baseUrl + user.avatar" v-else />
                    </div>
                    <div class="h-basic">
                        <div class="h-title">
                            <h2 style="color: #fff;" >{{ user.nickname }}</h2>
                            <template v-if="user.role != null">
                                <a-tag style="margin-left: 8px;" v-if="user.role != null && user.role.ident === 'admin'"
                                    :color="'magenta'" bordered>{{ user.role.roleName }}</a-tag>
                                <a-tag style="margin-left: 8px;" v-else>{{ user.role.roleName }}</a-tag></template>
                        </div>
                        <span class="describe">
                            {{ user.description }}
                        </span>
                    </div>
                    <div class="setting" v-if="user.id === getUid() && userStore.user.id === getUid()">
                        <a-dropdown-button size="medium" @click="$router.push({name:'setting'})">
                            设置
                            <template #content>
                                <a-doption @click="router.push({name:'editAdd'})">发布文章</a-doption>
                                <a-doption @click="exit">退出登录</a-doption>
                            </template>
                        </a-dropdown-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="user-bottom-nav">
            <a-menu mode="horizontal" :default-selected-keys="['articleList']" :selected-keys="[$route.name === 'userDefault' ? 'articleList' : $route.name]" @menu-item-click="menuItemClickHandler">
                <a-menu-item key="articleList">文章列表</a-menu-item>
                <a-menu-item key="followList">关注列表</a-menu-item>
                <a-menu-item key="cllectList">收藏</a-menu-item>
            </a-menu>
        </div>
        <div class="view-container">
            <router-view v-slot="{ Component }">
                <keep-alive include="ArticleList">
                    <component :is="Component" />
                </keep-alive>
            </router-view>
        </div>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { computed, ref, onMounted, watch } from 'vue';
import { Message } from '@arco-design/web-vue';
import { upload } from '@/api/upload'
import { updateUser, getUser } from '@/api/user'
import setting from '@/config/setting';
import { getUid } from '@/utils/auth';


const userStore = useUserStore()

const route = useRoute()
const router = useRouter()

// 解决组件复用组件不刷新
watch(
    () => route.params,
    (toParams, previousParams) => {
        // 对路由变化做出响应...
        // console.log(toParams.id, previousParams);
        if (toParams.id !== previousParams.id && toParams.id != undefined && route.path.startsWith('/user/')) {
            getUser(toParams.id).then(res=>{
                user.value = res.data
            })
        }
        
    }
)

let user = ref({})

onMounted(() => {
    if (route.params.id != undefined && route.params.id != null && route.params.id.length == 19)
        getUser(route.params.id).then(res=>{
            user.value = res.data
            document.title = user.value.nickname + '的空间'
        }).catch(_=>router.replace({name:'home'}))
    else {
        router.replace({name:'home'})
    }
})

const background = computed(() => {
    return user.value.background != null && user.value.background && user.value.background != ''
        ? setting.baseUrl + user.value.background : setting.baseUrl + setting.failBackground
})

function customRequest(option) {
    let { fileItem } = option
    let file = fileItem.file
    const typeList = ['image/png', 'image/jpeg', 'image/gif']
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!typeList.includes(file.type)) {
        Message.error('只可以上传图片');
        return
    }
    if (!isLt2M) {
        Message.error('上传头像图片大小不能超过 5MB!');
        return
    }
    let formData = new FormData()
    formData.append('file', file)
    upload(formData).then(res => {
        updateUser({ avatar: res.msg }).then(
            user.value.avatar = userStore.user.avatar = res.msg
        ).catch(e => e)
    }).catch(r => r)
}

function exit() {
    userStore.exit()
    router.replace({name:'home'})
}


function menuItemClickHandler(key) {
    router.push({name: key})
}

</script>

<style scoped>
.user-container {
    width: 1200px;
    padding: 0 20px;
    margin: 0 auto;
    box-sizing: border-box;
}

.user-inner {
    height: 200px;
    position: relative;
    background-size: cover;
}

.block-wrap {
    height: 80px;
    position: relative;
    top: 120px;
}

.user-info-block {
    height: 100%;
    width: 100%;
    display: flex;
    align-content: center;
    justify-content: flex-start;
    align-items: center;
}

.user-info-block>.avatar {
    margin-left: 10px;
}

.h-title {
    margin-left: 20px;
    display: flex;
}

.describe {
    margin-left: 20px;
    margin-top: 10px;
    width: 500px;
    overflow: hidden;
    white-space: nowrap;
    display: flex;
    text-overflow: ellipsis;
    color: #fff;
}

.setting {
    position: absolute;
    bottom: 0;
    right: 0;
    margin-right: 10px;
    margin-bottom: 10px;
}

.user-bottom-nav {
    margin-top: 20px;   
}

@media (max-width: 768px) {
    .user-container {
        width: 100vw;
        padding: 0 10px;
    }
    .setting {
        margin-left: 5px;
        margin-bottom: 5px;
    }
    .describe {
        width: 160px;
    }
    .user-info-block>.avatar {
        margin-left: 5px;
    }

}

.view-container {
    background-color: #fff;
    width: 100%;
}

</style>