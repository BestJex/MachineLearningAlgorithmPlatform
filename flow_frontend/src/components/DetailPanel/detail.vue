<template>
    <div>
        <div
                class="pannel"
                id="canvas_detailpannel"
                v-if="status==='canvas-selected'">
            <div class="pannel-title">面板</div>
            <div class="block-container">
                <el-checkbox
                        @change="changeGridState"
                        v-model="showGrid">
                    网格对齐
                </el-checkbox>
            </div>
        </div>
        <div class="pannel" id="node_detailpannel" v-if="status==='node-selected'">
            <div class="pannel-title">模型详情</div>
            <div class="block-container">
                <el-scrollbar :native="false" :noresize="true" class="scroll-container">
                    <el-form class="form" :style="`max-height: ${docHeight - 380}px;`" label-position="top">
                        <el-form-item
                                :label="node.label"
                                prop="node.label"
                                v-for="node in node_detail">
                            <!-- 输入框 -->
                            <el-input
                                    type="text"
                                    @change="changeValue"
                                    v-if="node.type==='object' || node.type==='str'"
                                    v-model="node.value"></el-input>
                            <!-- int类型输入框 -->
                            <el-input-number
                                    @change="changeValue"
                                    @input="checkIntInput(node.name + node.number, node.label, node.value)"
                                    v-if="node.type === 'int'"
                                    type="number"
                                    :id="node.name + node.number"
                                    v-model="node.value"></el-input-number>
                            <!-- 随机数类型输入框 -->
                            <el-input-number
                                    @change="changeValue"
                                    @input="checkIntInput(node.label, node.value)"
                                    v-if="node.type === 'RandomState'"
                                    type="number"
                                    v-model="node.value"></el-input-number>
                            <!-- float类型输入框 -->
                            <el-input-number
                                    @change="changeValue"
                                    v-if="node.type==='float'"
                                    type="number"
                                    v-model="node.value"></el-input-number>
                            <!-- 滑动器 -->
                            <el-slider
                                    @change="changeValue"
                                    input-size="mini"
                                    show-input
                                    v-if="node.type==='slider'"
                                    v-model="node.value"></el-slider>
                            <!-- 多选框 -->
                            <el-checkbox
                                    @change="changeValue"
                                    v-if="node.type==='checkbox'"
                                    v-model="node.value"></el-checkbox>
                            <!-- 选择文件 -->
                            <el-select
                                    @change="changeValue"
                                    placeholder="请选择"
                                    v-if="node.type==='file'"
                                    v-model="node.value">
                                <el-option
                                        :label="item.filename"
                                        :value="item.id"
                                        v-for="item in fileTableData">
                                </el-option>
                            </el-select>
                            <!-- 选择算法 -->
                            <el-select
                                    @change="changeValue"
                                    placeholder="请选择"
                                    v-if="node.type==='selection'"
                                    v-model="node.value">
                                <el-option
                                        :label="item"
                                        :value="item"
                                        v-for="item in node.selection"></el-option>
                            </el-select>
                            <!-- 下载文件 -->
                            <div style="text-align: center;"
                                 v-if="node.type==='download'">
                                <el-button
                                        @click="downloadFile"
                                        plain
                                        type="info">{{ node.name }}</el-button>
                            </div>
                            <!-- 预览文件 -->
                            <detail-preview
                                    :node_id="item.getModel().id"
                                    v-if="node.type === 'preview'"/>
                            <visual-file
                                    :node_id="item.getModel().id"
                                    v-if="node.type==='visualization'"
                                    v-show="!isShowEcharts"/>
                        </el-form-item>
                    </el-form>
                </el-scrollbar>
            </div>
        </div>
    </div>
</template>

<script>
    import eventBus from '@/utils/eventBus'
    import Grid from '@antv/g6/build/grid'
    import detailPreview from './components/preview'
    import visualFile from './components/visualization'
    import graphApi from '@/api/graph'
    import {mapGetters} from 'vuex'
    import configJS from '@/statics/config'
    import {Notification} from "element-ui";

    export default {
        data() {
            return {
                status: 'canvas-selected',
                showGrid: false,
                page: {},
                graph: {},
                item: {},
                fileTableData: [],
                node_detail: {},
                point_detail: {},
                point_options: [
                    {
                        id: 1,
                        value: 'select-all'
                    },
                    {
                        id: 2,
                        value: 'random-select'
                    }
                ],
                grid: null,
            }
        },
        computed: {
            ...mapGetters(['isShowPreview', 'isShowEcharts', 'docHeight']),
            graphId: {
                get() {
                    return this.$route.params.id || this.$store.getters.graphId;
                }
            }
        },
        components: {
            detailPreview,
            visualFile
        },
        created() {
            this.init();
            this.bindEvent();
        },
        methods: {
            init() {

            },
            getFileList() {
                let projectId = this.$route.params.id;
                this.axios({
                    method: 'get',
                    url: `http://39.105.21.62/flow/api/filelistall?username=${localStorage.getItem('username')}`,
                }).then(res => {
                    this.fileTableData = Array(res.data.data.list)[0];
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
                }).catch(err => {
                    this.$message({
                        message: err,
                        type: 'error'
                    });
                });
            },
            bindEvent() {
                let self = this
                eventBus.$on('afterAddPage', page => {
                    self.page = page;
                    self.graph = self.page.graph;
                    eventBus.$on('nodeselectchange', item => {
                        if (item.select === true && item.target.getType() === 'node') {
                            self.status = 'node-selected';
                            self.item = item.target;
                            this.$store.commit(
                                'app/SET_SETSELECTEDNODEID',
                                item.target.getModel().id
                            );
                            self.node_detail = item.target.getModel().node_detail;
                            self.point_detail = item.target.getModel().point_detail;
                            this.getFileList();
                            console.log(self.node_detail);
                        } else {
                            self.status = 'canvas-selected';
                            this.$store.commit('app/SET_SETSELECTEDNODEID', null);
                            self.item = null;
                            self.node = null;
                            self.node_detail = null;
                            self.point_detail = null;
                        }
                    })
                })
            },

            downloadFile() {
                location.href = `${configJS.BASE_API}download_file?graphId=${this.graphId}&nodeId=${
                    this.item.getModel().id
                }`;
            },

            changeValue(e) {
                const model = {
                    node_detail: this.node_detail
                }
                this.graph.update(this.item, model);
            },

            checkIntInput(id, label, value) {
                if (!(parseInt(value, 10) === value)) {
                    Notification({
                        title: '错误',
                        message: `${label}必须为整数！`,
                        type: 'error',
                        duration: 1000,
                    });
                }
            },

            /**
             * 画布添加网格
             * @param value
             */
            changeGridState(value) {
                if (value) {
                    this.grid = new Grid();
                    this.graph.addPlugin(this.grid);
                } else {
                    this.graph.removePlugin(this.grid);
                }
            },

            saveDetail() {
                const loading = this.$loading({
                    lock: true,
                    text: '保存中',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.8)'
                });
                let graph = this.graph.save();
                Object.assign(graph, {id: this.graphId});
                let data = {
                    graphid: this.graphId,
                    graph: JSON.stringify(graph),
                };
                graphApi.sendGraph(data).then(res => {
                    loading.close()
                }).catch(err => {
                    console.error(err);
                    loading.close();
                })
            }
        }
    }
</script>
<style lang="scss">
    .detailpannel {
        .el-slider {
            display: grid;
        }

        .el-slider__runway.show-input {
            margin-right: 0 !important;
        }
    }
</style>
<style lang="scss" scoped>
    .block-container {
        padding: 16px 8px;
    }

    .block-container .el-col {
        height: 28px;
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }

    .pannel-title {
        text-align: center;
        height: 32px;
        border-top: 1px solid #dce3e8;
        border-bottom: 1px solid #dce3e8;
        background: #ebeef2;
        color: #000;
        line-height: 28px;
        padding-left: 12px;
    }

    .resizer {
        cursor: col-resize;
        position: absolute;
        width: 10px;
        top: 0px;
        bottom: 0px;
        z-index: 99;

        &:hover {
            background-image: radial-gradient(
                            ellipse at center center,
                            rgba(0, 0, 0, 0.2) 0%,
                            transparent 70%,
                            transparent 100%
            );
            background-size: 50px 100%;
            background-position: 0px 50%;
        }
    }
</style>
<style lang="scss">
    #detailpannel {
        .el-dialog__wrapper {
            z-index: -1 !important;
        }
    }
</style>