import store from '@/store';
import apiConfig from '@/config/api';
import eventBus from "@/mixin/eventBus";
import Notification from "element-ui/packages/notification/src/main";

let graph = null;
export default {
    beforeMount() {
        eventBus.$on('afterAddPage', page => {
            graph = page.graph;
        })
    },

    initWebSocket() {
        this.websock = new WebSocket(apiConfig.WebSocketAPI);
        this.websock.onopen = this.websocketOnOpen;
        this.websock.onclose = this.websocketClose;
        this.websock.onerror = this.websocketOnError;
        this.websock.onmessage = this.websocketOnMessage;
    },

    websocketOnOpen() {

    },

    websocketOnError() {

    },

    websocketOnMessage(res) {
        const message = JSON.parse(res.data).msg;
        if (message === 'complete') {
            store.commit('app/SET_ISRUNNING', false);
            Notification({
                title: '成功',
                message: '项目运行成功',
                type: 'success',
                duration: 3000,
            });
        } else {
            const nodeId = message.nodeId;
            const status = message.status;
            const item = graph.findById(nodeId);
            const model = {
                status: status
            }
            graph.update(item, model);
        }
    },

    // eslint-disable-next-line no-unused-vars
    websocketClose(val) {
        if (this.websock) {
            this.websock.send(JSON.stringify({msg: 'close'}));
            this.websock = null;
        }
    },

    websocketSend(data) {
        this.websock.send(JSON.stringify({data}));
    },
}