<template>
    <div class="user-info-container">
        <a-card :title="title">
            <div class="user-warp" :style="{'background-image': `url(${background})`}">
                <div class="avatar">
                    <a-avatar :size="72" @click="$router.push({name:'userDefault', params: {id: userInfo.id}})">
                        <img
                            alt="avatar"
                            style="position: relative; top: -12px; cursor: pointer;"
                            :src="avatar"
                        />
                    </a-avatar>
                </div>
            </div>
            <div class="user-info">

                <div class="title">
                    <h2>{{ userInfo.nickname }}</h2>  
                    <a-tag style="margin-top: 8px;" v-if="userInfo.role.ident === 'admin'" :color="'magenta'" bordered >{{ userInfo.role.roleName }}</a-tag>
                    <a-tag style="margin-top: 8px;" v-else>{{ userInfo.role.roleName }}</a-tag>

                </div>
                <div class="info">
                    <div>文章数 {{ userInfo.articleCount }}</div>
                    <div>粉丝 {{ userInfo.fansCount }}</div>
                    <div>关注 {{ userInfo.followCount }}</div>
                </div>
                <div class="btn" v-if="userInfo.id !== getUid()">
                    <a-button  type="primary" @click="relationHandler(userInfo.id)">{{ relationOk ? '取消关注' : '关注'}}</a-button>
                    <a-button>发消息</a-button>
                </div>
            </div>
    </a-card>
    </div>

</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import setting from '@/config/setting';
import { relation, query } from '@/api/relation';
import { Message } from '@arco-design/web-vue';
import { getUid } from '@/utils/auth';

const props = defineProps({
    userInfo: Object,
    title: String
})
const background = computed(()=> {
    return props.userInfo.background != null && props.userInfo.background && props.userInfo.background != '' 
        ? setting.baseUrl + props.userInfo.background : setting.baseUrl +  setting.failBackground
})

const avatar = computed(()=>{
    return props.userInfo.avatar != null && props.userInfo.avatar && props.userInfo.avatar != '' 
        ? setting.baseUrl + props.userInfo.avatar : setting.baseUrl + setting.failImg
})


let relationOk = ref(false)

onMounted(() => {
    if (getUid() !== props.userInfo.id) {
        // 检查是否关注
        query({id:props.userInfo.id}).then(res => {
        if (res.msg === 'ok') 
            relationOk.value = true
    }).catch(e=>e)
    }
    
})


function relationHandler(id) {
    
    relation({goalId: id, act: relationOk.value ? 0 : 1})
    .then(res => {
        Message.success(res.msg)
        props.userInfo.fansCount += relationOk.value ? -1 : 1
        relationOk.value = !relationOk.value
    })
}


</script>

<style  scoped>
.user-info-container {
    width: 320px;
}

.user-warp {
    height: 144px;
    text-align: center;
    background-size: cover;
    
}
.user-warp > .avatar {
    line-height: 144px;
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

.user-info > .btn {
    margin-top: 20px;
    display: flex;
    justify-content: space-evenly;
}

@media (max-width: 768px) {
    .user-info-container {
        width: 80vw;
    }
}

</style>