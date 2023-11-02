<template>
        <div class="container">
        <div class="img">
            <img src="../../assets/404Img.svg" width="500">
        </div>
        <div class="info">
            <h1>404</h1>
            <h3>访问的页面不存在</h3>
            <a-button round type="primary" @click="goHome" size="medium">回到首页</a-button>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter()
function goHome() {
    router.replace('/')
}
</script>

<style scoped>


.container {
    padding: 20px 20px;
}
.img {
    display: flex;
    
}
.img > img {
    margin: auto;
}
.info {
    text-align: center;
}

</style>


<script>
    export default {
        methods: {
            
        }
    }
</script>

