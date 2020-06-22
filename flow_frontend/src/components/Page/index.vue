<template>
  <div
    :style="`margin-left: ${itemWidth}px; margin-right: ${detailWidth}px; height: 100%;`"
    @click="clickCanvas"
    @dragover.prevent
    @drop="handleDrop"
  >
    <span style="position: absolute;">{{ canvasWidth }}</span>
    <div :id="pageId" class="graph-container" style="position: relative; height: 100%;"></div>
  </div>
</template>


<script>
import G6 from '@antv/g6/build/g6'
import { initBehavors } from '@/behavior'
import { mapGetters } from 'vuex'
import graphApi from '@/api/graph'
import { Message } from 'element-ui'

export default {
  data() {
    return {
      pageId: 'graph-container',
      graph: null,
      data: null,

      max_id: 0
    }
  },
  computed: {
    ...mapGetters(['canvasHeight', 'canvasWidth', 'itemWidth', 'detailWidth']),
    id: {
      get() {
        var graphId = this.$route.params.id
        this.$store.commit('app/SET_GRAPHID', graphId)
        return graphId
      },
      set(val) {
        this.$store.commit('app/SET_GRAPHID', val)
      }
    },
    isRunning: {
      get() {
        return this.$store.state.app.is_running
      },
      set(val) {
        this.$store.commit('app/SET_ISRUNNING', val)
      }
    },
  },
  watch: {
    canvasWidth: function(val) {
      this.graph.changeSize(val, this.canvasHeight)
    },
    canvasHeight: function(val) {
      console.log('canvas height change detected: ', val)
      this.graph.changeSize(this.canvasWidth, val)
    }
  },
  created() {
    initBehavors()
    this.getGraph()
    this.$store.dispatch('app/getProjectFileList', this.id)
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    getGraph() {
      graphApi
        .getGraphById({ graphId: this.id })
        .then(res => {
          this.data = res.data
          this.isRunning = this.data.status == 'loading'
          this.forEach(this.data)
          this.$store.commit('app/SET_MAXID', this.max_id)
          this.graph.read(this.data)
          if (this.data.nodes.length) {
            this.graph.fitView(100)
          }
        })
        .catch(err => {
          Message({
            message: err.data,
            type: 'error',
            duration: 3 * 1000
          })
          this.$router.push('/')
        })
    },
    forEach(json) {
      for (var val in json) {
        if (val === 'id' && typeof json[val] === 'string') {
          this.max_id = Math.max(
            this.max_id,
            parseInt(json[val].replace(/[^0-9]/gi, ''))
          )
        }
        if (typeof json[val] == 'object' && json[val] !== null) {
          this.forEach(json[val])
        }
      }
    },
    init() {
      const height = this.canvasHeight
      const width = this.canvasWidth

      this.graph = new G6.Graph({
        container: 'graph-container',
        height: height,
        width: width,
        modes: {
          // 支持的 behavior
          default: [
            'drag-canvas',
            // "brush-select",
            'drag-select',
            'canvas-zoom',
            'hover-node',
            'drag-node',
            'select-node',
            'hover-edge',
            'keyboard',
            'add-menu'
          ],
          moveCanvas: ['drag-canvas'],
          multiSelect: [
            {
              type: 'drag-select',
              trigger: 'drag'
            }
          ],
          addEdge: ['add-edge']
          // moveNode: ['drag-item']
        }
      })
      const { editor, command } = this.$parent
      editor.emit('afterAddPage', { graph: this.graph, command })

      this.readData()
    },
    readData() {
      let data = this.data
      if (data) {
        this.graph.read(data)
      }
    },
    clickCanvas() {
      this.$store.dispatch('app/setIsFocusCanvas', true)
    },
    handleDrop(e) {
      this.$store.commit('app/SET_ALLOWDROP', true)
    }
  }
}
</script>

<style scoped>
</style>