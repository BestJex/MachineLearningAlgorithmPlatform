<template>
    <div>
        <el-upload :before-remove="beforeRemove"
                   :before-upload="beforeUpload"
                   :file-list="fileList"
                   :data="graphid"
                   :on-error="onUploadErr"
                   :on-remove="handleRemove"
                   :on-success="onUploadSucc"
                   :headers="{Authorization: 'JWT ' + token}"
                   accept=".gph"
                   :action="base_api + 'loadconf'"
                   class="upload-demo"
                   :show-file-list="true"
                   drag
                   style="display: inline-block">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传（.json）</em>大小限制10MB</div>
        </el-upload>
    </div>
</template>

<script>
    import fileApi from "@/api/file";
    import {Message, Notification} from "element-ui";
    import configJS from "@/statics/config";
    import {mapGetters} from "vuex";
    import graphApi from "@/api/graph";

    export default {
        name: "importManage",
        data() {
            return {
                fileList: [],
                base_api: configJS.BASE_API,
                graphid: {
                    graphid: this.$route.params.id
                },
            }
        },
        props: {
            graph: {
                type: Object,
                required: true
            }
        },
        computed: {
            ...mapGetters(['token']),
            graphId: {
                get() {
                    return this.$route.params.id || this.$store.getters.graphId
                }
            },
            'uploadData.graphid': {
                get() {
                    return this.$route.params.id || this.$store.getters.graphId
                }
            }
        },
        methods: {
            handleRemove(file, fileList) {
                fileApi.deleteFile({
                    id: file.id
                }).then(res => {
                    Notification({
                        title: '成功',
                        message: '文件移除成功',
                        type: 'success',
                        duration: 3000,
                    });
                })
            },
            beforeRemove(file, fileList) {
                return new Promise((resolve, reject) => {
                    this.$confirm(`确定移除 ${file.name}？`).then(res => {
                        return fileApi.isFileNameValid({
                            filename: file.name,
                            graphId: this.graphId
                        });
                    }).then(res => {
                        if (res.data) {
                            resolve();
                        } else {
                            Notification({
                                title: '错误',
                                message: '文件不存在或文件路径不正确',
                                type: 'error',
                                duration: 3000,
                            })
                            reject();
                        }
                    }).catch(err => {
                        return reject();
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
                        duration: 3000,
                    });
                    return false;
                }
                return new Promise((resolve, reject) => {
                    fileApi.isFileNameValid({
                        filename: file.name,
                        graphId: this.graphId
                    }).then(res => {
                        if (res.data) {
                            // 存在重名文件
                            return this.$confirm(`文件 ${file.name} 已存在，确认覆盖吗？`)
                        } else {
                            return resolve()
                        }
                    }).then(res => {
                        return resolve()
                    }).catch(err => {
                        return reject()
                    })
                })
            },
            onUploadSucc(res, file, fileList) {
                console.log(res);
                Notification({
                    title: '成功',
                    message: '文件上传成功',
                    type: 'success',
                    duration: 1000,
                });

                graphApi.getGraphById({graphid: this.$route.params.id}).then(res => {
                    this.data = res.data.data;
                    this.forEach(this.data);
                    this.$store.commit('app/SET_MAXID', this.max_id);
                    this.graph.read(this.data);
                    if (this.data.nodes.length) {
                        this.graph.fitView(100)
                    }
                }).catch(error => {
                    Message({
                        message: error,
                        type: 'error',
                        duration: 3000,
                    })
                })
                this.$emit('success', false)
            },
            onUploadErr(res, file, fileList) {
                console.log(res);
                this.$message({
                    message: res,
                    type: 'error',
                });
            },
            forEach(json) {
                for (const val in json) {
                    if (val === 'id' && typeof json[val] === 'string') {
                        this.max_id = Math.max(
                            this.max_id,
                            parseInt(json[val].replace(/[^0-9]/gi, ''))
                        )
                    }
                    if (typeof json[val] == 'object' && json[val] !== null) {
                        this.forEach(json[val])
                    }
                }
            },
        }
    }
</script>

<style scoped>

</style>