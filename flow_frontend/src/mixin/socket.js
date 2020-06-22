import { Notification } from 'element-ui'
import eventBus from '@/utils/eventBus'
import store from '@/store'
import configJS from '@/statics/config'

let graph = null
export default {
  beforeMount() {
    console.log('before mount')
    eventBus.$on('afterAddPage', page => {
      graph = page.graph
    })
  },
  initWebSocket() {
    this.websock = new WebSocket(configJS.WS_API)
    this.websock.onopen = this.websocketOnOpen
    this.websock.onerror = this.websocketOnError
    this.websock.onmessage = this.websocketOnMessage
    this.websock.onclose = this.websocketClose
  },
  websocketOnOpen() {
    console.log('websocket connected')
  },
  websocketOnError() {
    console.log('websocket error')
  },
  websocketOnMessage(res) {
    var msg = JSON.parse(res.data).msg
    if (msg === 'complete') {
      store.commit('app/SET_ISRUNNING', false)
      Notification({
        title: '成功',
        message: '项目运行成功',
        type: 'success',
        duration: 3000
      })
    } else {
      var nodeId = msg.nodeId
      var status = msg.status
      var item = graph.findById(nodeId)
      const model = {
        status: status
      }
      graph.update(item, model)
    }
  },
  websocketClose(val) {
    if (this.websock) {
      this.websock.send(JSON.stringify({ msg: 'close' }))
      this.websock = null
      console.log('websocket disconnect')
    }
  },
  websocketSend(data) {
    this.websock.send(JSON.stringify({ data }))
  }
}