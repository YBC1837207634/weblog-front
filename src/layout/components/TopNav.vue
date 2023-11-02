<template>
    <div class="top-nav">
        <div class="top-nav-container ">
            <div class="logo">
                logo
            </div>
            <div class="items">
                <div class="top-menu">
                    <a-menu mode="horizontal" size="medium" :default-selected-keys="[$route.path]" :collapsed="false"
                        @menu-item-click="go">
                        <a-menu-item key="/">首页</a-menu-item>
                        <a-menu-item key="article">其他</a-menu-item>
                    </a-menu>
                </div>
                <div class="menu-button" @click="menuVisible = true">
                    <icon-menu-unfold />
                </div>
                <div class="right-items">
                    <div class="search">
                        <a-input-search placeholder="搜索文章" size="medium" search-button />
                    </div>
                    <div class="message-item">
                        <icon-notification style="font-size: 16px;" />
                    </div>
                    <div class="avatar">
                        <div class="btn" v-if="userStore.isLogin">
                            <a-avatar @click="userSpace">
                                    <img size="medium" alt="avatar" :src="setting.baseUrl + userStore.getUser.avatar" />
                                </a-avatar>
                        </div>
                        <a-button type="primary" v-else @click="login">登录</a-button>
                    </div>
                </div>
            </div>
        </div>

        <div class="mask" v-if="menuVisible" @click="menuVisible = false">
            <!-- 浮动菜单 -->
            <div class="float-menu">
                <a-menu @click.stop :collapsed="false" v-show="menuVisible" accordion :default-selected-keys="[$route.path]"
                    :style="{ width: '50vw', height: '100vh', 'backgroud-color': '#232324' }" @menu-item-click="go">
                    <a-menu-item key="/"><icon-apps></icon-apps>主页</a-menu-item>
                    <a-sub-menu key="0">
                        <template #icon><icon-apps></icon-apps></template>
                        <template #title>其他</template>
                        <a-menu-item key="0_0">Menu 1</a-menu-item>
                        <a-menu-item key="0_1">Menu 2</a-menu-item>
                        <a-menu-item key="0_2">Menu 3</a-menu-item>
                        <a-menu-item key="0_3">Menu 4</a-menu-item>
                    </a-sub-menu>
                </a-menu>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import setting from '@/config/setting'

defineOptions({
    name: 'TopNav'
})


let menuVisible = ref(false)
const userStore = useUserStore()
const router = useRouter()

onMounted(() => {
    userStore.getUserInfo()
})


function login() {
    router.push({ name: 'login', query: { redirect: location.href } })
}

function go(route) {
    router.push(route)
}

function userSpace() {
    router.push({ name: 'user', params: { id: userStore.getUser.id } })
}

</script>

<style scoped>
.top-nav {
    width: 100%;
    max-height: 60px;
    height: 60px;
    background-color: #fff;
    display: flex;
    align-items: flex-start;
    z-index: 1000;
    box-shadow: 2px 0 8px rgb(0 21 41 / 35%);
    /* overflow-y: hidden; */
}

.top-nav-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    height: 60px;
    width: 1440px;
    /* max-width: 1440px; */
    margin: 0 auto;
}

.logo {
    line-height: 60px;
    width: 108px;
    height: 100%;
}

.menu-button {
    display: none;
}

.top-nav-container>.items {
    display: flex;
    justify-content: space-between;
    /* align-items: flex-start; */
    height: 100%;
    width: 100%;
}

.top-nav-container>.items>.right-items {
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    line-height: 60px;
}

.top-nav-container>.items>.right-items>* {
    margin-left: 10px;
}

.top-nav-container>.items>.right-items>.search {
    width: 300px;
}

.top-nav-container>.right-items>.avatar {
    width: 18px;

}

.avatar:hover {
    /* transition: width .28s;
    box-shadow: 2px 0 6px rgb(0 21 41 / 35%); */
    cursor: pointer;
}

.top-nav>.top-menu {
    box-sizing: border-box;
    height: 100%;
    background-color: var(--color-neutral-2);
}

.top-menu {
    width: 400px;
}



@media (max-width: 768px) {
    .top-nav {
        width: 100vw;
    }

    .logo {
        display: none;
    }

    .top-menu {
        display: none;
    }

    .message-item {
        display: none;
    }

    .menu-button {
        font-size: 26px;
        line-height: 60px;
        width: 40px;
        display: block;
        padding-left: 10px;
    }

    .menu-button:hover {
        cursor: pointer;
        background-color: rgb(0 21 41 / 35%);
    }

    .top-nav-container>.items>.right-items {
        width: 75vw;
        justify-content: flex-end;
    }

    .top-nav-container>.items>.right-items .avatar {
        padding-right: 5px;
    }

    .top-nav-container>.items>.right-items>.search {
        width: 35vw;
    }

    /* 遮罩层 */
    .mask {
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        z-index: 1008;
    }

    .float-menu {
        position: absolute;
        height: 100vh;
        width: 50vw;
        z-index: 1009;
        box-shadow: 1px 5px 6px rgb(0 21 41 / 35%);
    }

}
</style>