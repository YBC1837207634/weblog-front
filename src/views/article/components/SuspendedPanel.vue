<template>
    <div class="panel-container">
        <div class="like-btn">
            <icon-thumb-up />
        </div>
        <div class="collect-btn" @click="clickCollect">
            <icon-star v-if="!isCollect" />
            <icon-star-fill :style="{ color: '#00AEEC' }" v-else />
        </div>
        <div class="collect-btn">
            <icon-message />
        </div>
        <div class="collect-btn">
            <icon-launch />
        </div>
        <div class="collect-btn">
            <icon-more />
        </div>
    </div>
    <!-- dialog -->
    <div class="collect-dialog">
        <a-modal v-model:visible="collectDialogvisible" @ok="collectOkHandler" @cancel="collectCancelHandler" :ok-button-props="{disabled: checked.length === 0}">
            <template #title>
                <div style="text-align: center;">
                    <h4>{{ isCollect ? '取消收藏' : '选择收藏夹'}}</h4>
                    <div style="font-size: 12px; padding-top: 2px">{{ isCollect ? '选取需要取消收藏的收藏夹' : '选择你的收藏集'}}</div>
                </div>
            </template>
            <div class="collect-dialog-item" v-for="favorites in favoritesList" :key="favorites.id" >
                <a-checkbox :default-checked="memoryChecked.includes(favorites.id)? true : false" @change="clickItem(favorites.id)" :key="favorites.id">
                    <div class="title">
                        {{ favorites.title }}
                        <a-tag bordered>{{ favorites.common === 0 ? '私密' : '公开' }}</a-tag>
                    </div>
                    <div class="description"> 
                        共收藏{{ favorites.total }} 篇文章
                    </div>
                </a-checkbox>
                
            </div>
        </a-modal>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { queryFavorites, getFavoritesList, updateItem, createFavorites, deleteFavorites } from '@/api/collect';
import { Message } from '@arco-design/web-vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
import router from '@/router';
import { getToken } from '@/utils/auth';
const userStore = useUserStore()

const route = useRoute()

let collectDialogvisible = ref(false)
let favoritesList = ref([])
let isCollect = ref(false)
let memoryChecked = ref([])
// 复选框选择
let checked = ref([])

function getList() {
    getFavoritesList({ sort: 'desc' }).then(res => {
        favoritesList.value = res.data
        // 查询是否收藏该文章
        queryFavorites({ articleId: route.params.id }).then(res => {
            if (res.data.length > 0) {
                isCollect.value = true;
                // 获取收藏该文章的收藏夹id
                memoryChecked.value = res.data
                favoritesList.value = favoritesList.value
                    .filter(item => memoryChecked.value.includes(item.id))
            }
        })
    })
}

onMounted(() => {
    // 查询是否收藏该文章
    queryFavorites({articleId:route.params.id}).then(res => {
        if (res.data.length > 0 ) {
            isCollect.value = true;
            // 获取收藏该文章的收藏夹id
            memoryChecked.value = res.data
        }
    })
})

// 收藏事件
function clickCollect() {
    if (getToken() === userStore.token) {
        collectDialogvisible.value = true
        getList()
    } else {
        router.push({name: 'login', params: location.href})
    }
    
}

function collectOkHandler() {
    updateItem({
        act: isCollect.value ? '2' : '1',
        favoritesIds: checked.value,
        itemId: route.params.id
    }).then(res=>{
        if (isCollect.value) {
            if (checked.value.length === memoryChecked.value.length)
                isCollect.value = false
            Message.success('取消收藏成功')
        } else {
            isCollect.value = true
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

.panel-container>div {
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

.panel-container>div:hover {
    color: #165DFF;
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
        top: 0;
        margin-left: 0;
        display: flex;
        justify-content: space-between;
    }
    .panel-container>div {
        background-color: #f7f8f9;
        margin-bottom: 0px;
        box-shadow: 0 0px 0px 0 rgb(50 50 50 / 4%);
    }
}

/* 复选框样式 */
/* .custom-checkbox-card {
    padding: 10px 16px;
    border: 1px solid var(--color-border-2);
    border-radius: 4px;
    width: 100%;
    box-sizing: border-box;
}

.custom-checkbox-card-mask {
    height: 14px;
    width: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 2px;
    border: 1px solid var(--color-border-2);
    box-sizing: border-box;
}

.custom-checkbox-card-mask-dot {
    width: 8px;
    height: 8px;
    border-radius: 2px;
}

.custom-checkbox-card-title {
    color: var(--color-text-1);
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 8px;
}

.custom-checkbox-card:hover,
.custom-checkbox-card-checked,
.custom-checkbox-card:hover .custom-checkbox-card-mask,
.custom-checkbox-card-checked .custom-checkbox-card-mask {
    border-color: rgb(var(--primary-6));
}

.custom-checkbox-card-checked {
    background-color: var(--color-primary-light-1);
}

.custom-checkbox-card:hover .custom-checkbox-card-title,
.custom-checkbox-card-checked .custom-checkbox-card-title {
    color: rgb(var(--primary-6));
}

.custom-checkbox-card-checked .custom-checkbox-card-mask-dot {
    background-color: rgb(var(--primary-6));
}

.arco-checkbox-group {
    width: 100% !important;
}

.arco-checkbox {
    width: 100% !important;
}
.arco-checkbox.arco-checkbox-checked {
    width: 100% !important;    
}

.arco-checkbox-group.arco-checkbox  {
    width: 100% !important;
}

.arco-checkbox.arco-checkbox-disabled {
    width: 100% !important;
}

.arco-checkbox-group.arco-checkbox {
    width: 100% !important;
} */
</style>