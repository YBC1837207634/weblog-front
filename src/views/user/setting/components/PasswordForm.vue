<template>
    <a-form ref="formRef" :size="'large'" :model="form" @submit-success="handleSubmitSuccess" label-align="left">
        <a-form-item field="password" label="密码" :rules="[{ required: true, message: '密码不为空' }, { minLength: 4, message: '不可小于4个字符' }, { maxLength: 64, message: '不可以超过64' }]">
            <a-input-password v-model="form.password" placeholder="输入密码" :max-length="64" autocomplete  allow-clear/>
        </a-form-item>
        <a-form-item field="checkPassword" label="密码" :rules="[{ required: true, message: '密码不为空' }, { minLength: 4, message: '不可小于4个字符' }, { maxLength: 64, message: '不可以超过64' }]">
            <a-input-password v-model="form.checkPassword" placeholder="再次输入密码" :max-length="64"  allow-clear autocomplete />
        </a-form-item>
        <a-form-item>
            <a-button html-type="submit" :type="'primary'" >确定</a-button>
        </a-form-item>
    </a-form>
</template>

<script setup>
import { ref } from 'vue'
import { Message } from '@arco-design/web-vue';
import { updatePassword } from '@/api/user';
import { useUserStore } from '@/stores/user';
import router from '@/router';

var form = ref({})
const userStore = useUserStore()

function handleSubmitSuccess() {
    if (form.value.password === form.value.checkPassword) {
        delete form.value.checkPassword
        updatePassword(form.value).then(res=> {
            Message.success(res.msg)
            userStore.exit() 
            router.replace('/login')
        })
    } else {
        Message.error("两次密码不一致")
    }
    
}


</script>

<style  scoped>

</style>