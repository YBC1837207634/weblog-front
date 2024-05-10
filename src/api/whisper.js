import request from '../utils/request'

// 获取聊天记录
export function getWhisperList(params) {
  return request.request({
    method: 'get',
    url: '/message/whisper/list',
    isToken: true,
    params
  })
}

export function getSessionRecord(params) {
  return request.request({
    method: 'get',
    url: '/message/session/record/list',
    isToken: true,
    params
  })
}

export function getSeesion(params) {
  return request.request({
    method: 'get',
    url: '/message/session/record/getSession',
    isToken: true,
    params
  })
}

export function removeSeesion(params) {
  return request.request({
    method: 'delete',
    url: '/message/session/record/delSession',
    isToken: true,
    params
  })
}
