<template>
    <TopNav></TopNav>
    <!-- 版心 -->
    <div class="container">
        <router-view/>
    </div>
    <ButtonWrap></ButtonWrap>
</template>

<script setup>
import TopNav from './components/TopNav.vue'
import ButtonWrap  from '@/components/ButtonWrap.vue';
defineOptions({
    name: 'Layout'
})

</script>

<style scoped>
.container {
    width: 100%;
    padding-top: 20px;
}
</style>