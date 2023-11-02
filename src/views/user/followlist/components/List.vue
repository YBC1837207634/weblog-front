<template>
    <div>
        <a-list :bordered="false">
            <a-list-item v-for="idx in 4" :key="idx">
                <a-list-item-meta title="名称"
                    description="Beijing ByteDance Technology Co., Ltd. is an enterprise located in China.">
                    <template #avatar>
                        <a-avatar shape="square">
                            <img alt="avatar"
                                src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp" />
                        </a-avatar>
                    </template>
                </a-list-item-meta>
                    <template #actions>
                        <a-dropdown-button size="medium">
                            已关注
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
    </div>
</template>

<script setup>

</script>

<style scoped></style>