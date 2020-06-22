import eventBus from "@/utils/eventBus"
// eslint-disable-next-line no-unused-vars
import { uniqueId } from '@/utils'
import store from "@/store"
let startPoint = null
let startPointId = null
let startItem = null
let endPoint = {}
let activeItem = null
let curInPoint = null
export default {
    getEvents() {
        return {
            mousemove: 'onMousemove',
            mouseup: 'onMouseup',
            'node:mouseover': 'onMouseover',
            'node:mouseleave': 'onMouseleave'
        }
    },
    onMouseup(e) {
        // todo 去重
        const item = e.item
        if (item && item.getType() === 'node') {
            const group = item.getContainer()
            if (e.target._attrs.isInPoint) {
                const children = group._cfg.children
                children.map(child => {
                    if (child._attrs.isInPointOut && child._attrs.parent === e.target._attrs.id) {
                        activeItem = child
                    }
                })
                curInPoint = e.target
            } else if (e.target._attrs.isInPointOut) {
                activeItem = e.target
                const children = group._cfg.children
                children.map(child => {
                    if (child._attrs.isInPoint && child._attrs.id === e.target._attrs.parent) {
                        curInPoint = child
                    }
                })
            }
            if (curInPoint) {
                // 判断该入点是否已经被连接
                var t_edges = this.graph.findAll('edge', edge => {
                    return edge.getModel().endPointId === curInPoint._attrs.id
                })
                // 判断该入点是否是该node的入点
                var is_inpoint_in_startNode = curInPoint._cfg.parent.get('item') === startItem

                if (!t_edges.length && activeItem && !is_inpoint_in_startNode) {
                    const endX = parseInt(curInPoint._attrs.x)
                    const endY = parseInt(curInPoint._attrs.y)
                    endPoint = { x: endX, y: endY }
                    if (this.edge) {
                        this.graph.removeItem(this.edge)
                        store.dispatch('app/uniqueId')
                        const model = {
                            id: 'edge' + store.state.app.max_id,
                            source: startItem,
                            target: item,
                            // sourceId: startItem._cfg.id,
                            // targetId: item._cfg.id,
                            start: startPoint,
                            end: endPoint,
                            startPointId: startPointId,
                            endPointId: curInPoint._attrs.id,
                            shape: 'customEdge',
                            type: 'edge'
                        }
                        // eslint-disable-next-line no-console
                        console.log('add item')
                        eventBus.$emit('addItem', model)
                    }
                } else if (this.edge) {
                    this.graph.removeItem(this.edge)
                }
            } else if (this.edge) {
                this.graph.removeItem(this.edge)
            }
        } else if (this.edge) {
            this.graph.removeItem(this.edge)
        }
        this.graph.find("node", node => {
            const group = node.get('group')
            const children = group._cfg.children
            children.map(child => {
                if (child._attrs.isInPointOut) {
                    child.attr("opacity", "0")
                    child._attrs.fillStyle = '#1890ff'
                }
                if (child._attrs.isInPoint) {
                    child.attr("opacity", "0")
                }
                if (child._attrs.isOutPoint) {
                    child.attr("opacity", "0")
                    child.attr("fill", "#fff")
                }
                if (child._attrs.isOutPointText) {
                    child.attr('opacity', 0)
                }
            })
        })
        if (startItem) {
            this.graph.setItemState(startItem, 'hover', false)
        }

        this.graph.paint()
        startPoint = null
        startPointId = null
        startItem = null
        endPoint = {}
        activeItem = null
        curInPoint = null
        this.graph.setMode('default')
    },
    onMousemove(e) {
        const item = e.item
        if (!startPoint && e.target._attrs.isOutPoint) {
            const startX = parseInt(e.target._attrs.x)
            const startY = parseInt(e.target._attrs.y)
            startPoint = { x: startX, y: startY }
            startPointId = e.target._attrs.parent ? e.target._attrs.parent : e.target._attrs.id
            // eslint-disable-next-line no-console
            console.log(e.target, startPoint);
            startItem = item
            this.graph.find("node", node => {
                const group = node.get('group')
                const children = group._cfg.children
                children.map(child => {
                    // 为连接点设置样式，已经连接过的入点显示红色
                    var c_item = child._attrs
                    if (c_item.isInPointOut) {
                        child.attr("opacity", "0.3")
                    }
                    if (c_item.isInPoint) {
                        child.attr("opacity", "1")
                    }
                    if (child._cfg.parent.get('item') === startItem) {
                        if (c_item.isInPointOut || c_item.isInPoint) {
                            child.attr('opacity', '0')
                        }
                    }
                    if (c_item.isInPoint || c_item.isInPointOut) {
                        this.graph.find('edge', edge => {
                            var t_endPointId = edge.getModel().endPointId
                            if (c_item.id === t_endPointId || c_item.parent === t_endPointId) {
                                if (c_item.isInPointOut) {
                                    child.attr('opacity', '0')
                                } else {
                                    child.attr('opacity', '0')
                                }
                            }
                        })
                    }
                })
            })
            this.edge = this.graph.addItem('edge', {
                source: item,
                target: item,
                start: startPoint,
                end: startPoint,
                shape: 'link-edge'
            })
        } else {
            const point = { x: e.x, y: e.y }
            if (this.edge) {
                // 增加边的过程中，移动时边跟着移动
                this.graph.updateItem(this.edge, {
                    //  start: startPoint,
                    target: point
                })
            }
        }
    },
    onMouseover(e) {
        const item = e.item
        if (item && item.getType() === 'node') {
            if (e.target._attrs.isInPointOut && !this.hasTran) {
                e.target.transform([
                    ['t', 0, 3],
                    ['s', 1.2, 1.2],
                ])
                this.hasTran = true
            }
            this.graph.paint()
        }
    },
    onMouseleave() {
        this.graph.find("node", node => {
            const group = node.get('group')
            const children = group._cfg.children
            children.map(child => {
                if (child._attrs.isInPointOut) {
                    child.resetMatrix()
                }
            })
        })
        this.hasTran = false
        this.graph.paint()
    }
}
