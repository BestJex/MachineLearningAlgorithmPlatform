export default {
  getEvents() {
    return {
      'canvas:dragstart': 'ondblclick',
      'canvas:mouseup': 'onmouseout'
    }
  },
  ondblclick(e) {
    console.log('drag start')
  },
  onmouseout(e) {
    this.graph.setMode('default')
  }
}