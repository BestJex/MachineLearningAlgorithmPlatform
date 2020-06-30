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
                <el-button @click="toggleSelection()" size="small" type="primary">取消选择</el-button>
                <el-table
                        ref="multipleTable"
                        :data="fileTableData"
                        tooltip-effect="dark"
                        style="width: 100%"
                        :default-sort="{prop: 'buildtime', order: 'descending'}">
                    <el-table-column prop="buildtime" label="日期" width="200" sortable></el-table-column>
                    <el-table-column prop="filename" label="文件名" width="200"></el-table-column>
                    <el-table-column prop="size" label="文件大小" width="150" sortable></el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="上传文件">
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
                        multiple
                        drag
                        style="display: inline-block">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em>，大小不能超过10MB。</div>
                </el-upload>
            </el-tab-pane>
        </el-tabs>
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
                tabPosition: 'left',
                // 从服务端搜索数据
                restaurants: [],
                state: '',
                timeout: null,

                fileTableData: [],
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
            console.log(typeof projectId);
            this.axios({
                method: 'get',
                url: `http://39.105.21.62/flow/api/filelistall?username=${localStorage.getItem('username')}`,
            }).then(res => {
                this.fileTableData = Array(res.data.data.list)[0];
                for (let i = 0; i < this.fileTableData.length; i++) {
                    let item = this.fileTableData[i];
                    if (item.graphid.toString() !== projectId) {
                        this.fileTableData.splice(i, 1);
                        console.log(i);
                    }
                    let TIndex = item.buildtime.indexOf('T');
                    let pointIndex = item.buildtime.indexOf('.');
                    item.buildtime = item.buildtime.substring(0, TIndex) + ' ' + item.buildtime.substring(TIndex + 1, pointIndex);
                    item.size = (parseInt(item.size) / 1024).toFixed(2) + 'KB';
                }
                console.log(this.fileTableData);
            }).catch(err => {
                this.$message({
                    message: err,
                    type: 'error'
                });
            });
        },
        mounted() {
            this.restaurants = this.loadAll();
        },
        methods: {
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
            querySearchAsync(queryString, cb) {
                const restaurants = this.restaurants;
                const results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    cb(results);
                }, 300 * Math.random());
            },
            createStateFilter(queryString) {
                return (state) => {
                    return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            handleSelect(item) {
                console.log(item);
            },

            handleEdit(index, row) {

            },
            handleDelete(index, row) {

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
                                return resolve()
                            }
                        })
                        .then(res => {
                            return resolve()
                        })
                        .catch(err => {
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
            }
        }
    }
</script>

<style>
</style>