export default {
  getEvents() {
    return {
      'canvas:dragstart': 'ondblclick',
      'canvas:mouseup': 'onmouseout'
    }
  },
  ondblclick(e) {

  },
  onmouseout(e) {
    this.graph.setMode('default')
  }
}