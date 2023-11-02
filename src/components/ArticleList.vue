<template>
    <a-list 
        class="list-demo-action-layout" 
        :bordered="false" 
        :data="dataSource" 
        >
        <template #item="{ item }">
            <a-list-item class="list-demo-item" action-layout="vertical">
                <a-list-item-meta 
                    @click="clickHandler(item.id)"
                    :title="item.title" >
                    <template #description>
                        <div class="article-summary">
                            {{ item.summary }}
                        </div>
                    </template>
                </a-list-item-meta>
                <template #actions>
                    <span style=" font-weight: 600;">{{ item.author.nickname }}</span>
                    <span><icon-eye />{{ item.viewCounts }}</span>
                    <span><icon-thumb-up />{{ item.likeCount }}</span>
                    <span><icon-star />{{ item.collectCount }}</span>
                    <!-- <span><icon-message />{{ item.commentCounts }}</span> -->
                </template>
                <template #extra v-if="item.img != null && item.img != ''">
                    <div class="image-area">
                        <a-image
                            width="170"
                            :src="setting.baseUrl + item.img"
                        />
                    </div>
                    <div class="image-area-phone">
                        <a-image
                            width="150"
                            :src="setting.baseUrl + item.img"
                        />
                    </div>
                </template>
            </a-list-item>
        </template>
    </a-list>
</template>

<script setup>
import setting from '@/config/setting';
const props = defineProps({
   dataSource: Array,
});


function clickHandler(id) {
    window.open('/article/' + id, '_blank')
}


</script>

<style scoped>



/**
    列表样式
*/
.list-demo-action-layout {
    width: 100% !important;
}

.list-demo-item:hover {
    cursor: pointer;
    background: #f7f8f9;
}

.image-area > img {
    width: 100%;
}

.article-summary {
        overflow-wrap: break-word;
}

.image-area-phone {
    display: none;
}

@media (max-width: 768px) {

    .image-area {
        display: none;
    }
    .image-area-phone {
        display: block;
    }
    .article-summary {
        overflow-wrap: break-word;
    }
}
</style>