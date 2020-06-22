<template>
  <div>
    <el-upload
      :before-remove="beforeRemove"
      :before-upload="beforeUpload"
      :data="uploadData"
      :file-list="node_value"
      :limit="1"
      :on-error="onUploadErr"
      :on-exceed="handleExceed"
      :on-remove="handleRemove"
      :on-success="onUploadSucc"
      accept=".jpg, .csv, .png"
      :action="base_api + 'upload_file'"
      class="upload-demo"
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
  </div>
</template>

<script>
import fileApi from '@/api/file'
import { Notification } from 'element-ui'
import configJS from '@/statics/config'
export default {
  name: 'detail-upload',
  data() {
    return {
      uploadData: {
        projectName: 'k-means',
        nodeId: '',
        owner: 'christopher'
      },

      base_api: configJS.BASE_API
    }
  },
  props: {
    graph: {
      type: Object,
      required: true
    },
    node_value: {
      type: Array,
      required: true
    },
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleRemove(file, fileList) {
      fileApi
        .deleteFile({ filepath: file.filepath, nodeId: this.item._cfg.id })
        .then(res => {
          // 修改node_detail的值
          var nodeId = res.nodeId

          var node_detail = this.graph.findById(nodeId).getModel().node_detail
          node_detail.forEach(node => {
            if (node.name === 'upload') {
              node.value = []
            }
          })

          // 修改node状态
          const model = {
            status: ''
          }
          this.graph.update(this.item, model)

          // 通知成功
          Notification({
            title: '成功',
            message: '文件移除成功',
            type: 'success',
            duration: 3000
          })
        })
        .catch(err => {
          Notification({
            title: '错误',
            message: err.data,
            type: 'error',
            duration: 3000
          })
        })
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    beforeRemove(file, fileList) {
      return new Promise((resolve, reject) => {
        this.$confirm(`确定移除 ${file.name}？`)
          .then(res => {
            return fileApi.isFilepathValid({ filepath: file.filepath })
          })
          .then(res => {
            if (res.data) {
              resolve()
            } else {
              Notification({
                title: '错误',
                message: '文件不存在或文件路径不正确',
                type: 'error',
                duration: 3000
              })
              reject()
            }
          })
          .catch(err => {
            return reject()
          })
      })
    },
    beforeUpload(file) {
      // const model = {
      //   status: 'loading'
      // }
      // this.graph.update(this.item, model)
      this.uploadData.nodeId = this.item._cfg.id
    },
    onUploadSucc(res, file, fileList) {
      Notification({
        title: '成功',
        message: '文件上传成功',
        type: 'success',
        duration: 3000
      })

      var nodeId = res.nodeId
      var filepath = res.filepath

      var node_detail = this.graph.findById(nodeId).getModel().node_detail
      node_detail.forEach(node => {
        if (node.name === 'upload') {
          node.value = [
            {
              name: file.name,
              status: file.status,
              size: file.size,
              percentage: file.percentage,
              uid: file.uid,
              filepath: filepath
            }
          ]
        }
      })

      // const model = {
      //   status: 'complete'
      // }
      // this.graph.update(this.item, model)
    },
    onUploadErr(res, file, fileList) {
      console.log(res)
    }
  }
}
</script>

<style>
</style>