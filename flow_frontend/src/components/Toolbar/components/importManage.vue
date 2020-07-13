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
                   accept=".json"
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
    import {Notification} from "element-ui";
    import configJS from "@/statics/config";
    import {mapGetters} from "vuex";

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
                        return fileApi.isFilenamehValid({
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
                    fileApi.isFilenamehValid({
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
                    duration: 3000
                });
            },
            onUploadErr(res, file, fileList) {
                console.log(res);
                this.$message({
                    message: res,
                    type: 'error',
                });
            },
        }
    }
</script>

<style scoped>

</style>