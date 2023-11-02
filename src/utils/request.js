import axios from "axios"
import { getToken } from "./auth"
import setting from '../config/setting'
import { Message } from '@arco-design/web-vue';
import { useUserStore } from '@/stores/user'
import router from "@/router";

export default (function() {
  var req = axios.create({
    // baseURL: '/',
    baseURL: setting.baseUrl,
    timeout: 10000,
  })

  req.interceptors.request.use(function (config){
    if (config.isToken && getToken()) {
      config.headers.token = getToken()
    }
    return config
  })

  req.interceptors.response.use((res) => {
    const userStore = useUserStore()
      if (res.status != 200) {
        Message.error("error")
        return Promise.reject('error')
      }
      let state = res.data.code
      let msg = res.data.msg
      if (state === 200 || res.data instanceof Blob) {
        return res.data
        // 登陆失效
      } else if (state === 401) { 
        // 防止多次退出
          if(getToken()) {
            Message.error('令牌失效，重新登录')
            userStore.exit()
            router.replace('/')
            // '令牌失效，请重新登录！'
          }
      } else if (state === 406){
        router.replace({name:'home'})
      } else {
        Message.error(msg)
        return Promise.reject(res)
      }
  })
  
  return req

}())

