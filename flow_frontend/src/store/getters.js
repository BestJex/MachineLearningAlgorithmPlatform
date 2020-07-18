const getters = {
    fileList: state => state.app.fileList,                  // 用户上传的文件列表
    graphName: state => state.app.graphName,                // 图的名字
    terminalDisplay: state => state.app.terminal_display,   // 控制台是否显示

    isFocusCanvas: state => state.app.is_focus_canvas,
    canvasWidth: state => state.app.canvas_width,
    canvasHeight: state => state.app.canvas_height - 62,
    detailWidth: state => state.app.detailpannel_width,
    itemWidth: state => state.app.itempannel_width,
    isAllowDrop: state => state.app.allow_drop,
    isAllowSave: state => state.app.allow_save,
    selectedNodeId: state => state.app.selected_node_id,
    isRunning: state => state.app.is_running,
    docWidth: state => state.app.document_width,
    docHeight: state => state.app.document_height,
    tbHeight: state => state.app.topbar_height,
    graphId: state => state.app.graph_id,
    terminalContent: state => state.app.terminalContent,
    operation: state => state.app.operation,
    clickNode: state => state.app.click_node,
    terminalHeight: state => state.app.terminal_height,
    runningComplete: state => state.app.running_complete,
    isOnCircle: state => state.app.is_on_circle,
    graphData: state => state.app.graph_data,
    circleInfo: state => state.app.circle_info,
    graphInfo: state => state.app.graph_info,

    token: state => state.user.token,
    userId: state => state.user.userId,
    username: state => state.user.username,
}
export default getters