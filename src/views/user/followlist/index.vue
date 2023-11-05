<template>
    <div>
        <a-list :bordered="false" :size="'large'">
            <a-list-item v-for="item, index in data" :key="item.id" class="list-demo-item">
                <a-list-item-meta :title="item.nickname" @click="$router.push({ name: 'userDefault', params: { id: item.id } })"
                    :description="item.description">
                    <template #avatar>
                        <a-avatar shape="square">
                            <img alt="avatar" :src="setting.baseUrl + item.avatar" />
                        </a-avatar>
                    </template>
                </a-list-item-meta>
                <template #actions v-if="$route.params.id === getUid() && userStore.id === getUid()">
                    <a-dropdown-button size="medium" @click="relationHandler(item.id, index)">
                        {{ item.relationOk ? '已关注' : '关注' }}
                        <template #icon>
                            <icon-down />
                        </template>
                        <template #content>
                            <a-doption>发消息</a-doption>
                        </template>
                    </a-dropdown-button>
                </template>
            </a-list-item>
        </a-list>
        <ReloadButton @reload="reload"></ReloadButton>
    </div>
</template>

<script setup>
import { getList, relation } from '@/api/relation'
import { onMounted, ref } from 'vue';
import setting from '@/config/setting';
import { Message } from '@arco-design/web-vue';
import ReloadButton from '@/components/ReloadButton.vue';
import { getUid } from '@/utils/auth';
import { useUserStore } from '@/stores/user';
import { useRoute } from 'vue-router';

const route = useRoute()
const userStore = useUserStore()

let data = ref({})

onMounted(() => {
    if (route.params.id != undefined && route.params.id != null && route.params.id.length == 19) {
        getList({ pageNum: 1, pageSize: 20, followersId: route.params.id }).then(res => {
            data.value = res.data.records.filter(item => {
                item.relationOk = true
                return true
            })
        })
    }

})

function relationHandler(id, index) {
    relation({ goalId: id, act: data.value[index].relationOk ? 0 : 1 })
        .then(res => {
            Message.success(res.msg)
            data.value[index].relationOk = !data.value[index].relationOk
        })
}

// 加载按钮
function reload() {
    getList({ pageNum: 1, pageSize: 20, followersId: route.params.id }).then(res => {
        data.value = res.data.records.filter(item => {
            item.relationOk = true
            return true
        })
    })
}

</script>

<style scoped>
.list-demo-item {
    width: 100% !important;
    /* background-color: #fff; */
}

.list-demo-item:hover {
    cursor: pointer;
    /* background: #f7f8f9; */
}
</style>