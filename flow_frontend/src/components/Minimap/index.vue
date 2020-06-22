<template>
  <div :style="`width:${detailWidth}px;`" id="navigator">
    <div class="pannel-title">导航器</div>
    <div class="minimap" id="minimap" ref="minimap"></div>
    <!-- <div id="zoom-slider">
      <a class="zoom-dropdown-btn ant-dropdown-trigger" href="#">
        100 %
        <i class="anticon anticon-down"></i>
      </a>
    </div>-->
  </div>
</template>

<script>
import Minimap from '@antv/g6/build/minimap'
import eventBus from '@/utils/eventBus'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      minimap: null,
      graph: null
    }
  },
  computed: {
    ...mapGetters(['detailWidth', 'canvasWidth', 'canvasHeight'])
  },
  watch: {
    // detailWidth(width) {
    //   let height = Math.floor((width * this.canvasHeight) / this.canvasWidth)
    //   console.log(width, height);
    //   const cfgs = {
    //     size: [width, height],
    //     container: 'minimap'
    //   }
    //   this.minimap = new Minimap({ ...cfgs })
    // }
  },
  created() {
    this.bindEvent()
  },
  mounted() {
    this.$nextTick(() => {
      this.initMinmap()
    })
  },
  methods: {
    initMinmap() {
      let width = this.detailWidth
      let height = (this.detailWidth * this.canvasHeight) / this.canvasWidth
      height = 150
      const cfgs = {
        size: [width, height],
        container: 'minimap'
      }
      this.minimap = new Minimap({ ...cfgs })
    },
    bindEvent() {
      eventBus.$on('afterAddPage', page => {
        this.graph = page.graph
        this.bindPage()
      })
    },
    bindPage() {
      if (!this.minimap || !this.graph) {
        return
      }
      this.graph.addPlugin(this.minimap)
    }
  }
}
</script>

<style scoped>
#navigator {
  /* width: 200px; */
  /* height: 176px; */
  text-align: center;
  position: absolute;
  bottom: 100px;
  right: 0px;
  z-index: 3;
}

.pannel-title {
  height: 32px;
  border-top: 1px solid #dce3e8;
  border-bottom: 1px solid #dce3e8;
  background: #ebeef2;
  color: #000;
  line-height: 28px;
  padding-left: 12px;
}
</style>
