import store from '@/store/index.js'

export default {
    getEvents() {
        return {
            'node:mouseover': 'onMouseover',
            'node:mouseleave': 'onMouseleave',
            'node:mousedown': 'onMousedown'
        }
    },
    onMouseover(e) {
        // console.log(e)
        const self = this
        const item = e.item
        const graph = self.graph
        const group = item.getContainer()
        group.find(g => {
            if (g._attrs.isOutPointText) {
                g.attr('opacity', 0.5)
            }
        })
        if (e.target._attrs.isOutPointOut || e.target._attrs.isOutPoint) {
            group.find(g => {
                if (g._attrs.isInPoint || g._attrs.isOutPoint) {
                    g.attr('fill', '#fff')
                    store.commit('app/SET_ISONCIRCLE', true)
                    // 拦截，防止给全局传空数据（本身机制问题）
                    if (e.target._attrs.parent) {
                        // console.log(e);
                        store.commit('app/SET_CIRCLEINFO', { id: e.target._attrs.parent })
                    }

                }
                if (g._attrs.isOutPoint) {
                    if (g._attrs.id === e.target._attrs.parent) {
                        group.find(gr => {
                            if (gr._attrs.id === g._attrs.id) {
                                gr.attr('fill', '#1890ff')
                                gr.attr('opacity', 1)
                            }
                        })
                    }
                    if (g._attrs.id === e.target._attrs.id) {
                        g.attr('fill', '#1890ff')
                        g.attr('opacity', 1)
                    }

                }
            })
            e.target.attr('cursor', 'crosshair')
            this.graph.paint()

        }
        if (item.hasState('selected')) {
            // return
        } else {
            if (self.shouldUpdate.call(self, e)) {
                graph.setItemState(item, 'hover', true)
            }
        }
        graph.paint()
    },
    onMouseleave(e) {
        const self = this
        const item = e.item
        const graph = self.graph
        const group = item.getContainer()
        group.find(g => {
            if (g._attrs.isOutPointText) {
                g.attr('opacity', 0)
            }
        })
        group.find(g => {
            if (g._attrs.isInPoint || g._attrs.isOutPoint) {
                g.attr('fill', '#fff')
                store.commit('app/SET_ISONCIRCLE', false)
                // store.commit('app/SET_CIRCLEINFO', null)
            }
        })
        if (self.shouldUpdate.call(self, e)) {
            if (!item.hasState('selected'))
                graph.setItemState(item, 'hover', false)
        }
        graph.paint()
    },
    onMousedown(e) {
        if (e.target._attrs.isOutPoint || e.target._attrs.isOutPointOut) {
            this.graph.setMode('addEdge')
        } else {
            // this.graph.setMode('moveNode')
        }
    },

}
