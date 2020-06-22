<template>
  <div class="node-manage-container">
    <div class="step-container">
      <el-steps :active="active" align-center>
        <el-step icon="el-icon-s-operation" title="选择类别"></el-step>
        <el-step icon="el-icon-edit" title="编辑模板"></el-step>
        <el-step icon="el-icon-upload" title="上传脚本"></el-step>
      </el-steps>
    </div>
    <div class="form-container">
      <el-row justify="center" type="flex">
        <el-col :span="18">
          <el-form label-position="top" prop="Form">
            <!-- 选择类别 -->
            <el-form-item label="类别" prop="category" v-show="active == 0">
              <el-select placeholder="请选择" v-model="form.selectCategory">
                <el-option
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  v-for="item in categories"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- 编辑模板 -->
            <el-form-item label="结点详情" v-show="active == 1">
              <div class="detail-container">
                <div :key="index" class="detail" v-for="(nodeDetail, index) in form.nodeDetails">
                  <el-divider v-if="index != 0"></el-divider>
                  <el-row justify="space-between" type="flex">
                    <el-col :span="11">
                      <el-input
                        :disabled="index == 0"
                        placeholder="detail名称（英文）"
                        size="small"
                        v-model="nodeDetail.name"
                      ></el-input>
                    </el-col>
                    <el-col :span="11">
                      <el-input
                        :disabled="index == 0"
                        placeholder="detail标签"
                        size="small"
                        v-model="nodeDetail.label"
                      ></el-input>
                    </el-col>
                  </el-row>
                  <el-row justify="space-between" type="flex">
                    <el-col :span="11">
                      <el-select
                        :disabled="index == 0"
                        placeholder="detail类型"
                        size="small"
                        v-model="nodeDetail.type"
                      >
                        <el-option
                          :key="typeOption"
                          :label="typeOption"
                          :value="typeOption"
                          v-for="typeOption in typeOptions"
                        ></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="11">
                      <el-input
                        :placeholder="index == 0 ? '结点名称' : '默认值'"
                        size="small"
                        v-model="nodeDetail.value"
                      ></el-input>
                    </el-col>
                  </el-row>
                  <el-button
                    @click="deleteNodeDetail(index)"
                    circle
                    class="delete-detail-btn"
                    icon="el-icon-delete"
                    v-if="index != 0"
                  ></el-button>
                </div>
                <div class="add-detail">
                  <el-button @click="addNodeDetail" circle icon="el-icon-circle-plus-outline"></el-button>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="输入输出" v-show="active == 1">
              <div class="point-container">
                <div :key="index" class="detail" v-for="(pointDetail, index) in form.pointDetails">
                  <el-divider v-if="index != 0"></el-divider>
                  <el-row justify="space-between" type="flex">
                    <el-col :span="11">
                      <el-input placeholder="detail名称（英文）" size="small" v-model="pointDetail.name"></el-input>
                    </el-col>
                    <el-col :span="11">
                      <el-select placeholder="detail类型" size="small" v-model="pointDetail.type">
                        <el-option label="input" value="input"></el-option>
                        <el-option label="output" value="output"></el-option>
                      </el-select>
                    </el-col>
                  </el-row>
                  <el-button
                    @click="deletePointDetail(index)"
                    circle
                    class="delete-detail-btn"
                    icon="el-icon-delete"
                    v-if="index != 0"
                  ></el-button>
                </div>
                <div class="add-detail">
                  <el-button @click="addPointDetail" circle icon="el-icon-circle-plus-outline"></el-button>
                </div>
              </div>
            </el-form-item>
            <!-- 上传脚本 -->
            <el-form-item label="上传脚本" v-show="active == 2">
              <el-input
                placeholder="脚本名"
                style="width: 70%; margin-bottom: 20px;"
                v-model="filename"
              >
                <template slot="append">.txt</template>
              </el-input>
              <el-upload
                :auto-upload="false"
                :data="uploadDate"
                :file-list="fileList"
                :limit="1"
                :on-error="onUploadErr"
                :on-exceed="handleExceed"
                :on-success="onUploadSucc"
                accept=".txt"
                :action="`${base_api}script_manage`"
                :headers="{Authorization: 'JWT ' + token}"
                class="upload-demo"
                ref="upload"
              >
                <el-button size="small" type="primary">选取脚本</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <div class="dialog-footer">
      <el-button
        @click="prev"
        size="small"
        style="margin-top: 12px;"
        type="primary"
        v-if="this.active != 0"
      >上 一 步</el-button>
      <el-button
        @click="next"
        size="small"
        style="margin-top: 12px;"
        type="primary"
        v-if="this.active != this.countStep - 1"
      >下 一 步</el-button>
      <el-button
        @click="save"
        size="small"
        style="margin-top: 12px;"
        type="success"
        v-if="this.active == this.countStep - 1"
        v-loading="loading"
      >完 成</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Notification } from 'element-ui'
import fileApi from '@/api/file'
import configJS from '@/statics/config'
export default {
  data() {
    return {
      countStep: 3,
      active: 0,

      typeOptions: [
        'input',
        'slider',
        'checkbox',
        'inputNumber',
        'selectFile',
        'download',
        'preview',
        'visualization'
      ],

      form: {
        selectCategory: 9,
        nodeDetails: [
          {
            name: 'name',
            type: 'input',
            label: '名称',
            value: ''
          }
        ],
        pointDetails: [
          {
            name: '',
            type: ''
          }
        ]
      },
      filename: '',
      uploadDate: {
        selectCategory: -1,
        filename: ''
      },
      fileList: [],

      loading: false,

      base_api: configJS.BASE_API
    }
  },
  computed: {
    ...mapGetters(['categories', 'token'])
  },
  watch: {
    form: {
      handler: function() {
        this.shouldDisabledNext()
      }
    }
  },
  methods: {
    next() {
      if (!this.shouldDisabledNext()) {
        this.$message.warning(`存在空缺值`)
        return
      }
      if (this.active < this.countStep) {
        this.active++
      }
    },
    prev() {
      if (this.active != 0) {
        this.active--
      }
    },
    addNodeDetail() {
      var detail = {
        name: '',
        type: '',
        label: '',
        value: ''
      }
      this.form.nodeDetails.push(detail)
    },
    addPointDetail() {
      var detail = {
        name: '',
        type: ''
      }
      this.form.pointDetails.push(detail)
    },
    deleteNodeDetail(index) {
      this.form.nodeDetails.splice(index, 1)
    },
    deletePointDetail(index) {
      this.form.pointDetails.splice(index, 1)
    },
    handleExceed(files, fileList) {
      Notification({
        title: '警告',
        message: `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`,
        type: 'warning',
        duration: 3000
      })
    },
    shouldDisabledNext() {
      if (this.active == 0) {
        return this.form.selectCategory != ''
      } else if (this.active == 1) {
        var details = this.form.nodeDetails
        for (var detail in details) {
          for (var item in details[detail]) {
            if (details[detail][item] == '') {
              return false
            }
          }
        }
        var pds = this.form.pointDetails
        for (var pd in pds) {
          for (var item in pds[pd]) {
            if (pds[pd][item] == '') {
              return false
            }
          }
        }
        return true
      }
    },
    save() {
      if (this.filename == '') {
        this.$message.warning(`存在空缺值`)
        return
      }
      this.uploadDate.filename = this.filename + '.txt'
      this.uploadDate.selectCategory = this.form.selectCategory
      this.loading = true
      this.$refs.upload.submit()
    },
    onUploadSucc() {
      this.form.name = this.form.nodeDetails[0].value
      this.form.raw_script_name = this.filename + '.txt'
      this.form.shape = 'customNode'
      this.form.size = '170*34'
      this.form.color = '#1890ff'

      var pds = this.form.pointDetails
      var count_input = 0
      var count_output = 0
      for (var pd in pds) {
        if (pds[pd].type == 'input') {
          count_input++
        } else {
          count_output++
        }
      }

      var in_proportion = 1 / (count_input + 1)
      var out_proportion = 1 / (count_output + 1)
      var in_index = 1
      var out_index = 1

      for (var pd in pds) {
        if (pds[pd].type == 'input') {
          pds[pd]['proportion'] = in_proportion * in_index++
        } else {
          pds[pd]['proportion'] = out_proportion * out_index++
        }
      }

      fileApi
        .createNode(this.form)
        .then(res => {
          this.loading = false
          this.reset()
          this.$store.dispatch('app/getNodeList')
          this.$store.commit('app/SET_ISSHOWNODEMANAGE', false)
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
    },
    reset() {
      this.active = 0
      this.form.selectCategory = 8
      this.form.nodeDetails = [
        {
          name: 'name',
          type: 'input',
          label: '名称',
          value: ''
        }
      ]
      this.form.pointDetails = [
        {
          name: '',
          type: ''
        }
      ]
      this.filename = ''
      this.uploadDate.filename = ''
      this.uploadDate.selectCategory = -1
      this.fileList = []
    },
    onUploadErr(res, file, fileList) {
      console.log(res)
      this.loading = false
    }
  }
}
</script>

<style scoped>
.form-container {
  margin-top: 20px;
}
.dialog-footer {
  padding: 10px 20px 20px;
  text-align: right;
}
.add-detail {
  text-align: right;
  margin-top: 10px;
}
.detail {
  position: relative;
}
.delete-detail-btn {
  position: absolute;
  right: -40px;
  top: 45px;
}
</style>