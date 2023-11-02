<template>
    <div class="item">
        <a-card :title="title" hoverable :bordered="false">
            <template #extra>
                <a-link>更多</a-link>
            </template>
            <ul class="title-list">
                <ol v-for="data in dataList" :key="data.id">{{ data.title }}</ol>
            </ul>
        </a-card>
    </div>
</template>

<script setup>
defineProps({
    title: String,
    dataList: Array
})
</script>

<style scoped>
.item {
    margin-bottom: 10px;
    text-align: left;
}
.title-list > ol {
    padding: 8px 0px;
}
.title-list > ol:hover {
    background: #f7f8f9;
    cursor: pointer;
}
</style>