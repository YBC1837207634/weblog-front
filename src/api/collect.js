import request from '../utils/request'

// 新增收藏夹
export function createFavorites(data) {
  return request.request({
    method: 'post',
    url: '/favorites/add',
    isToken: true,
    data
  })
}

// 修改收藏夹
export function updateFavorites(data) {
  return request.request({
    method: 'post',
    url: '/favorites/edit',
    isToken: true,
    data
  })
}

// 添加 删除 收藏项
export function updateItem(data) {
  return request.request({
    method: 'post',
    url: '/favorites',
    isToken: true,
    data
  })
}

// 删除收藏夹
export function deleteFavorites(id) {
  return request.request({
    method: 'delete',
    url: `/favorites/${id}`,
    isToken: true
  })
}

// 根据收藏夹查询
export function getItemList(params) {
  return request.request({
    method: 'get',
    url: '/favorites/item/list',
    isToken: true,
    params
  })
}

// 收藏夹列表
export function getFavoritesList(params) {
  return request.request({
    method: 'get',
    url: '/favorites/list',
    isToken: true,
    params
  })
}

// 查询是否收藏
export function queryFavorites(params) {
  return request.request({
    method: 'get',
    url: '/favorites/query',
    isToken: true,
    params
  })
}
