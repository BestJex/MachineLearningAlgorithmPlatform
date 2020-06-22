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
      params: data
    })
  },

  getGraphById(data) {
    return request({
      url: '/graph/',
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

  deleteGraphs(data) {
    return request({
      url: '/graph/multiple_delete/',
      method: 'delete',
      params: data
    })
  },

  sendGraph(data) {
    return request({
      url: `/graph/`,
      method: 'put',
      data
    })
  },

  getNodeTemplate() {
    return request({
      url: '/node_template/',
      method: 'get',
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
  }
}