import request from '@/utils/request'

export default {
    uploadJson(data) {
        return request({
            url: '/upload_json',
            method: 'post',
            data
        })
    },

    getGraphs(data) {
        return request({
            url: '/graph/',
            method: 'get',
            params: data,
        })
    },

    getGraphById(data) {
        return request({
            url: '/loadgraph',
            method: 'get',
            params: data,
        })
    },

    createGraph(data) {
        return request({
            url: '/graph/',
            method: 'post',
            data,
        })
    },
	
    copyGraph(data) {
        return request({
            url: '/graph/copy',
            method: 'post',
            data
        })
    },

    deleteGraphs(data) {
        return request({
            url: '/graph/multiple_delete/',
            method: 'delete',
            params: data
        })
    },

    sendGraph(data) {
        return request({
            url: `/savegraph`,
            method: 'post',
            data
        })
    },

    runProject(data) {
        return request({
            url: '/run_project',
            method: 'put',
            data
        })
    },

    runNode(data) {
        return request({
            url: '/nodeinputcheck',
            method: 'post',
            data
        })
    },

    getOutputInfo(data) {
        return request({
            url: '/dataupload',
            method: 'get',
            params: data
        })
    }
}