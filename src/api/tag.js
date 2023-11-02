import request from "../utils/request";

//
export function getCategory(params) {
    return request.request({
        method: 'get',
        url: '/tag/category',
        isToken:true,
        params
    })
}


// 
export function getTagList(params) {
    return request.request({
        method: 'get',
        url: '/tag/list',
        isToken:true,
        params
    })
}