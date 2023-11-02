import request from "../utils/request";

//
export function upload(data) {
    return request.request({
        method: 'post',
        url: '/file',
        isToken:true,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data
    })
}