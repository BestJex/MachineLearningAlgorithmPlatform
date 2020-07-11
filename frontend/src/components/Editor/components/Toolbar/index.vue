<template>
    <div class="toolbar">
        <transition name="el-zoom-in-center">
            <div :class="{'delay-5': !isRunning}" v-show="!isRunning">
                <link href="//at.alicdn.com/t/font_598462_3xve1872wizzolxr.css"
                      rel="stylesheet"
                      type="text/css"/>
                <i :class="undoList.length>0?'':'disable'"
                   @click="handleUndo"
                   class="command iconfont icon-undo"
                   title="撤销"></i>
                <i :class="redoList.length>0?'':'disable'"
                   @click="handleRedo"
                   class="command iconfont icon-redo"
                   title="重做"></i>
                <span class="separator"></span>
                <i :class="selectedItem.length?'':'disable'"
                   @click="handleDelete"
                   class="command iconfont icon-delete-o"
                   data-command="delete"
                   title="删除"></i>
                <span class="separator"></span>
                <i @click="handleZoomIn"
                   class="command iconfont icon-zoom-in-o"
                   data-command="zoomIn"
                   title="放大"></i>
                <i @click="handleZoomOut"
                   class="command iconfont icon-zoom-out-o"
                   data-command="zoomOut"
                   title="缩小"></i>
                <i @click="handleAutoZoom"
                   class="command iconfont icon-fit"
                   data-command="autoZoom"
                   title="适应画布"></i>
                <i @click="handleResetZoom"
                   class="command iconfont icon-actual-size-o"
                   data-command="resetZoom"
                   title="实际尺寸"></i>
                <span class="separator"></span>
                <i :class="selectedItem.length?'':'disable'"
                   @click="handleToBack"
                   class="command iconfont icon-to-back"
                   data-command="toBack"
                   title="层级后置"></i>
                <i :class="selectedItem.length?'':'disable'"
                   @click="handleToFront"
                   class="command iconfont icon-to-front"
                   data-command="toFront"
                   title="层级前置"></i>
                <span class="separator"></span>
                <span class="separator"></span>
                <i :class="multiSelect?'disable':''"
                   @click="handleMuiltSelect"
                   class="command iconfont icon-select"
                   data-command="multiSelect"
                   title="多选"></i>
                <el-button @click="isShowNodeManage = true"
                           type="primary">
                    新增结点
                </el-button>
                <el-button @click="isShowFileManagement = true"
                           type="primary">
                    项目文件管理
                </el-button>
                <el-button :disabled="selectedNodeId==null"
                           @click="runNode"
                           type="success">
                    运行结点
                </el-button>
                <el-button @click="runProject"
                           type="success">
                    运行项目
                </el-button>
                <el-button @click="drawer = true"
                           type="success">
                    运行信息
                </el-button>
                <el-dropdown size="mini"
                             split-button
                             type="info"
                             style="float: right; margin-right: 10px;">
                    导出
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                            <el-link target="_blank"
                                     :href="pythonFilePath"
                                     :underline="false">
                                导出.py文件
                            </el-link>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <el-link target="_blank"
                                     :href="jsonFilePath"
                                     :underline="false">
                                导出.json文件
                            </el-link>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-drawer :visible.sync="drawer"
                           :direction="direction"
                           :with-header="false">
                    <span>我来啦!</span>
                </el-drawer>
            </div>
        </transition>
        <transition name="el-zoom-in-center">
            <div :class="{'delay-4': isRunning, 'delay-0': !isRunning}"
                 style="text-align: center;"
                 v-show="isRunning">
                <span>正在运行</span>
            </div>
        </transition>
        <el-dialog :append-to-body="true"
                   :visible.sync="isShowFileManagement"
                   custom-class="preview-dialog"
                   title="文件管理">
            <file-manage :graph="graph"></file-manage>
        </el-dialog>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import command from "@/config/command";
    import projectApi from "@/api/project";
    import eventBus from "@/mixin/eventBus";
    import {Notification} from 'element-ui';
    import fileManage from "@/components/Editor/components/Toolbar/components/fileManage";

    export default {
        name: "Toolbar",
        components: {
            fileManage,
        },
        data() {
            return {
                page: {},
                graph: {},
                max_id: 0,
                redoList: [],
                undoList: [],
                editor: null,
                command: null,
                drawer: false,
                addGroup: false,
                direction: 'btt',
                selectedItem: [],
                jsonFilePath: "",
                pythonFilePath: "",
                multiSelect: false,
                isShowFileManagement: false,
            }
        },
        computed: {
            ...mapGetters(['isAllowSave', 'selectedNodeId']),
            isRunning: {
                get() {
                    return this.$store.state.project.isRunning;
                },
                set(val) {
                    this.$store.commit('project/SetIsRunning', val);
                },
            },
            graphId: {
                get() {
                    return this.$route.params.id;
                }
            },
        },
        created() {
            this.initEditor();
            this.bindEvent();
        },
        watch: {
            selectedItem(val) {
                this.addGroup = !!(val && val.length > 1);
            }
        },
        methods: {
            initEditor() {
                this.command = command;
            },

            bindEvent() {
                eventBus.$on('afterAddPage', page => {
                    this.page = page;
                    this.graph = this.page.graph;
                });
                eventBus.$on('add', data => {
                    this.redoList = data.redoList;
                    this.undoList = data.undoList;
                });
                eventBus.$on('update', data => {
                    this.redoList = data.redoList;
                    this.undoList = data.undoList;
                });
                eventBus.$on('delete', data => {
                    this.redoList = data.redoList;
                    this.undoList = data.undoList;
                });
                eventBus.$on('updateItem', item => {
                    this.command.executeCommand('update', [item]);
                });
                eventBus.$on('addItem', item => {
                    this.command.executeCommand('add', [item]);
                });
                eventBus.$on('nodeselectchange', () => {
                    this.selectedItem = this.graph.findAllByState('node', 'selected');
                    this.selectedItem = this.selectedItem.concat(
                        ...this.graph.findAllByState('edge', 'selected')
                    );
                });
                eventBus.$on('deleteItem', () => {
                    this.handleDelete();
                });
                eventBus.$on('muliteSelectEnd', () => {
                    this.multiSelect = false;
                    this.selectedItem = this.graph.findAllByState('node', 'selected');
                });
                eventBus.$on('undo', () => {
                    this.handleUndo();
                });
                eventBus.$on('redo', () => {
                    this.handleRedo();
                });
                eventBus.$on('save', () => {
                    this.handleSave();
                });
                eventBus.$on('selectAll', () => {
                    this.handleSelectAll();
                });
            },
            handleUndo() {
                if (this.undoList.length > 0) {
                    this.command.undo();
                }
            },
            handleRedo() {
                if (this.redoList.length > 0) {
                    this.command.redo();
                }
            },
            forEach(json) {
                for (let val in json) {
                    if (val === 'id' && typeof json.val === 'string') {
                        this.max_id = Math.max(
                            this.max_id,
                            parseInt(json.val.replace(/[^0-9]/gi, ''))
                        )
                    }
                    if (typeof json.val == 'object' && json.val !== null) {
                        this.forEach(json.val);
                    }
                }
            },
            handleSave() {
                if (this.isAllowSave) {
                    this.$store.commit('project/SetAllowSave', false)
                    const loading = this.$loading({
                        lock: true,
                        text: '保存中',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.8)',
                    });
                    let graph = this.graph.save();
                    Object.assign(graph, {id: this.graphId});
                    let data = {
                        graphid: this.graphId,
                        graph: JSON.stringify(graph),
                    };
                    projectApi.sendGraph(data).then(() => {
                        Notification({
                            title: '成功',
                            message: '保存成功',
                            type: 'success',
                            duration: 3000,
                        });
                    }).then(() => {
                        return projectApi.getGraphById({graphid: this.graphId});
                    }).then(response => {
                        const data = response.data.data;
                        this.forEach(data);
                        this.$store.commit('project/SetMaxId', this.maxId);
                        this.graph.read(data);
                        if (data.nodes.length) {
                            this.graph.fitView(100);
                        }
                        loading.close();
                    }).catch(err => {
                        loading.close();
                        Notification({
                            title: '错误',
                            message: err,
                            type: 'error',
                            duration: 3000,
                        });
                    })
                }
            },
            handleDelete() {
                if (this.selectedItem.length > 0) {
                    this.command.executeCommand('delete', this.selectedItem);
                    this.selectedItem = [];
                }
            },
            getViewCenter() {
                const padding = this.getFormatPadding();
                const graph = this.graph;
                const width = this.graph.get('width');
                const height = graph.get('height');
                return {
                    x: (width - padding[2] - padding[3]) / 2 + padding[3],
                    y: (height - padding[0] - padding[2]) / 2 + padding[0]
                };
            },
            handleZoomIn() {
                const currentZoom = this.graph.getZoom();
                this.graph.zoomTo(currentZoom + 0.5, this.getViewCenter());
            },
            handleZoomOut() {
                const currentZoom = this.graph.getZoom();
                this.graph.zoomTo(currentZoom - 0.5, this.getViewCenter());
            },
            handleToBack() {
                if (this.selectedItem && this.selectedItem.length > 0) {
                    this.selectedItem.forEach(item => {
                        item.toBack()
                        this.graph.paint()
                    })
                }
            },
            handleToFront() {
                if (this.selectedItem && this.selectedItem.length > 0) {
                    this.selectedItem.forEach(item => {
                        if (item.getType() === 'edge') {
                            // const nodeGroup = this.graph.get("nodeGroup");
                            // const edgeGroup = item.get("group");
                            // nodeGroup.toFront();
                            // edgeGroup.toFront()
                        } else {
                            item.toFront()
                        }
                        this.graph.paint()
                    })
                }
            },
            handleAutoZoom() {
                this.graph.fitView(20)
            },
            handleResetZoom() {
                this.graph.zoomTo(1, this.getViewCenter())
            },
            handleMuiltSelect() {
                this.multiSelect = true
                this.graph.setMode('multiSelect')
            },
            runProject() {
                let graph = this.graph.save()
                Object.assign(graph, {id: this.graphId})
                projectApi.runProject({graph: JSON.stringify(graph)}).then(() => {
                    console.log('正在运行')
                    this.isRunning = true
                }).catch(err => {
                    Notification({
                        title: '错误',
                        message: err.data,
                        type: 'error',
                        duration: 3000,
                    })
                    this.isRunning = false;
                });
            },
            runNode() {
                let graph = this.graph.save();
                Object.assign(graph, {id: this.graphId});
                projectApi.runNode({graph: JSON.stringify(graph), nodeId: this.selectedNodeId}).then(() => {
                    this.isRunning = true
                }).catch(err => {
                    Notification({
                        title: '错误',
                        message: err.data,
                        type: 'error',
                        duration: 3000,
                    });
                    this.isRunning = false;
                });
            },
        }
    }
</script>

<style scoped>
    .toolbar {
        box-sizing: border-box;
        padding: 8px 0;
        width: 100%;
        border: 1px solid #e9e9e9;
        height: 42px;
        z-index: 3;
        box-shadow: 0 8px 12px 0 rgba(0, 52, 107, 0.04);
    }

    .toolbar .command:nth-of-type(1) {
        margin-left: 24px;
    }

    .toolbar .command {
        box-sizing: border-box;
        width: 27px;
        height: 27px;
        margin: 0 5px;
        border-radius: 2px;
        padding-left: 5px;
        padding-top: 5px;
        display: inline-block;
        border: 1px solid rgba(2, 2, 2, 0);
    }

    .toolbar .command:hover {
        cursor: pointer;
        border: 1px solid #e9e9e9;
    }

    .toolbar .disable {
        color: rgba(0, 0, 0, 0.25);
    }

    .toolbar .separator {
        margin: 4px;
        border-left: 1px solid #e9e9e9;
    }

    .delay-0 {
        transition: none;
    }

    .delay-4 {
        transition-delay: 0.4s;
    }

    .delay-5 {
        transition-delay: 0.1s;
    }
</style>