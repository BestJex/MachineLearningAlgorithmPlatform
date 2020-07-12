const getters = {
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
  isShowPreview: state => state.app.is_show_preview,
  isShowVisual: state => state.app.is_show_visual,
  isShowEcharts: state => state.app.is_show_echarts,
  graphId: state => state.app.graph_id,
  terminalDisplay: state => state.app.terminal_display,
  operation: state => state.app.operation,
  token: state => state.user.token,
  username: state => state.user.username
}
export default getters