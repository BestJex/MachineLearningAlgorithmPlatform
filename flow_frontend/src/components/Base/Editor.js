import {uniqueId} from '@/utils';
import eventBus from "@/utils/eventBus";
import store from "@/store"

export default class Editor {
    constructor() {
        store.dispatch('app/uniqueId')
        this.id = store.state.app.max_id;
    }

    getGrpah() {
        return this.graph;
    }

    emit(event, params) {
        if (event === 'afterAddPage') {
            this.graph = params.graph;
        }
        eventBus.$emit(event, params);
    }

    on(event) {
        switch (event) {
            case 'changeNodeData':
                this.graph.refresh();
                break;
        }
    }

    add(type, item) {
        this.graph.add(type, item);
    }

    update(item, model) {
        this.graph.update(item, model);
    }

    remove(item) {
        const node = this.graph.findById(item.id);
        this.graph.remove(node);
    }
}