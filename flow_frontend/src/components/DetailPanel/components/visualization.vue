<template>
  <div class="visual-container">
    <el-tooltip :disabled="canPreview" effect="dark" placement="left">
      <div slot="content">
        <p>当前节点未保存或预览文件不存在</p>
      </div>
      <div style="display: inline-block">
        <el-button :disabled="!canPreview" @click="isShowVisual = true" small type="primary">可视化文件</el-button>
      </div>
    </el-tooltip>

    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="true"
      :modal="true"
      :modal-append-to-body="true"
      :visible.sync="isShowVisual"
      custom-class="preview-dialog"
      title="可视化文件">
      <el-form label-position="top">
        <el-form-item label="选择可视化行（暂不支持字符类型可视化）">
          <el-table
            :data="csv"
            @selection-change="handleSelectionChange"
            border
            highlight-current-row
            style="width: 100%"
            v-loading="loading"
          >
            <el-table-column type="selection" width="55" />
            <!-- <el-table-column :index="1" :show-overflow-tooltip="true" label="\" type="index"></el-table-column> -->
            <el-table-column
              :key="index"
              :label="label"
              :show-overflow-tooltip="true"
              v-for="(label, index) in index"
            >
              <template slot-scope="scope">
                <span>{{ scope.row[index] }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button type="plain" @click="isShowVisual = false">取 消</el-button>
        <el-button :disabled="!canProceed" type="primary" @click="isShowEcharts = true">下 一 步</el-button>
      </div>
    </el-dialog>

    <visualize-echarts v-if="isShowEcharts" :seclectedCol="multipleSelection" :pid="pid" />
  </div>
</template>

<script>
import fileApi from '@/api/file'
import { Notification } from 'element-ui'
import { mapGetters } from 'vuex'
import visualizeEcharts from './visualizeEcharts';

export default {
  name: 'visual-file',
  props: {
    node_id: {
      type: String
    }
  },
  data() {
    return {
      csv: [
        [1, 3, true, 4, 5, 8],
        [2, 1, false, 1, 3, 0],
        [3, 1, false, 2, 1, 1],
        [9, 1, true, 1, 2, 0],
        [7, 4, true, 2, 5, 2]
      ],
      index: [],
      loading: false,
      canPreview: false,
      canProceed: false,
      multipleSelection: [],
      pid: '',
    }
  },
  components: {
    visualizeEcharts
  },
  created() {
    if (this.node_id == null) {
      this.canPreview = false
    } else {
      fileApi.isPreviewValid({ nodeId: this.node_id, graphId: this.graphId }).then(res => {
        this.canPreview = res.data
      })
    }
  },
  computed: {
    isShowVisual: {
      get() {
        var show = this.$store.getters.isShowVisual
        if (show) {
          this.loading = true
          fileApi
            .previewCsv({ nodeId: this.node_id, graphId: this.graphId, transit: true })
            .then(res => {
              var csv = res.data
              csv.forEach((row, i) => {
                csv[i] = [i+1].concat(row)
              })
              this.csv = csv
              this.pid = res.pid
              this.index = ['\\'].concat(res.index)
              this.loading = false
            })
            .catch(err => {
              this.loading = false
              this.isShowPreview = false
              Notification({
                title: '错误',
                message: '文件不存在或文件路径不正确',
                type: 'error',
                duration: 3000
              })
            })
        }
        return show
      },
      set(val) {
        this.$store.commit('app/SET_ISSHOWVISUAL', val)
      }
    },
    isShowEcharts: {
      get() {
        return this.$store.getters.isShowEcharts
      },
      set(val) {
        this.$store.commit('app/SET_ISSHOWECHARTS', val)
      }
    },
    graphId: {
      get() {
        return this.$route.params.id || this.$store.getters.graphId
      }
    }
  },
  methods: {
    handleSelectionChange(val, row) {
      this.multipleSelection = val
      var canProceed = true
      val.forEach(row => {
        if (typeof row[1] == 'string') {
          canProceed = false
        }
      })
      this.canProceed = canProceed
    }
  }
}
</script>

<style>
</style>