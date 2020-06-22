import request from '@/utils/request'

export default {
    deleteFile(data) {
        return request({
            url: '/upload_file',
            method: 'delete',
            params: data
        })
    },
    isFilenamehValid(data) {
        return request({
            url: '/is_filename_valid',
            method: 'POST',
            data
        })
    },
    getProjectFileList(data) {
        return request({
            url: '/project_file_list',
            method: 'GET',
            params: data
        })
    },
    previewCsv(data) {
        return request({
            url: '/preview_csv',
            method: 'GET',
            params: data
        })
    },
    previewEcharts(data) {
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
    }
}