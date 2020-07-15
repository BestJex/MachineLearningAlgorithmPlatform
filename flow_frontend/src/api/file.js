import request from '@/utils/request'

export default {
    getFile(data) {
        return request({
            url: '/filelistall',
            method: 'GET',
            params: data,
        })
    },
    deleteFile(data) {
        return request({
            url: '/filedelete',
            method: 'POST',
            data
        })
    },
    isFileNameValid(data) {
        return request({
            url: '/is_filename_valid',
            method: 'POST',
            data
        })
    },
}