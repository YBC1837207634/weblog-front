import request from '../utils/request'

// 登陆记录查询
export function like(data) {
  return request.request({
    method: 'post',
    url: '/article/like',
    isToken: true,
    data
  })
}

export function isLike(articleId) {
  return request.request({
    method: 'get',
    url: `/article/like/query/${articleId}`,
    isToken: true
  })
}
