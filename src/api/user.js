import request from '../utils/request'

// 登陆记录查询
export function login(data) {
  return request.request({
    method: 'post',
    url: '/login',
    isToken: false,
    data
  })
}

export function logout() {
  return request.request({
    method: 'get',
    url: '/logout',
    isToken: true
  })
}

export function register(data) {
  return request.request({
    method: 'post',
    url: '/register',
    isToken: false,
    data
  })
}

// 用户信息
export function userInfo() {
  return request.request({
    method: 'get',
    url: '/user/vo',
    isToken: true
  })
}

// 用户信息
export function getUser(id) {
  return request.request({
    method: 'get',
    url: `/user/vo/${id}`,
    isToken: true
  })
}

// 用户信息
export function getUserCards(params) {
  return request.request({
    method: 'get',
    url: `/user/cards`,
    isToken: true,
    params
  })
}

// 用户信息
export function updateUser(data) {
  return request.request({
    method: 'put',
    url: '/user',
    isToken: true,
    data
  })
}

// 修改密码
export function updatePassword(data) {
  return request.request({
    method: 'put',
    url: '/user/pwd',
    isToken: true,
    data
  })
}
