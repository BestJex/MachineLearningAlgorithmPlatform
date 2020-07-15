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
                                    @change="changeValue(node)"
                                    v-if="node.type==='object' || node.type==='str' || node.type==='model'"
                                    v-model="node.value"></el-input>
                            <!-- int/随机数类型输入框 -->
                            <el-input-number
                                    @change="changeValue(node)"
                                    v-if="node.type === 'int' || node.type === 'RandomState'"
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
                            <!-- 选择CSV文件 -->
                            <el-select
                                    @change="changeValue"
                                    placeholder="请选择"
                                    v-if="node.type==='file' && node.label==='文件'"
                                    v-model="node.value">
                                <el-option
                                        :label="item.filename"
                                        :value="item.id"
                                        v-for="item in csvFileList">
                                </el-option>
                            </el-select>
                            <!-- 选择Model文件 -->
                            <el-select
                                    @change="changeValue"
                                    placeholder="请选择"
                                    v-if="node.type==='file' && node.label==='模型'"
                                    v-model="node.value">
                                <el-option
                                        :label="item.filename"
                                        :value="item.id"
                                        v-for="item in modelFileList">
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
    import visualFile from './components/visualization'
    import graphApi from '@/api/graph'
    import {mapGetters} from 'vuex'
    import {Notification} from "element-ui";

    export default {
        data() {
            return {
                status: 'canvas-selected',
                showGrid: false,
                page: {},
                graph: {},
                item: {},
                visible: false,
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
            ...mapGetters(['docHeight', 'fileList']),
            graphId: {
                get() {
                    return this.$route.params.id || this.$store.getters.graphId;
                }
            },

            // 获取文件列表中的CSV文件
            csvFileList() {
                let ans = []
                for (let i = 0; i < this.fileList.length; i++) {
                    if (this.fileList[i].filename.endsWith("csv")) {
                        ans.push(this.fileList[i])
                    }
                }
                return ans
            },

            // 获取文件列表中的model文件
            modelFileList() {
                let ans = []
                for (let i = 0; i < this.fileList.length; i++) {
                    if (this.fileList[i].filename.endsWith("m")) {
                        ans.push(this.fileList[i])
                    }
                }
                return ans
            },
        },
        components: {
            visualFile,
        },
        created() {
            this.bindEvent();
        },
        methods: {
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
                                item.target.getModel().id,
                            );
                            self.node_detail = item.target.getModel().node_detail;
                            self.point_detail = item.target.getModel().point_detail;
                            this.$store.dispatch("app/getFileList")
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

            changeValue(node) {
                if (node.type === 'int' || node.type === 'RandomState') {
                    this.checkIntInput(node);
                }
                if (node.type === 'object' || node.type === 'str') {
                    if (!this.checkBraces(node.value)) {
                        node.value = ""
                        Notification({
                            title: '错误',
                            message: `${node.label}括号必须匹配！`,
                            type: 'error',
                            duration: 3000,
                        });
                    }
                }
                const model = {
                    node_detail: this.node_detail
                }
                this.graph.update(this.item, model);
            },

            // 检查输入内容中括号是否匹配
            checkBraces(braces) {
                let leftBraReg = /[\(\{\[]/, stack = [], bracket, rightBracket
                braces = braces.split('')
                for(bracket of braces) {
                    if(leftBraReg.test(bracket)) {
                        stack.push(bracket)
                    }
                    else {
                        switch (bracket) {
                            case ')':
                                rightBracket = stack.pop()
                                if(rightBracket !=='(') {
                                    return false
                                }
                                break
                            case ']':
                                rightBracket = stack.pop()
                                if(rightBracket !=='[') {
                                    return false
                                }
                                break
                            case '}':
                                rightBracket = stack.pop()
                                if(rightBracket !=='{') {
                                    return false
                                }
                                break
                        }
                    }
                }
                return stack.length === 0
            },

            checkIntInput(node) {
                if (!(parseInt(node.value, 10) === node.value)) {
                    node.value = Math.floor(node.value);
                    Notification({
                        title: '错误',
                        message: `${node.label}必须为整数！`,
                        type: 'error',
                        duration: 3000,
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
                let graph = this.graph.save();
                Object.assign(graph, {id: this.graphId});
                let data = {
                    graphid: this.graphId,
                    graph: JSON.stringify(graph),
                };
                graphApi.sendGraph(data).then(() => {
                }).catch(err => {
                    console.error(err);
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
<style lang="scss">
    #detailpannel {
        .el-dialog__wrapper {
            z-index: -1 !important;
        }
    }
</style>