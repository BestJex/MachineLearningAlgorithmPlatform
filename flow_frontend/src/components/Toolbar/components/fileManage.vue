<template>
  <div>
    <el-upload
      :before-remove="beforeRemove"
      :before-upload="beforeUpload"
      :data="uploadData"
      :file-list="fileList"
      :on-error="onUploadErr"
      :on-remove="handleRemove"
      :on-success="onUploadSucc"
      :headers="{Authorization: 'JWT ' + token}"
      accept=".jpg, .csv, .png"
      :action="base_api + 'upload_file'"
      class="upload-demo"
      multiple
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
  </div>
</template>

<script>
import fileApi from '@/api/file'
import { Notification } from 'element-ui'
import { mapGetters } from 'vuex'
import configJS from '@/statics/config'
export default {
  name: 'file-mange',
  data() {
    return {
      uploadData: {
        graphId: 0
      },
      base_api: configJS.BASE_API
    }
  },
  computed: {
    ...mapGetters(['fileList', 'token']),
    graphId: {
      get() {
        return this.$route.params.id || this.$store.getters.graphId
      }
    },
    'uploadData.graphId': {
      get() {
        return this.$route.params.id || this.$store.getters.graphId
      }
    }
  },
  props: {
    graph: {
      type: Object,
      required: true
    }
  },
  created() {
    this.uploadData.graphId = this.graphId
  },
  methods: {
    handleRemove(file, fileList) {
      fileApi.deleteFile({ id: file.id }).then(res => {
        // 通知成功
        Notification({
          title: '成功',
          message: '文件移除成功',
          type: 'success',
          duration: 3000
        })
        this.$store.commit('app/SET_FILELIST', res.data)
      })
    },
    beforeRemove(file, fileList) {
      return new Promise((resolve, reject) => {
        this.$confirm(`确定移除 ${file.name}？`)
          .then(res => {
            return fileApi.isFilenamehValid({ filename: file.name, graphId: this.graphId })
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
      return new Promise((resolve, reject) => {
        fileApi
          .isFilenamehValid({ filename: file.name, graphId: this.graphId })
          .then(res => {
            if (res.data) {
              // 存在重名文件
              return this.$confirm(`文件 ${file.name} 已存在，确认覆盖吗？`)
            } else {
              console.log('不存在重名');
              return resolve()
            }
          })
          .then(res => {
            console.log('确认覆盖');
            return resolve()
          })
          .catch(err => {
            console.log(err);
            return reject()
          })
      })
    },
    onUploadSucc(res, file, fileList) {
      Notification({
        title: '成功',
        message: '文件上传成功',
        type: 'success',
        duration: 3000
      })
      this.$store.commit('app/SET_FILELIST', res.data)
    },
    onUploadErr(res, file, fileList) {
      console.log(res)
    }
  }
}
</script>

<style>
</style>