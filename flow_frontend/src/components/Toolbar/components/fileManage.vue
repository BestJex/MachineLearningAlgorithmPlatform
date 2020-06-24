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
                :show-file-list="false"
                multiple>
            <el-button size="small" type="primary">上传文件</el-button>
        </el-upload>
        <el-table
                ref="multipleTable"
                :data="fileTableData"
                tooltip-effect="dark"
                style="width: 100%"
                :default-sort="{prop: 'date', order: 'descending'}"
                @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="70"></el-table-column>
            <el-table-column prop="date" label="日期" width="150" sortable>
                <template slot-scope="scope">{{ scope.row.date }}</template>
            </el-table-column>
            <el-table-column prop="name" label="文件名" width="120"></el-table-column>
            <el-table-column prop="size" label="文件大小" width="120" sortable></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">
                        编辑
                    </el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
            <el-button @click="toggleSelectionDelete()">
                批量删除
            </el-button>
            <el-button @click="toggleSelection()">取消选择</el-button>
        </div>
    </div>
</template>

<script>
    import fileApi from '@/api/file'
    import {Notification} from 'element-ui'
    import {mapGetters} from 'vuex'
    import configJS from '@/statics/config'

    export default {
        name: 'file-mange',
        data() {
            return {
                fileTableData: [{
                    date: '2016-05-03',
                    name: 'iris.csv',
                    size: '1',
                }, {
                    date: '2016-05-02',
                    name: 'train.csv',
                    size: '2',
                }],
                multipleSelection: [],
                uploadData: {
                    graphId: 0
                },
                base_api: configJS.BASE_API,
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
            this.uploadData.graphId = this.graphId;
            // 1.获取文件列表
            let projectId = this.$route.params.id;
            this.axios({
                methods: 'get',
                url: `${this.base_api}user/file?username=${localStorage.getItem('username')}&project=${projectId}`,
            }).then(res => {
                this.fileTableData = res.data;
            }).catch(err => {
                this.$message({
                    message: err,
                    type: 'error'
                });
            });
        },
        methods: {
            handleEdit(index, row) {
                console.log(index, row);
            },
            handleDelete(index, row) {
                console.log(index, row);
            },
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            toggleSelectionDelete(rows) {

            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleRemove(file, fileList) {
                fileApi.deleteFile({id: file.id}).then(res => {
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
                            return fileApi.isFilenamehValid({filename: file.name, graphId: this.graphId})
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
                const sizeFlag = file.size / 1024 / 1024 < 10;
                if (!sizeFlag) {
                    Notification({
                        title: '错误',
                        message: '上传文件大小不能超过 10MB!',
                        type: 'error',
                        duration: 3000
                    });
                }
                return new Promise((resolve, reject) => {
                    fileApi
                        .isFilenamehValid({filename: file.name, graphId: this.graphId})
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