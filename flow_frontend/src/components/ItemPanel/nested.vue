<template>
  <div class>
    <div
      :draggable="!el.is_menu"
      :key="el.name"
      @dragend="el.is_menu ? '' : handleDragEnd($event, el)"
      @dragstart="el.is_menu ? '' : handleDragstart($event)"
      class="tree-node"
      tabindex="-1"
      v-for="(el, index) in tasks">
      <div
        :style="`padding-left: ${level * 18}px;`"
        @click="el.is_menu ? handleTreeNodeClick($event) : ''"
        class="tree-node__content">
        <i :class="el.is_menu ? '' : 'is-leaf'" class="tree-node__expand-icon el-icon-caret-bottom"></i>
        <span class="tree-node__label">{{ el.name }}</span>
      </div>
      <div class="tree-node__children">
        <nested-draggable :level="level + 1" :tasks="el.children" v-if="el.children" />
      </div>
    </div>
  </div>
</template>
<script>
import eventBus from '@/utils/eventBus'

export default {
  data() {
    return {
      page: null,
      command: null,
      offsetX: 0,
      offsetY: 0,
      is_expanded: true
    }
  },
  props: {
    tasks: {
      required: true,
      type: Array
    },
    level: {
      required: true,
      type: Number
    }
  },
  name: 'nested-draggable',
  created() {
    eventBus.$on('afterAddPage', page => {
      this.page = page
      this.command = page.command
    })
  },
  methods: {
    handleDragstart(e) {
      e.dataTransfer.effectAllowed = 'move'
      this.offsetX = e.offsetX
      this.offsetY = e.offsetY
    },
    handleDragEnd(e, item) {
      let data = {}
      Object.assign(data, item)
      data.offsetX = this.offsetX
      data.offsetY = this.offsetY
      if (this.page) {
        const graph = this.page.graph
        const xy = graph.getPointByClient(e.x, e.y)
        data.x = xy.x
        data.y = xy.y
        data.size = item.size.split('*')
        data.type = 'node'
        this.command.executeCommand('add', [data])
      }
    },
    handleTreeNodeClick(e) {
      e.target.classList.toggle('is_expanded')
      this.is_expanded = !this.is_expanded
    }
  }
}
</script>

<style lang="scss" scoped>
.dragArea {
  min-height: 50px;
  outline: 1px dashed;
}
.tree-node {
  white-space: nowrap;
  outline: 0;
  .tree-node__content {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    height: 26px;
    cursor: pointer;
    &:hover {
      background-color: #fff;
    }
    .tree-node__expand-icon {
      padding: 6px;
    }
    .is-leaf {
      color: transparent;
      cursor: default;
    }
  }
  &:focus > .tree-node__content {
    background-color: #fff;
  }
  .tree-node__label {
    font-size: 14px;
  }
  .tree-node__content.is-expanded + .tree-node__children {
    display: none;
  }
}
.drag-me {
  cursor: move;
  &:active {
    cursor: move;
  }
  &:before {
    content: '.';
    position: absolute;
    left: 14px;
    font-size: 20px;
    line-height: 20px;
  }
}
</style>