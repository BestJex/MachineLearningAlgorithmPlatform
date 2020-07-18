import fileApi from '@/api/file'
import graphApi from '@/api/graph'
import {Message} from "element-ui";

const state = {
    fileList: [],               // 用户上传的所有文件
    graphName: null,            // 图名
    terminal_display: 'none',   // 运行项目控制台显示
    graph_data: [],             // 图信息(节点和指针）
    graph_info: {},             // 整张图的信息

    is_focus_canvas: false,
    document_width: document.documentElement.clientWidth,
    document_height: document.documentElement.clientHeight,
    topbar_height: 42,
    canvas_width: document.documentElement.clientWidth - 400,
    canvas_height: document.documentElement.clientHeight - 42,
    detailpannel_width: 200,
    itempannel_width: 250,
    terminal_height: 270,

    allow_drop: false,
    allow_save: true,
    selected_node_id: null,
    is_running: false,  // 是否在跑算法
    running_complete: false, // 算法是否跑完了
    is_show_node_manage: false,
    node_list: [],

    max_id: 0,
    graph_id: 0,  // 项目id

    terminalContent: '',
    operation: false,
    clickNode: null,
    is_on_circle: false, // 判断鼠标是否在节点的输入输出圈上
    circle_info: null, // 输出结果
}

const mutations = {
    // 设置用户上传的所有文件
    SetFileList: (state, fileList) => {
        state.fileList = fileList
    },
    // 设置用户选中的图名
    SetGraphName: (state, graphName) => {
        state.graphName = graphName
    },
    SET_TERMINALDISPLAY: (state, terminal_display) => {
        state.terminal_display = terminal_display
    },
    SET_TERMINALCONTENT: (state, terminalContent) => {
        state.terminalContent += terminalContent
    },

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
    SET_NODELIST: (state, node_list) => {
        state.node_list = node_list
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
    },
    SET_OPERATION: (state, operation) => {
        state.operation = operation
    },
    SET_CLICKNODE: (state, click_node) => {
        state.click_node = click_node
    },
    SET_TERMINALHEIGHT: (state, terminal_height) => {
        state.terminal_height = terminal_height
    },
    SET_RUNNINGCOMPLETE: (state, running_complete) => {
        state.running_complete = running_complete
    },
    SET_ISONCIRCLE: (state, is_on_circle) => {
        state.is_on_circle = is_on_circle
    },
    SET_GRAPHDATA: (state, graph_data) => {
        state.graph_data = graph_data
    },
    SET_GRAPHINFO: (state, graph_info) => {
        state.graph_info = graph_info
    },
    SET_CIRCLEINFO: (state, circle_info) => {
        state.circle_info = circle_info
    },

}

const actions = {
    getFileList({commit}) {
        fileApi.getFile({username: localStorage.getItem('username')}).then(response => {
            let fileList = response.data.list
            for (let i = 0; i < fileList.length; i++) {
                let item = fileList[i]
                let TIndex = item.buildtime.indexOf('T')
                let pointIndex = item.buildtime.indexOf('.')
                item.buildtime = item.buildtime.substring(0, TIndex) + ' ' + item.buildtime.substring(TIndex + 1, pointIndex)
                item.size = (parseInt(item.size) / 1024).toFixed(2) + 'KB'
            }
            commit('SetFileList', fileList)
        }).catch(error => {
            Message({
                message: error,
                type: 'error',
                duration: 3 * 1000
            })
        })
    },
    setIsFocusCanvas({commit}, is_focus_canvas) {
        commit('SET_ISFOCUSCANVAS', is_focus_canvas)
    },
    setCanvasWidth({commit}, canvas_width) {
        commit('SET_CANVASWIDTH', canvas_width)
    },
    setDetailPannelWidth({commit, state}, detailpannel_width) {
        commit('SET_DETAILPANNELWIDTH', detailpannel_width)
        var canvas_width = document.documentElement.clientWidth - state.detailpannel_width - state.itempannel_width
        commit('SET_CANVASWIDTH', canvas_width)
    },
    setItemPannelWidth({commit, state}, itempannel_width) {
        commit('SET_ITEMPANNELWIDTH', itempannel_width)
        var canvas_width = document.documentElement.clientWidth - state.detailpannel_width - state.itempannel_width
        commit('SET_CANVASWIDTH', canvas_width)
    },
    setDocument({commit}, {document_width, document_height}) {
        commit('SET_DOCUMENTWIDTH', document_width)
        commit('SET_DOCUMENTHEIGHT', document_height)
        var canvas_width = document_width - state.detailpannel_width - state.itempannel_width
        var canvas_height = document_height - state.topbar_height
        commit('SET_CANVASWIDTH', canvas_width)
        commit('SET_CANVASHEIGHT', canvas_height)
    },
    uniqueId({commit}) {
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