import request from '@/config/request';

export default {
    captcha(data) {
        return request({
            url: '/user/captcha',
            method: 'get',
            params: data,
        })
    },
    login(data) {
        return request({
            url: '/user/login',
            method: 'post',
            data,
        })
    },
    register(data) {
        return request({
            url: '/user/register',
            method: 'post',
            data,
        })
    },
    retrieve(data) {
        return request({
            url: '/user/chapassword',
            method: 'post',
            data,
        })
    },
    information(data) {
        return request({
            url: '/user/information',
            method: 'get',
            data,
        })
    },
    changeInformation(data) {
        return request({
            url: '/user/chainformation',
            method: 'get',
            data,
        })
    },
}