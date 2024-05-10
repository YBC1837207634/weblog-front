import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from '@/utils/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../layout/index.vue'),
      meta: { title: '首页'},
      children: [
        {
          path: '',
          name: 'home',
          meta: { title: '首页'},
          component: () => import('../views/home/index.vue')
        },
        {
          path: 'article/:id',
          name: 'article',
          meta: {},
          component: () => import('../views/article/index.vue')
        },
        {
          path: '/search',
          name: 'search',
          meta: {title: '搜索' },
          component: () => import('@/views/search/index.vue')
        },
        {
          path: '/tag',
          name: 'tag',
          meta: {},
          component: () => import('@/views/tag/index.vue')
        },
        {
          path: 'user/:id',
          meta: {auth: true},
          component: () => import('../views/user/index.vue'),
          children: [
            {
              path: '',
              name: 'userDefault',
              meta: { auth: true },
              component: () => import('@/views/user/articlelist/index.vue')
            },
            {
              path: 'article',
              name: 'articleList',
              meta: { auth: true, title: '文章列表' },
              component: () => import('@/views/user/articlelist/index.vue')
            },
            {
              path: 'follow',
              name: 'followList',
              meta: { auth: true, title: '关注列表' },
              component: () => import('@/views/user/followlist/index.vue')
            },
            {
              path: 'cllect',
              name: 'cllectList',
              meta: { auth: true, title: '收藏列表' },
              component: () => import('@/views/user/cllectlist/index.vue')
            }
          ]
        },
        {
          path: 'user/setting',
          name: 'setting',
          meta: { auth: true, title: '设置' },
          component: () => import('@/views/user/setting/index.vue')
        },
        // 消息
        {
          path: 'message',
          redirect: '/404',
          meta: { auth: true, title: '消息中心' },
          component: () => import('@/views/message/index.vue'),
          children: [
            {
              // 我的消息
              path: 'whisper/:id',
              name: 'whisper',
              meta: { auth: true },
              component: () => import('@/views/message/whisper/index.vue')
            },
            {
              path: 'whisper',
              name: 'whisperHome',
              meta: { auth: true },
              component: () => import('@/views/message/whisper/index.vue')
            }
          ]
        }
      ]
    },

    {
      path: '/article/add',
      name: 'editAdd',
      meta: { auth: true, title: '文章发布' },
      component: () => import('../views/edit/index.vue')
    },
    {
      path: '/edit/:id',
      name: 'editArt',
      meta: { auth: true, title: '修改文章' },
      component: () => import('../views/edit/index.vue')
    },
    {
      path: '/login',
      name: 'login',
      meta: { title: '登录' },
      component: () => import('@/views/login/index.vue')
    },
    {
      path: '/404',
      name: 'notFund',
      meta: { title: '404' },
      component: () => import('@/views/error/404.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404'
    }
  ]
})

// 全局前置路由守卫
router.beforeEach((to, from, next) => {
  if (to.meta.title != null && to.meta.title) {
    document.title = to.meta.title
  }
  if (getToken() && to.name === 'login') {
    next({ replace: true, name: 'home' })
  } else if (to.meta.auth != null && to.meta.auth === true) {
    if (getToken()) {
      next()
    } else {
      next({ replace: true, path: '/login' })
    }
    // 没有登陆
  } else {
    next()
  }
})

export default router
