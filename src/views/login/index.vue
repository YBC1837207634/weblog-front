<template>
  <div class="main">
    <div id="page" class="site">
      <div class="container">
        <div class="login">
          <div class="main">
            <a-form
              v-if="!reg"
              class="user-form"
              ref="formRef"
              size="middle"
              :layout="'vertical'"
              :model="form"
              @submit-success="handleSubmitSuccess"
              :label-align="'left'"
            >
              <a-form-item
                field="username"
                label="帐号"
                :rules="[
                  { required: true, message: '帐号不可为空' },
                  { minLength: 2, message: '帐号不可为空且不小于2个字符' }
                ]"
                :validate-trigger="['change', 'input']"
              >
                <input type="text" v-model="form.username" placeholder="帐号" />
              </a-form-item>
              <a-form-item
                field="password"
                label="密码"
                :rules="[
                  { required: true, message: '密码不可为空' },
                  { max: 30, message: '密码不可为空' }
                ]"
              >
                <input type="password" v-model="form.password" autocomplete placeholder="密码" />
              </a-form-item>
              <a-form-item>
                <!-- <a-button html-type="submit" :type="'primary'" >确定</a-button> -->
                <input type="submit" class="submit" value="登录" />
              </a-form-item>
            </a-form>
            <a-form
              v-else
              class="user-form"
              ref="formRef"
              size="middle"
              :layout="'vertical'"
              :model="form"
              @submit-success="registerHandler"
              :label-align="'left'"
            >
              <a-form-item
                field="username"
                label="帐号"
                :rules="[
                  { required: true, message: '帐号不可为空' },
                  { minLength: 2, message: '帐号不可为空且不小于2个字符' }
                ]"
                :validate-trigger="['change', 'input']"
              >
                <input type="text" v-model="form.username" placeholder="帐号" />
              </a-form-item>
              <a-form-item
                field="password"
                label="密码"
                :rules="[
                  { required: true, message: '密码不可为空' },
                  { max: 64, message: '密码大于64字符' }
                ]"
                :validate-trigger="['change', 'input']"
              >
                <input type="password" v-model="form.password" autocomplete placeholder="密码" />
              </a-form-item>
              <a-form-item
                field="code"
                label="动态码"
                :rules="[
                  { required: true, message: '动态码不可为空' },
                  { max: 6, message: '动态码不可为空' }
                ]"
              >
                <input type="text" v-model="form.code" placeholder="6位动态码" />
              </a-form-item>
              <a-form-item>
                <!-- <a-button html-type="submit" :type="'primary'" >确定</a-button> -->
                <input type="submit" class="submit" value="注册" />
              </a-form-item>
            </a-form>
            <div class="register">
              <p @click="reg = true" v-if="!reg">点击这里注册</p>
              <p @click="reg = false" v-if="reg">登录</p>
            </div>
            <!-- <form>
                            <p>
                                <input type="text" v-model="form.username"  placeholder="帐号">
                            </p>
                            <p class="password">
                                <input type="password" v-model="form.password" placeholder="密码">
                                <i class="ri-eye-off-line"></i>
                                <a href="#">注册</a>
                            </p>
                            <p>
                                <input type="submit" class="submit" @click="login" value="登录">
                            </p>
                        </form> -->
            <div class="options">
              <div class="separator">
                <p>使用其他方式登录</p>
              </div>
              <ul>
                <!-- <li><a href="#"><i class="ri-steam-fill ri-2x"></i></a></li>
                        <li><a href="#"><i class="ri-playstation-fill ri-2x"></i></a></li>
                        <li><a href="#"><i class="ri-xbox-fill ri-2x"></i></a></li> -->
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { Message } from '@arco-design/web-vue'
import { login, register } from '@/api/user'
import router from '@/router'

const reg = ref(false)

const form = ref({})

const route = useRoute()
const userStore = useUserStore()

function handleSubmitSuccess() {
  login(form.value)
    .then((res) => {
      if (res.token) {
        userStore.setToken(res.token)
        userStore.getUserInfo()
        if (route.query.redirect != null && route.query.redirect && route.query.redirect != '')
          location.replace(route.query.redirect)
        else {
          router.replace('/')
        }
        setTimeout(() => Message.success('登录成功！'), 100)
      }
    })
    .catch((e) => e)
}

function registerHandler() {
  register(form.value)
    .then((res) => {
      Message.success(res.msg)
      reg.value = false
      form.value = {}
    })
    .catch((e) => (form.value = {}))
}
</script>

<style scoped>
/* @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@500&display=swap'); */
/*用中文替换原先英文字体*/

* {
  margin: 0;
  padding: 0;
}

*,
::before::after {
  box-sizing: border-box;
}

.main {
  --primary-color: #4460f1;
  --white-color: #ffffff;

  --light-text-color: #9398b3;
  --light-bg-color: #f2f4ff;
  --dark-color: #333333;

  --background-color: #fcfcff;
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.8;
  color: var(--dark-color);
  background-color: var(--background-color);
  user-select: none;
  -webkit-user-drag: none;
}

a {
  text-decoration: none;
  color: inherit;
  -webkit-tap-highlight-color: transparent;
}

ul {
  list-style: none;
}

h1 {
  font-size: 3em;
  font-weight: 700;
  line-height: normal;
  color: black;
}

.site {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.container {
  max-width: 1000px;
  width: 100%;
  padding: 0 30px;
  margin: 0 auto;
}

.login {
  width: 400px;
  margin: 0 auto;
}

.hero {
  flex: 1 0 66.6666%;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 50px;
  padding: 70px 0;
}

.hero::before {
  content: '';
  position: absolute;
  top: 15%;
  left: 0;
  width: 280px;
  height: 100px;
  background: linear-gradient(to right, var(--primary-color), #c471ed, #f64f59);
  z-index: -1;
  filter: blur(70px);
}

.hero a {
  font-weight: 500;
  color: var(--primary-color);
  transition: color 0.3s;
}

.hero a:hover,
.user-form .password a:hover {
  color: var(--dark-color);
  text-decoration: underline;
}

.main {
  flex: 1 0 33.3333%;
}

.main .user-form {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.main .user-form label {
  position: relative;
}

.user-form input {
  font: inherit;
  font-size: 14px;
  width: 100%;
  border: 0;
  outline: 0;
  padding: 0 20px;
  line-height: 60px;
  border-radius: 10px;
  /*修复input 加入padding之后大小变化的问题*/
  box-sizing: border-box;
}

input::placeholder {
  color: var(--dark-color);
  font-family: 'Noto Sans SC', sans-serif;
  font-size: inherit;
}

.user-form input:not(.submit) {
  background-color: var(--light-bg-color);
}

.user-form .password i {
  position: absolute;
  top: calc(60px / 2);
  right: 20px;
  margin-top: -8px;
  line-height: 1;
  color: var(--light-text-color);
  cursor: pointer;
}

.user-form .password a {
  font-size: 13px;
  color: var(--light-text-color);
  float: right;
  margin: 5px 20px 0 0;
}

.user-form input.submit {
  font-weight: 700;
  color: var(--white-color);
  background-color: var(--primary-color);
  box-shadow: var(--primary-color) 0 20px 30px -10px;
  cursor: pointer;
  transition: box-shadow 0.3s;
}

.user-form input.submit:hover {
  box-shadow: var(--primary-color) 0 10px 30px -10px;
}

.separator {
  position: relative;
  margin: 50px 0 30px;
}

.separator::before {
  content: '';
  position: absolute;
  top: 50%;
  width: 100%;
  height: 1px;
  background-color: var(--light-text-color);
  opacity: 0.3;
  z-index: 1;
}

.separator p {
  font-size: 14px;
  width: fit-content;
  padding: 0 10px;
  color: var(--light-text-color);
  background-color: var(--background-color);
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.options ul {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.options ul li a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 10px;
  background-color: var(--white-color);
  box-shadow: var(--light-text-color) 0 10px 20px -10px;
  transition: all 0.3s ease-out;
}

.options ul li a:hover {
  color: var(--white-color);
  box-shadow: none;
}

/*用STEAM PSN XBOX替换原先APPLE GOOGLE FACEBOOK图标*/
.options ul li:nth-child(1) a:hover {
  background-color: #171a21;
}

.options ul li:nth-child(2) a:hover {
  background-color: #00439c;
}

.options ul li:nth-child(3) a:hover {
  background-color: #107c10;
}

@media (max-width: 720px) {
  .hero {
    display: none;
  }
}

.register {
  font-size: 10px;
  margin-top: 20px;
  text-align: right;
}
</style>
