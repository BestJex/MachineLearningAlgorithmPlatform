<template>
  <div class="preview-container">
    <el-tooltip :disabled="canPreview" effect="dark" placement="left">
      <div slot="content">
        <p>当前节点未保存或预览文件不存在</p>
      </div>
      <div style="display: inline-block">
        <el-button :disabled="!canPreview" @click="isShowPreview = true" small type="primary">
          预览文件
        </el-button>
      </div>
    </el-tooltip>
    <el-dialog
      :append-to-body="false"
      :close-on-click-modal="false"
      :modal="false"
      :modal-append-to-body="true"
      :visible.sync="isShowPreview"
      custom-class="preview-dialog"
      title="预览文件"
    >
      <el-table :data="csv" v-loading="loading" border highlight-current-row style="width: 100%">
        <el-table-column :index="indexMethod" :show-overflow-tooltip="true" label="\" type="index">

        </el-table-column>
        <el-table-column
          :key="index"
          :label="String(index + 1)"
          :show-overflow-tooltip="true"
          v-for="(col, index) in csv[0]"
        >
          <template slot-scope="scope">
            <span>{{ scope.row[index] }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import fileApi from '@/api/file'
import { Notification } from 'element-ui'
import { mapGetters } from 'vuex'
export default {
  name: 'detail-preview',
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
      canPreview: false
    }
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
    isShowPreview: {
      get() {
        var show = this.$store.getters.isShowPreview
        if (show) {
          this.loading = true
          console.log(this.node_id)
          fileApi
            .previewCsv({ nodeId: this.node_id, graphId: this.graphId })
            .then(res => {
              this.csv = res.data
              this.index = res.index
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
        this.$store.commit('app/SET_ISSHOWPREVIEW', val)
      }
    },
    graphId: {
      get() {
        return this.$route.params.id || this.$store.getters.graphId
      }
    }
  },
  methods: {
    indexMethod(index) {
      return this.index[index]
    },
    previewCsv() {
      fileApi
        .previewCsv({ fid: 1 })
        .then(res => {
          this.csv = res.data
        })
        .catch(err => {
          Notification({
            title: '错误',
            message: '文件不存在或文件路径不正确',
            type: 'error',
            duration: 3000
          })
        })
    }
  }
}
</script>

<style>
</style>