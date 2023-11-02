<template>
    <div v-infinite-scroll="loadMore">
        <div class="setting-collapse">
        <a-collapse accordion>
            <a-collapse-item header="文章设置" key="1">
                <div>编辑模式：<a-switch  v-model="edit" /></div>
            </a-collapse-item>
        </a-collapse>
    </div>
    <div >
        <ArticleList v-if="!edit" :dataSource="dataSource"></ArticleList>
        <EditArticleList v-else @del="removeHandler"  @editArticle="editHandler"  :dataSource="dataSource"></EditArticleList>
    </div>
        <div v-if="bottom" style="text-align: center; padding: 10px;">到达底部</div>
    </div>

</template>

<script setup>
import { page, removeArticle } from '@/api/article';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import ArticleList from '@/components/ArticleList.vue'
import EditArticleList from '@/components/EditArticleList.vue';
import { Message } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';


const route = useRoute()
const router = useRouter()

let dataSource = ref([])
let bottom = ref(false)
let edit = ref(false)

let scrollBottom = false
let params = {
    pageNum: 1,
    pageSize: 20,
    sort: 'desc',
    sortField: 'createTime',
    authorId: route.params.id
}

function reset() {
    params = {
    pageNum: 1,
    pageSize: 20,
    sort: 'desc',
    sortField: 'createTime',
    authorId: route.params.id
}
}

function loadMore() {
    if (scrollBottom === false) {
        scrollBottom = true
        page(params).then(res => {
            if (res.data.records.length === 0) {
                scrollBottom = true
                bottom.value = true // 到达底部
                return
            }
            if (res.data.records.length < params.pageSize) {
                bottom.value = true // 到达底部
            }
            scrollBottom = false
            dataSource.value = dataSource.value.concat(res.data.records)
            params.pageNum += 1
        })
    }
}


function removeHandler(ids) {
    removeArticle(ids)
    .then(res => {
        reset()
        bottom.value = false
        scrollBottom = false
        edit.value = false
        page(params).then(res => {
            dataSource.value = res.data.records
        })
        Message.success(res.msg)
    }).catch(e=>console.error(e))
}

function editHandler(id) {
    // console.log(id);
    router.push({name:'editArt', params: {id}})
}

</script>

<style  scoped>
.setting-collapse {
    margin-top: 10px;
}
@media (max-width: 768px) {

}

</style>