<template>
    <a-form ref="formRef" :size="'large'" :model="form" @submit-success="handleSubmitSuccess">
        <a-form-item field="nickname" label="昵称" :rules="[{ required: true, message: '昵称不为空' },{ minLength: 2, message: '不可小于2个字符' }, { maxLength: 100, message: '不可以超过100' }]">
            <a-input v-model="form.nickname" placeholder="输入昵称..." :max-length="100"/>
        </a-form-item>
        <a-form-item field="gender" label="性别"  :rules="[ {match:/.*/,message:'必须选择一个'}]">
            <a-radio-group v-model="form.gender" :default-value="'1'">
                <a-radio :value="'1'">男</a-radio>
                <a-radio :value="'2'">女</a-radio>
                <a-radio :value="'3'">保密</a-radio>
            </a-radio-group>
        </a-form-item>
        <a-form-item field="phone" label="手机号" :rules="[{ minLength: 11, message: '不可小于11个字符' }, { maxLength: 11, message: '不可以超过11' }]">
            <a-input v-model="form.phone" placeholder="输入手机号..." :max-length="11" />
        </a-form-item>
        <a-form-item field="email" label="邮箱" :rules="[{ minLength: 2, message: '不可小于2个字符' }, { maxLength: 128, message: '不可以超过128' }]">
            <a-input v-model="form.email" placeholder="输入邮箱..." />
        </a-form-item>
        <a-form-item  label="主页背景">
            <a-upload :onSuccess="onSuccess" :headers="{'token': getToken()}" multiple :action="setting.uploadUrl" :limit="1" @before-upload="beforeUpload"/>
        </a-form-item>
        <a-form-item field="description" label="个性签名" :rules="[{ maxLength: 255, message: '不可以超过255' }]">
            <a-textarea v-model="form.description" :max-length="255" allow-clear show-word-limit @onSuccess="onSuccess" />
        </a-form-item>
        <a-form-item>
            <a-button html-type="submit" >确定</a-button>
        </a-form-item>
    </a-form>
</template>

<script setup>
import setting from '@/config/setting'
import { getToken } from '@/utils/auth';
import { Message } from '@arco-design/web-vue';
import { onMounted, ref } from 'vue';
import { userInfo, updateUser } from '@/api/user';


var form = ref({})

onMounted(()=> {
    userInfo().then(res=>{
        if (res.code === 200) {
        form.value = res.data
    }
    })
})

function handleSubmitSuccess() {
    updateUser(form.value).then(res=>Message.success(res.msg))
}

function beforeUpload(file) {
    return new Promise((resolve, reject) => {
        const typeList = ['image/png', 'image/jpeg','image/gif']
        const isLt2M = file.size / 1024 / 1024 < 5;
        if (!typeList.includes(file.type)) {
            Message.error('只可以上传图片');
            reject()
        }
        if (!isLt2M) {
            Message.error('上传图片大小不能超过 5MB!');
            reject()
        }
        resolve(file)
      });
}

function onSuccess(res) {
    if (res.response.code === 200) {
        Message.success('上传成功！')
        form.value.background = res.response.msg
    } else {
        Message.error("上传失败，请重新上传")
    }
}


</script>

<style scoped></style>