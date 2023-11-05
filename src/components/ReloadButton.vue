<template>
    <div class="backtop" ref="backtopBtn" @click="reload">
        <icon-sync v-if="!loading" />  
        <icon-loading v-else /> 
    </div>

</template>

<script setup>
import { ref } from 'vue';
const emits = defineEmits(['reload'])

let loading = ref(false)
let click = ref(true)

function reload() {
    loading.value = true
    click.value = false
    emits('reload')
    setTimeout(()=>{
        loading.value = false
        click.value = true
    }, 300)
}

</script>

<style scoped>

.backtop {
    position: fixed;
    right: 20px;
    bottom: 80px;
    z-index: 1010;
    font-size: 16px;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background-color: rgb(255, 255, 255);
    text-align: center;
    line-height: 40px;
    box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid rgba(0,0,0,.08);
    cursor: pointer;
    /* display: none; */
}

.backtop:hover {
    box-shadow: 0px 0px 6px rgb(0 21 41 / 35%);
    transition: all .28s;
}
</style>