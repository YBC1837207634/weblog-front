import request from '../utils/request'

// 分页查询
export function page(params) {
  return request.request({
    method: 'get',
    url: '/article/list',
    isToken: true,
    params
  })
}

export function getArticleContent(id) {
  return request.request({
    method: 'get',
    url: `/article/content/${id}`,
    isToken: true
  })
}

export function saveArticle(data) {
  return request.request({
    method: 'post',
    url: `/article`,
    isToken: true,
    data
  })
}

export function updateArticle(data) {
  return request.request({
    method: 'put',
    url: `/article`,
    isToken: true,
    data
  })
}

export function removeArticle(ids) {
  return request.request({
    method: `delete`,
    url: `/article/${ids}`,
    isToken: true
  })
}

export function searchArticle(params) {
  return request.request({
    method: 'get',
    url: '/article/search',
    isToken: true,
    params
  })
}
