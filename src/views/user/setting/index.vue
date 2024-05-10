<template>
  <div class="setting-container">
    <a-tabs style="width: 100%" animation :size="'large'" destroy-on-hide>
      <a-tab-pane key="1">
        <template #title> <icon-calendar /> 个人信息 </template>
        <UserForm></UserForm>
      </a-tab-pane>
      <a-tab-pane key="2">
        <template #title> <icon-clock-circle /> 账号设置 </template>
        <PasswordForm></PasswordForm>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup>
import UserForm from './components/UserForm.vue'
import PasswordForm from './components/PasswordForm.vue'
</script>

<style scoped>
.setting-container {
  width: 800px;
  padding: 0 20px;
  margin: 0 auto;
  box-sizing: border-box;
  background-color: #fff;
}

.menu {
  width: 100%;
}

@media (max-width: 768px) {
  .setting-container {
    width: 100vw;
    padding: 0 10px;
  }
}
</style>
