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
    changePassword(data) {
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
            params: data,
        })
    },
    changeInformation(data) {
        return request({
            url: '/user/chainformation',
            method: 'post',
            data,
        })
    },
    file(data) {
        return request({
            url: '/fileinf',
            method: 'get',
            params: data,
        })
    },
    filelist(data) {
        return request({
            url: '/filelistall',
            method: 'get',
            params: data,
        })
    },
}