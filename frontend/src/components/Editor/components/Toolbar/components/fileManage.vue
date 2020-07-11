<template>
    <div>
        <el-tabs :tab-position="tabPosition" style="height: 200px;">
            <el-tab-pane label="文件管理">
                <el-button @click="toggleSelectionDelete()"
                           size="small"
                           type="primary"
                           style="margin-left: 10px">
                    批量删除
                </el-button>
                <el-button @click="toggleSelection()"
                           size="small" type="primary">
                    取消选择
                </el-button>
                <el-table ref="multipleTable"
                          :data="fileTableData.filter(data => !search || data.filename.includes(search))"
                          tooltip-effect="dark"
                          style="width: 100%"
                          :default-sort="{prop: 'buildtime', order: 'descending'}"
                          @selection-change="handleSelectionChange">
                    <el-table-column type="selection"
                                     width="55">
                    </el-table-column>
                    <el-table-column prop="buildtime"
                                     label="日期"
                                     width="150"
                                     sortable>
                    </el-table-column>
                    <el-table-column prop="filename"
                                     label="文件名"
                                     width="100">
                    </el-table-column>
                    <el-table-column prop="size"
                                     label="文件大小"
                                     width="100"
                                     sortable>
                    </el-table-column>
                    <el-table-column align="right">
                        <template slot="header">
                            <el-input v-model="search"
                                      size="mini"
                                      placeholder="输入关键字搜索"/>
                        </template>
                        <template slot-scope="scope">
                            <el-button size="mini"
                                       @click="handleEdit(scope.$index, scope.row)">
                                Edit
                            </el-button>
                            <el-button size="mini"
                                       type="danger"
                                       @click="handleDelete(scope.$index, scope.row)">
                                Delete
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="上传文件">
                <el-upload :before-remove="beforeRemove"
                           :before-upload="beforeUpload"
                           :data="uploadData"
                           :file-list="fileList"
                           :on-error="onUploadErr"
                           :on-remove="handleRemove"
                           :on-success="onUploadSuccess"
                           :headers="{Authorization: 'JWT ' + token}"
                           accept=".jpg, .csv, .png"
                           :action="base_api + 'upload_file'"
                           class="upload-demo"
                           :show-file-list="false"
                           multiple
                           drag style="display: inline-block">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em>，大小不能超过10MB。</div>
                </el-upload>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import api from "@/config/api";
    import {mapGetters} from 'vuex';
    import userApi from "@/api/user";
    import projectApi from "@/api/project";
    import {Notification} from 'element-ui';

    export default {
        name: "fileManage",
        data() {
            return {
                state: '',
                search: '',
                timeout: null,
                restaurants: [],
                tabPosition: 'left',
                base_api: api.BaseAPI,
                fileTableData: [],
                multipleSelection: [],
                uploadData: {
                    graphId: 0
                },
            }
        },
        computed: {
            ...mapGetters(['token']),
            graphId: {
                get() {
                    return this.$route.params.id;
                }
            },
            'uploadData.graphId': {
                get() {
                    return this.$route.params.id;
                }
            }
        },
        props: {
            graph: {
                type: Object,
                required: true
            }
        },
        mounted() {
            this.restaurants = this.loadAll();
        },
        created() {
            this.getProjectFileList();
        },
        methods: {
            /**
             * 获取当前项目的上传文件列表
             */
            getProjectFileList() {
                this.uploadData.graphId = this.graphId;
                let projectId = this.$route.params.id;
                userApi.filelist({username: localStorage.getItem('username')}).then(response => {
                    this.fileTableData = Array(response.data.list)[0];
                    for (let i = 0; i < this.fileTableData.length; i++) {
                        let item = this.fileTableData[i];
                        if (item.graphid.toString() !== projectId) {
                            this.fileTableData.splice(i, 1);
                        }
                        let TIndex = item.buildtime.indexOf('T');
                        let pointIndex = item.buildtime.indexOf('.');
                        item.buildtime = item.buildtime.substring(0, TIndex) + ' ' + item.buildtime.substring(TIndex + 1, pointIndex);
                        item.size = (parseInt(item.size) / 1024).toFixed(2) + 'KB';
                    }
                }).catch(error => {
                    this.$message({
                        message: error,
                        type: 'error',
                    });
                });
            },
            loadAll() {
                let fileListLength = this.fileTableData.length;
                let fileArray = Array(fileListLength);
                for (let i = 0; i < this.fileTableData.length; i++) {
                    fileArray[i] = {
                        "value": this.fileTableData[i].name,
                    };
                }
                return fileArray;
            },

            // eslint-disable-next-line no-unused-vars
            handleSelect(item) {

            },

            // eslint-disable-next-line no-unused-vars
            handleEdit(index, row) {

            },

            handleDelete(index, row) {
                // eslint-disable-next-line no-unused-vars
                projectApi.deleteFile({id: row.id}).then(response => {
                    Notification({
                        title: '成功',
                        message: '文件移除成功',
                        type: 'success',
                        duration: 3000,
                    });
                }).catch(error => {
                    this.$message({
                        message: error,
                        type: 'error',
                    });
                });
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

            // eslint-disable-next-line no-unused-vars
            toggleSelectionDelete(rows) {

            },

            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            // eslint-disable-next-line no-unused-vars
            handleRemove(file, fileList) {
                // eslint-disable-next-line no-unused-vars
                projectApi.deleteFile({id: file.id}).then(response => {
                    Notification({
                        title: '成功',
                        message: '文件移除成功',
                        type: 'success',
                        duration: 3000,
                    });
                }).catch(error => {
                    this.$message({
                        message: error,
                        type: 'error',
                    });
                });
            },

            // eslint-disable-next-line no-unused-vars
            beforeRemove(file, fileList) {
                return new Promise((resolve, reject) => {
                    // eslint-disable-next-line no-unused-vars
                    this.$confirm(`确定移除 ${file.name}？`).then(response => {
                        return projectApi.isFileNameValid({
                            filename: file.name,
                            graphId: this.graphId,
                        });
                    }).then(response => {
                        if (response.data) {
                            resolve();
                        } else {
                            Notification({
                                title: '错误',
                                message: '文件不存在或文件路径不正确',
                                type: 'error',
                                duration: 3000,
                            });
                            reject();
                        }
                        // eslint-disable-next-line no-unused-vars
                    }).catch(error => {
                        this.$message({
                            message: error,
                            type: 'error',
                        });
                        return reject();
                    });
                })
            },

            beforeUpload(file) {
                const sizeFlag = file.size / 1024 / 1024 < 10;
                if (!sizeFlag) {
                    Notification({
                        title: '错误',
                        message: '上传文件大小不能超过 10MB!',
                        type: 'error',
                        duration: 3000,
                    });
                }
                return new Promise((resolve, reject) => {
                    projectApi.isFileNameValid({
                        filename: file.name,
                        graphId: this.graphId
                    }).then(res => {
                        if (res.data) {
                            return this.$confirm(`文件 ${file.name} 已存在，确认覆盖吗？`);
                        } else {
                            return resolve();
                        }
                        // eslint-disable-next-line no-unused-vars
                    }).then(response => {
                        return resolve();
                    }).catch(error => {
                        this.$message({
                            message: error,
                            type: 'error',
                        });
                        return reject();
                    })
                })
            },

            // eslint-disable-next-line no-unused-vars
            onUploadSuccess(res, file, fileList) {
                Notification({
                    title: '成功',
                    message: '文件上传成功',
                    type: 'success',
                    duration: 3000
                });
                this.getProjectFileList();
            },

            // eslint-disable-next-line no-unused-vars
            onUploadErr(res, file, fileList) {

            },
        }
    }
</script>

<style scoped>

</style>