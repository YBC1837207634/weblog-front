import { defineStore } from 'pinia'
import { removeToken, setToken as sToken, getToken, getUid, removeUid, setUid } from '@/utils/auth'
import { userInfo } from '@/api/user'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      isLogin: false,
      user: {},
      token: '',
      id: ''
    }
  },
  // 也可以定义为
  // state: () => ({ count: 0 })
  actions: {
    async getUserInfo() {
      if (getToken())
        userInfo().then((res) => {
          if (res.code === 200) {
            this.id = res.data.id
            this.user = res.data
            this.isLogin = true
            this.token = getToken()
            setUid(this.id)
          }
        })
    },
    setToken(token) {
      this.token = token
      this.isLogin = true
      sToken(token)
    },
    exit() {
      ;(this.isLogin = false), (this.user = {}), (this.token = {}), (this.id = '')
      removeToken()
      removeUid()
    }
  },
  getters: {
    getToken: (state) => state.token,
    getUser: (state) => state.user,
    getid: (state) => {
      state.id === '' ? getUid() : state.id
    }
  }
})
