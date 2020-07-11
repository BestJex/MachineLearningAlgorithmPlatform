<template>
    <div>
        <div class="pannel"
             id="canvas_detailpannel"
             v-if="status==='canvas-selected'">
            <div class="pannel-title">画布</div>
            <div class="block-container">
                <el-checkbox @change="changeGridState"
                             v-model="showGrid">
                    网格对齐
                </el-checkbox>
            </div>
        </div>
        <div class="pannel"
             id="node_detailpannel"
             v-if="status==='node-selected'">
            <div class="pannel-title">
                模型详情
            </div>
            <div class="block-container">
                <el-scrollbar :native="false"
                              :noresize="true"
                              class="scroll-container">
                    <el-form class="form"
                             :style="`max-height: ${document.documentElement.clientHeight - 380}px;`"
                             label-position="top">
                        <el-form-item :key="node.label"
                                      :label="node.label"
                                      prop="node.label"
                                      v-for="node in node_detail">
                            <!-- 输入框 -->
                            <el-input :label="node.label"
                                      type="text"
                                      @change="changeValue"
                                      v-if="node.type==='object' || node.type==='str'"
                                      v-model="node.value"></el-input>
                            <!-- int类型输入框 -->
                            <el-input-number @change="changeValue"
                                             v-if="node.type === 'int' || node.name === 'name' || node.type === 'RandomState'"
                                             type="number"
                                             v-model="node.value"
                                             :placeholder="node.default"></el-input-number>
                            <!-- float类型输入框 -->
                            <el-input-number @change="changeValue"
                                             v-if="node.type==='float'"
                                             type="number"
                                             v-model="node.value"
                                             :placeholder="node.default"></el-input-number>
                            <!-- 滑动器 -->
                            <el-slider @change="changeValue"
                                       input-size="mini"
                                       show-input
                                       v-if="node.type==='slider'"
                                       v-model="node.value"></el-slider>
                            <!-- 多选框 -->
                            <el-checkbox @change="changeValue"
                                         v-if="node.type==='checkbox'"
                                         v-model="node.value"></el-checkbox>
                            <!-- 选择文件 -->
                            <el-select @change="changeValue"
                                       placeholder="请选择"
                                       v-if="node.type==='file'"
                                       v-model="node.value">
                                <el-option :key="item"
                                           :label="item.name"
                                           :value="item.id"
                                           v-for="item in fileTableData"></el-option>
                            </el-select>
                            <!-- 选择算法 -->
                            <el-select @change="changeValue"
                                       placeholder="请选择"
                                       v-if="node.type==='selection'"
                                       v-model="node.value">
                                <el-option :key="item"
                                           :label="item"
                                           :value="item"
                                           v-for="item in node.selection"></el-option>
                            </el-select>
                            <!-- 下载文件 -->
                            <div style="text-align: center;"
                                 v-if="node.type==='download'">
                                <el-button @click="downloadFile"
                                           plain
                                           type="info">{{ node.name }}
                                </el-button>
                            </div>
                            <!-- 预览文件 -->
                            <!--                            <detail-preview-->
                            <!--                                    :node_id="item.getModel().id"-->
                            <!--                                    v-if="node.type === 'preview'"/>-->
                            <!--                            <visual-file-->
                            <!--                                    :node_id="item.getModel().id"-->
                            <!--                                    v-if="node.type==='visualization'"-->
                            <!--                                    v-show="!isShowEcharts"/>-->
                        </el-form-item>
                    </el-form>
                </el-scrollbar>
            </div>
        </div>
    </div>
</template>

<script>
    import api from "@/config/api";
    import eventBus from "@/mixin/eventBus";
    import Grid from "@antv/g6/es/plugins/grid";

    export default {
        name: "detail",
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
            graphId: {
                get() {
                    return this.$route.params.id;
                }
            },
        },
        created() {
            this.bindEvent();
            this.getFileList();
        },
        methods: {
            bindEvent() {
                eventBus.$on('afterAddPage', page => {
                    this.page = page;
                    this.graph = this.page.graph;
                    eventBus.$on('nodeselectchange', item => {
                        if (item.select === true && item.target.getType() === 'node') {
                            this.status = 'node-selected';
                            this.item = item.target;
                            this.node_detail = item.target.getModel().node_detail;
                            this.point_detail = item.target.getModel().point_detail;
                        } else {
                            this.status = 'canvas-selected';
                            this.item = null;
                            this.node = null;
                            this.node_detail = null;
                            this.point_detail = null;
                        }
                    });
                });
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
            downloadFile() {
                location.href = `${api.BaseAPI}download_file?graphId=${this.graphId}&nodeId=${
                    this.item.getModel().id
                }`;
            },
            // eslint-disable-next-line no-unused-vars
            changeValue(e) {
                const model = {
                    node_detail: this.node_detail
                }
                this.graph.update(this.item, model);
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

    #detailpannel {
        .el-dialog__wrapper {
            z-index: -1 !important;
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
        top: 0;
        bottom: 0;
        z-index: 99;

        &:hover {
            background-image: radial-gradient(
                            ellipse at center center,
                            rgba(0, 0, 0, 0.2) 0%,
                            transparent 70%,
                            transparent 100%
            );
            background-size: 50px 100%;
            background-position: 0 50%;
        }
    }
</style>