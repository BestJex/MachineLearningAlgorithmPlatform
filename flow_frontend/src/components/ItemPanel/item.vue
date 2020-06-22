<template>
  <div>
    <el-tree
      :allow-drag="allowDrag"
      :allow-drop="allowDrop"
      :data="nodeList"
      :props="defaultProps"
      @node-drag-end="handleElDragEnd"
      @node-drag-start="handleElDragStart"
      default-expand-all
      draggable
    ></el-tree>
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus'
import bgImg from '@/assets/bg.jpg'
import item from '@/statics/item'
import { mapGetters } from 'vuex'
import graphApi from '@/api/graph';
export default {
  data() {
    return {
      page: null,
      command: null,
      offsetX: 0,
      offsetY: 0,
      tree_list: item.tree_list,

      defaultProps: {
        children: 'children',
        label: 'name'
      },
    }
  },
  computed: {
    ...mapGetters(['isAllowDrop', 'nodeList'])
  },
  created() {
    this.bindEvent()
  },
  methods: {
    handleElDragStart(node, e) {
      this.offsetX = e.offsetX
      this.offsetY = e.offsetY
    },
    handleElDragEnd(node, _node, p, e) {
      if (this.isAllowDrop) {
        const item = JSON.parse(JSON.stringify(node.data))
        item.template_id = item.id
        let data = {}
        Object.assign(data, item)
        // data.offsetX = this.offsetX
        // data.offsetY = this.offsetY
        if (this.page) {
          const graph = this.page.graph
          // const size = e.target.dataset.size.split("*");
          const xy = graph.getPointByClient(e.x, e.y)
          data.x = xy.x
          data.y = xy.y
          data.size = item.size.split('*').map(Number)
          data.type = 'node'
          this.command.executeCommand('add', [data])
        }
        this.$store.commit('app/SET_ALLOWDROP', false)
      }
    },
    allowDrag(node) {
      return !node.data.is_menu
    },
    allowDrop(node, _node, type) {
      return false
    },
    bindEvent() {
      eventBus.$on('afterAddPage', page => {
        this.page = page
        this.command = page.command
      })
    }
  }
}
</script>

<style lang="scss">
.itempannel {
  .el-tree {
    background: #f6f9fc;
    .el-tree-node__content {
      background: #f6f9fc;
      &:hover {
        background: rgba(0, 0, 0, 0.05);
        color: rgb(51, 51, 51);
      }
    }
    .el-tree-node {
      &:focus {
        background: rgba(0, 0, 0, 0.05);
      }
      &:focus > .el-tree-node__content {
        background: rgba(0, 0, 0, 0.05);
      }
    }
  }
}
</style>

<style scoped>
.itempannel {
  height: 100%;
  position: absolute;
  left: 0px;
  z-index: 2;
  background: #f7f9fb;
  width: 200px;
  padding-top: 8px;
  border-right: 1px solid #e6e9ed;
}
.itempannel ul {
  padding: 0px;
  padding-left: 16px;
}
.itempannel li {
  color: rgba(0, 0, 0, 0.65);
  border-radius: 4px;
  width: 160px;
  height: 28px;
  line-height: 26px;
  padding-left: 8px;
  border: 1px solid rgba(0, 0, 0, 0);
  list-style-type: none;
}
.itempannel li:hover {
  background: white;
  border: 1px solid #ced4d9;
  cursor: move;
}

.grabbable {
  cursor: move;
  cursor: grab;
  cursor: -moz-grab;
  cursor: -webkit-grab;
}

.grabbable:active {
  cursor: grabbing;
  cursor: -moz-grabbing;
  cursor: -webkit-grabbing;
}

.itempannel .pannel-type-icon {
  width: 16px;
  height: 16px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
}
.tree {
  position: relative;
  cursor: default;
  color: #606266;
}
</style>