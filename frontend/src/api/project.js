import request from "@/config/request";

export default {
    deleteFile(data) {
        return request({
            url: '/upload_file',
            method: 'delete',
            params: data
        })
    },
    isFileNameValid(data) {
        return request({
            url: '/is_filename_valid',
            method: 'POST',
            data
        })
    },
    previewCsv(data) {
        return request({
            url: '/preview_csv',
            method: 'GET',
            params: data
        })
    },
    previewECharts(data) {
        return request({
            url: '/preview_echarts',
            method: 'GET',
            params: data
        })
    },
    isPreviewValid(data) {
        return request({
            url: '/is_preview_valid',
            method: 'GET',
            params: data
        })
    },
    createNode(data) {
        return request({
            url: '/create_node',
            method: 'post',
            data
        })
    },
    uploadJson(data) {
        return request({
            url: '/upload_json',
            method: 'post',
            data
        })
    },
    getProjects(data) {
        return request({
            url: '/graph/',
            method: 'get',
            params: data
        })
    },
    getGraphById(data) {
        return request({
            url: '/loadgraph',
            method: 'get',
            params: data
        })
    },
    createGraph(data) {
        return request({
            url: '/graph/',
            method: 'post',
            data
        })
    },
    copyGraph(data) {
        return request({
            url: '/graph/copy',
            method: 'post',
            data
        })
    },
    deleteProjects(data) {
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
            url: '/run_node',
            method: 'put',
            data
        })
    },
    getCategory() {
        return request({
            url: '/category/',
            method: 'get'
        })
    },
}