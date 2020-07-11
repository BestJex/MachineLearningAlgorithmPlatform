import G6 from "@antv/g6/build/g6";
import hoverNode from './hover-node'
import addLine from './add-edge'
import dragItem from './drag-item'
import selectNode from './select-node'
import hoverEdge from "./hover-edge";
import keyboard from './keyboard'
import mulitSelect from './mulit-select'
import addMenu from './add-menu'
import canvasZoom from "./canvas-zoom"
import customEvents from "./custom-events"
import dragSelect from "./drag-select"

const behavors = {
    'hover-node': hoverNode,
    'add-edge': addLine,
    'drag-item': dragItem,
    'select-node': selectNode,
    'hover-edge': hoverEdge,
    'keyboard':keyboard,
    'mulit-select':mulitSelect,
    'add-menu':addMenu,
    'canvas-zoom':canvasZoom,
    'drag-select': dragSelect,
    'custom-events': customEvents
}

export function initBehavors() {
    for (let key in behavors) {
        G6.registerBehavior(key, behavors[key])
    }
}


