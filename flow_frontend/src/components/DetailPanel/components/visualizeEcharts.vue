<template>
  <div class="visualize-echarts-container">
    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      :modal="true"
      :modal-append-to-body="true"
      :visible.sync="isShowEcharts"
      custom-class="preview-dialog"
      title="可视化文件"
    >
      <ve-line :data="chartData" :key="chartData.id" v-for="chartData in chartDatas"></ve-line>

      <div class="dialog-footer" slot="footer">
        <el-button type="primary" @click="isShowEcharts = false">上 一 步</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import fileApi from '@/api/file'
import { Notification } from 'element-ui'
import { mapGetters } from 'vuex'

export default {
  name: 'visualize-echarts',
  props: {
    seclectedCol: {
      type: Array
    },
    pid: {
      type: String
    }
  },
  computed: {
    isShowEcharts: {
      get() {
        var show = this.$store.getters.isShowEcharts
        if (show) {
        }
        return show
      },
      set(val) {
        this.$store.commit('app/SET_ISSHOWECHARTS', val)
      }
    }
  },
  data() {
    return {
      chartDatas: [],
      // chartData: {
      //   columns: ['日期', '访问用户', '下单用户', '下单率'],
      //   rows: [
      //     { 日期: '1/1', 访问用户: 1393, 下单用户: 1093, 下单率: 0.32 },
      //     { 日期: '1/2', 访问用户: 3530, 下单用户: 3230, 下单率: 0.26 },
      //     { 日期: '1/3', 访问用户: 2923, 下单用户: 2623, 下单率: 0.76 },
      //     { 日期: '1/4', 访问用户: 1723, 下单用户: 1423, 下单率: 0.49 },
      //     { 日期: '1/5', 访问用户: 3792, 下单用户: 3492, 下单率: 0.323 },
      //     { 日期: '1/6', 访问用户: 4593, 下单用户: 4293, 下单率: 0.78 }
      //   ]
      // }
      graphId: 0,
    }
  },
  created() {
    this.graphId = this.$route.params.id || this.$store.getters.graphId
    var selectedIndex = []
    this.seclectedCol.forEach(col => {
      selectedIndex.push(col[0])
    })
    fileApi
      .previewEcharts({ graphId: this.graphId, queries: selectedIndex, pid: this.pid })
      .then(res => {
        var data = res.data
        for (var i in data) {
          var chartData = {}

          var rows = []
          var index = 1
          data[i].forEach(d => {
            var obj = {}
            obj['Series'] = index++
            obj[`Col ${i}`] = d
            rows.push(obj)
          })

          chartData.id = i
          chartData.columns = ['Series', `Col ${i}`]
          chartData.rows = rows
          this.chartDatas.push(chartData)
        }
      })
  }
}
</script>

<style>
</style>