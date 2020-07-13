import {Notification} from 'element-ui'
import eventBus from '@/utils/eventBus'
import store from '@/store'
import configJS from '@/statics/config'

let graph = null
export default {
    beforeMount() {
        eventBus.$on('afterAddPage', page => {
            graph = page.graph;
        })
    },
    initWebSocket() {
        this.websock = new WebSocket(configJS.WS_API);
        this.websock.onopen = this.websocketOnOpen;
        this.websock.onerror = this.websocketOnError;
        this.websock.onmessage = this.websocketOnMessage;
        this.websock.onclose = this.websocketClose;
    },
    websocketOnOpen() {
        console.log("WebSocket连接成功！");
    },
    websocketOnError() {
        console.log("WebSocket出现错误！");
    },
    websocketOnMessage(res) {
        console.log("WebSocket接收message：", res);
        const msg = JSON.parse(res.data).msg;
        if (msg === 'complete') {
            store.commit('app/SET_ISRUNNING', false);
            Notification({
                title: '成功',
                message: '项目运行成功',
                type: 'success',
                duration: 3000,
            })
        } else {
            const nodeId = msg.nodeId;
            const status = msg.status;
            const item = graph.findById(nodeId);
            const model = {
                status: status
            };
            graph.update(item, model);
        }
    },
    websocketClose(val) {
        console.log("WebSocket关闭！");
        if (this.websock) {
            this.websock.send(JSON.stringify({msg: 'close'}));
            this.websock = null;
        }
    },
    websocketSend(data) {
        console.log("WebSocket发送message：", data);
        this.websock.send(JSON.stringify({data}));
    },
}