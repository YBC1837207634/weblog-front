import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from '@/utils/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../layout/index.vue'),
      meta: {},
      children: [
        {
          path: '',
          name: 'home',
          meta: {},
          component: () => import('../views/home/index.vue'),
        },
        {
          path: 'article/:id',
          name: 'article',
          component: () => import('../views/article/index.vue'),
        },
        {
          path: 'user/:id',
          name: 'user',
          meta: {auth: true},
          component: () => import('../views/user/index.vue'),
          children: [
            {
              path: 'article',
              name: 'articleList',
              meta: { auth: true},
              component: () => import('@/views/user/articlelist/index.vue')
            }, 
            {
              path: 'follow',
              name: 'followList',
              meta: { auth: true, title: '关注列表'},
              component: () => import('@/views/user/followlist/index.vue')
            },
            {
              path: 'cllect',
              name: 'cllectList',
              meta: { auth: true},
              component: () => import('@/views/user/cllectlist/index.vue')
            }

          ]
        },
        {
          path: 'user/setting',
          name: 'setting',
          meta: {auth: true},
          component: () => import('@/views/user/setting/index.vue')
        }
      ]
    },
    {
      path: '/article/add',
      name: 'editAdd',
      meta: {auth: true},
      component: () => import('../views/edit/index.vue'),
    },
    {
      path: '/edit/:id',
      name: 'editArt',
      meta: {auth: true},
      component: () => import('../views/edit/index.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue')
    },
    {
      path: '/404',
      name: 'notFund',
      component: () => import('@/views/error/404.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404'
    }
    
  ]
})

// 全局前置路由守卫
router.beforeEach((to, from, next)=>{
  if (getToken() && to.name === 'login') {
    next({replace: true, name: 'home'})
  } else if (to.meta.auth != null && to.meta.auth === true) {
      if (getToken()) {
        next()
      } else {
        next({replace: true, path: '/login'})
      }
      // 没有登陆
  } else {
    next()
  }
})


export default router
