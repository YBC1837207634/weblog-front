<script setup>
import './assets/css/reset.css'
import './assets/css/pb.css'

</script>

<template>
    <router-view v-slot="{ Component }">
        <keep-alive include="Layout">
            <component :is="Component" />
        </keep-alive>
    </router-view>
</template>

<style scoped>

</style>
