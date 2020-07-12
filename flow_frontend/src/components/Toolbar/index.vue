<template>
	<div class="toolbar">
		<transition name="el-zoom-in-center">
			<div :class="{'delay-5': !isRunning}" v-show="!isRunning">
				<link
					href="//at.alicdn.com/t/font_598462_3xve1872wizzolxr.css"
					rel="stylesheet"
					type="text/css"/>
				<i
					:class="undoList.length>0?'':'disable'"
					@click="handleUndo"
					class="command iconfont icon-undo"
					title="撤销"></i>
				<i
					:class="redoList.length>0?'':'disable'"
					@click="handleRedo"
					class="command iconfont icon-redo"
					title="重做"></i>
				<span class="separator"></span>
				<!-- <i data-command="copy" class="command iconfont icon-copy-o disable" title="复制"></i>
				<i data-command="paste" class="command iconfont icon-paster-o disable" title="粘贴"></i>-->
				<i
					:class="selectedItem.length?'':'disable'"
					@click="handleDelete"
					class="command iconfont icon-delete-o"
					data-command="delete"
					title="删除"></i>
				<span class="separator"></span>
				<i
					@click="handleZoomIn"
					class="command iconfont icon-zoom-in-o"
					data-command="zoomIn"
					title="放大"></i>
				<i
					@click="handleZoomOut"
					class="command iconfont icon-zoom-out-o"
					data-command="zoomOut"
					title="缩小"></i>
				<i
					@click="handleAutoZoom"
					class="command iconfont icon-fit"
					data-command="autoZoom"
					title="适应画布"></i>
				<i
					@click="handleResetZoom"
					class="command iconfont icon-actual-size-o"
					data-command="resetZoom"
					title="实际尺寸"></i>
				<span class="separator"></span>
				<i
					:class="selectedItem.length?'':'disable'"
					@click="handleToBack"
					class="command iconfont icon-to-back"
					data-command="toBack"
					title="层级后置"></i>
				<i
					:class="selectedItem.length?'':'disable'"
					@click="handleToFront"
					class="command iconfont icon-to-front"
					data-command="toFront"
					title="层级前置"></i>
				<span class="separator"></span>
				<span class="separator"></span>
				<i
					:class="multiSelect?'disable':''"
					@click="handleMuiltSelect"
					class="command iconfont icon-select"
					data-command="multiSelect"
					title="多选"></i>
				<!-- <i
				  :class="addGroup?'':'disable'"
				  @click="handleAddGroup"
				  class="command iconfont icon-group"
				  data-command="addGroup"
				  title="成组"
				></i>
				<i class="command iconfont icon-ungroup disable" data-command="unGroup" title="解组"></i>-->
				<el-button @click="isShowNodeManage = true" type="primary">新增结点</el-button>
				<el-button @click="isShowFileManagement = true" type="primary">项目文件管理</el-button>
				<el-button :disabled="selectedNodeId==null" @click="runNode" type="success">运行结点</el-button>
				<el-button @click="runProject" type="success">运行项目</el-button>
				<el-button @click="getTerminal" type="success">运行信息</el-button>

				<el-dropdown style="float: right; margin-right: 10px;">
					<el-button type="primary">
						生成代码<i class="el-icon-arrow-down el-icon--right"></i>
					</el-button>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item>导出.py文件</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			<!-- 	<el-drawer
					:visible.sync="drawer"
					:direction="direction"
					:with-header="false">

					
				</el-drawer> -->

			</div>
		</transition>
		<transition name="el-zoom-in-center">
			<div
				:class="{'delay-4': isRunning, 'delay-0': !isRunning}"
				style="text-align: center;"
				v-show="isRunning">
				<span>正在运行</span>
			</div>
		</transition>
		<el-dialog
			:append-to-body="true"
			:visible.sync="isShowFileManagement"
			custom-class="preview-dialog"
			title="文件管理">
			<file-manage :graph="graph"></file-manage>
		</el-dialog>
		<el-dialog
			:append-to-body="true"
			:visible.sync="isShowNodeManage"
			custom-class="preview-dialog"
			title="新增结点">
			<node-manage/>
		</el-dialog>
	</div>
</template>

<script>
    import eventBus from '@/utils/eventBus'
    import Util from '@antv/g6/src/util'
    import { uniqueId, getBox } from '@/utils'
    import graphApi from '@/api/graph'
    import { mapGetters } from 'vuex'
	import { mapState } from 'vuex'
    import { Notification } from 'element-ui'
    import fileManage from './components/fileManage'
    import nodeManage from './components/nodeManage'
	import configJS from "@/statics/config";

    export default {
        data() {
            return {
                jsonFilePath: '',
                pythonFilePath: '',

                page: {},
                graph: {},
                redoList: [],
                undoList: [],
                editor: null,
                command: null,
                selectedItem: [],
                multiSelect: false,
                addGroup: false,
                isShowFileManagement: false,
                max_id: 0,

                drawer: false,
                direction: 'btt',
            }
        },
        computed: {
            ...mapGetters(['isAllowSave', 'selectedNodeId']),
            isRunning: {
                get() {
                    return this.$store.state.app.is_running
                },
                set(val) {
                    this.$store.commit('app/SET_ISRUNNING', val)
                }
            },
            isShowNodeManage: {
                get() {
                    return this.$store.state.app.is_show_node_manage
                },
                set(val) {
                    this.$store.commit('app/SET_ISSHOWNODEMANAGE', val)
                }
            },
            graphId: {
                get() {
                    return this.$route.params.id || this.$store.getters.graphId
                }
            }
        },
        components: {
            fileManage,
            nodeManage
        },
        created() {
            this.init()
            this.bindEvent()
        },
        watch: {
            selectedItem(val) {
                this.addGroup = !!(val && val.length > 1)
            }
        },
        methods: {
            init() {
                const { editor, command } = this.$parent
                this.editor = editor
                this.command = command
            },
            bindEvent() {
                let self = this
                eventBus.$on('afterAddPage', page => {
                    self.page = page
                    self.graph = self.page.graph
                })
                eventBus.$on('add', data => {
                    this.redoList = data.redoList
                    this.undoList = data.undoList
                })
                eventBus.$on('update', data => {
                    this.redoList = data.redoList
                    this.undoList = data.undoList
                })
                eventBus.$on('delete', data => {
                    this.redoList = data.redoList
                    this.undoList = data.undoList
                })
                eventBus.$on('updateItem', item => {
                    this.command.executeCommand('update', [item])
                })
                eventBus.$on('addItem', item => {
                    this.command.executeCommand('add', [item])
                })
                eventBus.$on('nodeselectchange', () => {
                    this.selectedItem = this.graph.findAllByState('node', 'selected')
                    this.selectedItem = this.selectedItem.concat(
                        ...this.graph.findAllByState('edge', 'selected')
                    )
                })
                eventBus.$on('deleteItem', () => {
                    this.handleDelete()
                })
                eventBus.$on('muliteSelectEnd', () => {
                    this.multiSelect = false
                    this.selectedItem = this.graph.findAllByState('node', 'selected')
                })
                eventBus.$on('undo', () => {
                    this.handleUndo()
                })
                eventBus.$on('redo', () => {
                    this.handleRedo()
                })
                eventBus.$on('save', () => {
                    this.handleSave()
                })
                eventBus.$on('selectAll', () => {
                    this.handleSelectAll()
                })
            },
            handleUndo() {
                if (this.undoList.length > 0) this.command.undo()
            },
            handleRedo() {
                if (this.redoList.length > 0) this.command.redo()
            },
            forEach(json) {
                for (var val in json) {
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
			downloadFile() {
				location.href = `${configJS.BASE_API}download_file?graphId=${this.graphId}`;
			},
            handleSave() {
                if (this.isAllowSave) {
                    this.$store.commit('app/SET_ALLOWSAVE', false)
                    const loading = this.$loading({
                        lock: true,
                        text: '保存中',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.8)'
                    })
                    let graph = this.graph.save()
                    Object.assign(graph, { id: this.graphId })
                    let data = {
                        graphid: this.graphId,
                        graph: JSON.stringify(graph),
                    }
                    console.log(data)
                    graphApi.sendGraph(data).then(res => {
                        Notification({
                            title: '成功',
                            message: '保存成功',
                            type: 'success',
                            duration: 3000
                        })
                    }).then(() => {
                        return graphApi.getGraphById({ graphid: this.graphId })
                    }).then(res => {
                        const data = res.data.data
                        this.forEach(data)
                        this.$store.commit('app/SET_MAXID', this.max_id)
                        this.graph.read(data)
                        if (data.nodes.length) {
                            this.graph.fitView(100)
                        }
                        loading.close()
                    }).catch(err => {
                        loading.close()
                        Notification({
                            title: '错误',
                            message: err,
                            type: 'error',
                            duration: 3000
                        })
                    })
                }
            },
            handleDelete() {
                if (this.selectedItem.length > 0) {
                    this.command.executeCommand('delete', this.selectedItem)
                    this.selectedItem = []
                }
            },
            getFormatPadding() {
                return Util.formatPadding(this.graph.get('fitViewPadding'))
            },
            getViewCenter() {
                const padding = this.getFormatPadding()
                const graph = this.graph
                const width = this.graph.get('width')
                const height = graph.get('height')
                return {
                    x: (width - padding[2] - padding[3]) / 2 + padding[3],
                    y: (height - padding[0] - padding[2]) / 2 + padding[0]
                }
            },
            handleZoomIn() {
                const currentZoom = this.graph.getZoom()
                this.graph.zoomTo(currentZoom + 0.5, this.getViewCenter())
            },
            handleZoomOut() {
                const currentZoom = this.graph.getZoom()
                this.graph.zoomTo(currentZoom - 0.5, this.getViewCenter())
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
            handleAddGroup() {
                // TODO 这部分等阿里更新Group之后添加
                // const model = {
                //   id: "group" + store.state.app.max_id,
                //   title: "新建分组"
                // };
                // // this.command.executeCommand("add", "group", model);
                // this.selectedItem.forEach(item => {
                // });
                //this.getPosition(this.selectedItem);
            },
            getPosition(items) {
                const boxList = []
                items.forEach(item => {
                    const box = item.getBBox()
                    boxList.push(getBox(box.x, box.y, box.width, box.height))
                })
                let minX1, minY1, MaxX2, MaxY2
                boxList.forEach(box => {
                    if (typeof minX1 == 'undefined') {
                        minX1 = box.x1
                    }
                    if (typeof minY1 == 'undefined') {
                        minY1 = box.y1
                    }
                    if (typeof MaxX2 == 'undefined') {
                        MaxX2 = box.x2
                    }
                    if (typeof MaxY2 == 'undefined') {
                        MaxY2 = box.y2
                    }
                    if (minX1 > box.x1) {
                        minX1 = box.x1
                    }
                    if (minY1 > box.y1) {
                        minY1 = box.y1
                    }
                    if (MaxX2 < box.x2) {
                        MaxX2 = box.x2
                    }
                    if (MaxY2 < box.y2) {
                        MaxY2 = box.y2
                    }
                })
                this.$store.dispatch('app/uniqueId')
                const width = MaxX2 - minX1,
                    height = MaxY2 - minY1,
                    x = minX1 + width / 2,
                    y = minY1 + height / 2,
                    id = 'team' + this.$store.state.app.max_id
                const model = {
                    id: id,
                    width,
                    height,
                    x,
                    y,
                    shape: 'teamNode'
                }
                this.command.executeCommand('add', model)
                // const item = this.graph.findById(id);
                // item.get("group").toBack();
                // const edgeGroup = this.graph.get("edgeGroup");
                // edgeGroup.toFront();
                // this.graph.paint();
            },
            handleSelectAll() {
                const nodes = this.graph.findAll('node', node => {
                    return true
                })
                Util.each(nodes, node => {
                    this.graph.setItemState(node, 'selected', true)
                })
                const edges = this.graph.findAll('edge', edge => {
                    return true
                })
                Util.each(edges, edge => {
                    this.graph.setItemState(edge, 'selected', true)
                })
                this.selectedItem = nodes
                this.graph.paint()
            },

            consoleData() {
                const data = this.graph.save()
                Object.assign(data, { id: 1 })
                // graphApi.uploadJson(data).then(res => {
                // })
            },
            runProject() {
                let graph = this.graph.save()
                Object.assign(graph, { id: this.graphId })
                graphApi
                    .runProject({ graph: JSON.stringify(graph) })
                    .then(res => {
                        console.log('正在运行')
                        this.isRunning = true
                    })
                    .catch(err => {
                        Notification({
                            title: '错误',
                            message: err.data,
                            type: 'error',
                            duration: 3000
                        })
                        this.isRunning = false
                    })
            },
            runNode() {
                let graph = this.graph.save()
                Object.assign(graph, { id: this.graphId })
                graphApi
                    .runNode({ graph: JSON.stringify(graph), nodeId: this.selectedNodeId })
                    .then(res => {
                        console.log('正在运行')
                        this.isRunning = true
                    })
                    .catch(err => {
                        Notification({
                            title: '错误',
                            message: err.data,
                            type: 'error',
                            duration: 3000
                        })
                        this.isRunning = false
                    })
            },
            addNode() {
            },
			
			getTerminal() {
				this.$store.commit('app/SET_TERMINALDISPLAY', 'block')
			}
           
        }
    }
</script>


<style lang="scss" scoped>
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
		margin: 0 6px;
		border-radius: 2px;
		padding-left: 4px;
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

	.terminal-top {
		position: absolute;
		top: 0;
		padding: 5px 8px 7px 8px;
		width: 100%;
		background-color: rgb(246, 249, 252);
		font-size: 12px;

		.a {
			width: 41%;
			display: flex;
			justify-content: space-between;
		}

		.b {
			width: 20%;
			display: flex;
			justify-content: space-between;
		}

	}

	.terminal-body {
		margin-top: 27px;
		height: 215px;

		.a {
			overflow-y: scroll;
		}

		.b {
			overflow-y: scroll;
		}

		.c {
			overflow: hidden;
		}

	}

	.terminal-foot {
		position: absolute;
		bottom: 0;
		display: flex;
		justify-content: space-between;
		padding: 0 15px 0 15px;
		width: 100%;
		background-color: rgb(232, 237, 243);
		font-size: 12px;

		.foot-left {
			margin: auto 0;
			color: #A655EF;
			overflow: hidden;
		}

		.foot-right {
			display: flex;
			justify-content: flex-end;

			.actions {
				padding: 10px 18px;
				cursor: pointer;
			}

			.actions:hover {
				background-color: #BFD1E2;
			}

		}
	}

	.body-left {
		background-color: rgb(232, 237, 243);
		height: 35vh;

		.a {
			overflow: hidden;
			background-color: rgb(191, 209, 226);
			display: flex;
			justify-content: left;

			p {
				line-height: 14px;
				font-size: 12px;
				padding: 0 8px 0 20px;
			}

		}

	}

	.body-right {
		background-color: rgb(191, 209, 226);
		height: 35vh
	}
</style>