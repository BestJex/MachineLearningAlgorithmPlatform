import fileApi from "@/api/file"
import graphApi from "@/api/graph"

const state = {
  is_focus_canvas: false,
  document_width: document.documentElement.clientWidth,
  document_height: document.documentElement.clientHeight,
  topbar_height: 42,
  canvas_width: document.documentElement.clientWidth - 400,
  canvas_height: document.documentElement.clientHeight - 42,
  detailpannel_width: 200,
  itempannel_width: 240,

  allow_drop: false,
  allow_save: true,
  selected_node_id: null,
  is_running: false,
  is_show_node_manage: false,

  file_list: [],
  node_list: [],
  category: [],

  is_show_preview: false,
  is_show_visual: false,
  is_show_echarts: false,

  max_id: 0,
  graph_id: 0
}

const mutations = {
  SET_ISFOCUSCANVAS: (state, is_focus_canvas) => {
    state.is_focus_canvas = is_focus_canvas
  },
  SET_DOCUMENTWIDTH: (state, document_width) => {
    state.document_width = document_width
  },
  SET_DOCUMENTHEIGHT: (state, document_height) => {
    state.document_height = document_height
  },
  SET_CANVASWIDTH: (state, canvas_width) => {
    state.canvas_width = canvas_width
  },
  SET_CANVASHEIGHT: (state, canvas_height) => {
    state.canvas_height = canvas_height
  },
  SET_DETAILPANNELWIDTH: (state, detailpannel_width) => {
    state.detailpannel_width = detailpannel_width
  },
  SET_ITEMPANNELWIDTH: (state, itempannel_width) => {
    state.itempannel_width = itempannel_width
  },
  SET_ALLOWDROP: (state, allow_drop) => {
    state.allow_drop = allow_drop
  },
  SET_ALLOWSAVE: (state, allow_save) => {
    state.allow_save = allow_save
  },
  SET_SETSELECTEDNODEID: (state, selected_node_id) => {
    state.selected_node_id = selected_node_id
  },
  SET_ISRUNNING: (state, is_running) => {
    state.is_running = is_running
  },
  SET_ISSHOWNODEMANAGE: (state, is_show_node_manage) => {
    state.is_show_node_manage = is_show_node_manage
  },
  SET_FILELIST: (state, file_list) => {
    state.file_list = file_list
  },
  SET_NODELIST: (state, node_list) => {
    state.node_list = node_list
  },
  SET_CATEGORY: (state, category) => {
    state.category = category
  },
  SET_ISSHOWPREVIEW: (state, is_show_preview) => {
    state.is_show_preview = is_show_preview
  },
  SET_ISSHOWVISUAL: (state, is_show_visual) => {
    state.is_show_visual = is_show_visual
  },
  SET_ISSHOWECHARTS: (state, is_show_echarts) => {
    state.is_show_echarts = is_show_echarts
  },
  SET_MAXID: (state, max_id) => {
    state.max_id = max_id
  },
  SET_GRAPHID: (state, graph_id) => {
    state.graph_id = graph_id
  }
}

const actions = {
  setIsFocusCanvas({ commit }, is_focus_canvas) {
    commit('SET_ISFOCUSCANVAS', is_focus_canvas)
  },
  setCanvasWidth({ commit }, canvas_width) {
    commit('SET_CANVASWIDTH', canvas_width)
  },
  setDetailPannelWidth({ commit, state }, detailpannel_width) {
    commit('SET_DETAILPANNELWIDTH', detailpannel_width)
    var canvas_width = document.documentElement.clientWidth - state.detailpannel_width - state.itempannel_width
    commit('SET_CANVASWIDTH', canvas_width)
  },
  setItemPannelWidth({ commit, state }, itempannel_width) {
    commit('SET_ITEMPANNELWIDTH', itempannel_width)
    var canvas_width = document.documentElement.clientWidth - state.detailpannel_width - state.itempannel_width
    commit('SET_CANVASWIDTH', canvas_width)
  },
  setDocument({ commit }, { document_width, document_height }) {
    commit('SET_DOCUMENTWIDTH', document_width)
    commit('SET_DOCUMENTHEIGHT', document_height)
    var canvas_width = document_width - state.detailpannel_width - state.itempannel_width
    var canvas_height = document_height - state.topbar_height
    commit('SET_CANVASWIDTH', canvas_width)
    commit('SET_CANVASHEIGHT', canvas_height)
  },
  getProjectFileList({ commit }, graphId) {
    fileApi.getProjectFileList({ graphId: graphId }).then(res => {
      commit('SET_FILELIST', res.data)
    })
  },
  getNodeList({ commit }) {
    graphApi.getNodeTemplate().then(res => {
      commit('SET_NODELIST', res.data)
    })
  },
  getCategory({ commit }) {
    graphApi.getCategory().then(res => {
      commit('SET_CATEGORY', res.data)
    })
  },
  uniqueId({ commit }) {
    return new Promise(resolve => {
      commit('SET_MAXID', state.max_id + 1)
      resolve(state.max_id + 1)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}