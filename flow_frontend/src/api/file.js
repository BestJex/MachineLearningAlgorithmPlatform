import request from '@/utils/request'

export default {
    deleteFile(data) {
        return request({
            url: '/filedelete',
            method: 'post',
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