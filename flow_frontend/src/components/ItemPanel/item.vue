<template>
	<div>
		<hr>
		<el-tooltip placement="top">
			<div slot="content">{{ $store.state.app.operation ? '结束编辑' : '编辑' }}</div>
			<el-button
				:type="$store.state.app.operation ? 'primary' : ''"
				icon="el-icon-edit"
				circle
				style="margin-left: 5px;"
				@click="handleOperation()"
				:title="$store.state.app.operation ? '结束编辑' : '编辑'"></el-button>
		</el-tooltip>
		<el-tooltip placement="top">
			<div slot="content">恢复节点</div>
			<el-button
				v-show="$store.state.app.operation"
				type="warning"
				icon="el-icon-refresh-left"
				circle
				@click="recoveryNode()"
				title="恢复节点"></el-button>
		</el-tooltip>
		<el-tooltip placement="top">
			<div slot="content">删除节点</div>
			<el-button
				v-show="this.$store.state.app.operation"
				type="danger"
				icon="el-icon-delete"
				circle
				@click="deleteNodes()"
				title="删除"></el-button>
		</el-tooltip>
		<el-input
			v-show="!$store.state.app.operation"
			placeholder="输入关键字进行过滤"
			v-model="filterText"
			style="display: inline-block; width: 80%"></el-input>
		<hr>
		<el-tree
			ref="tree"
			class="filter-tree"
			default-expand-all
			:data="treeNodeList"
			:draggable="true"
			:props="defaultProps"
			:allow-drop="allowDrop"
			:allow-drag="allowDrag"
			:highlight-current="true"
			:show-checkbox="$store.state.app.operation"
			:filter-node-method="filterNode"
			:expand-on-click-node="!$store.state.app.operation"
			@node-drop="handleDrop"
			@node-drag-over="handleDragOver"
			@node-drag-end="handleElDragEnd"
			@check-change="handleCheckChange"
			@node-drag-enter="handleDragEnter"
			@node-drag-leave="handleDragLeave"
			@node-drag-start="handleElDragStart"
			style="margin-bottom: 70px">
                  <span
					  class="custom-tree-node"
					  slot-scope="{ node, data }"
					  :id="node.label">
                        <span v-show="!$store.state.app.operation">{{ node.label }}</span>
                        <label>
                            <input
								type="text" 
								v-model="data.name" 
								v-show="$store.state.app.operation">
                        </label>
                  </span>
		</el-tree>
		<el-dialog
			:append-to-body="true"
			:visible.sync="isShowRecoveryTreeNode"
			custom-class="preview-dialog"
			title="恢复结点"
			style="min-width: 700px">
			<!--            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>-->
			<el-checkbox-group
				v-model="checkedNodes" 
				@change="handleCheckedNodesChange">
				<el-checkbox
					v-for="node in recoveryNodes" 
					:label="node.name" 
					:key="node.id">
					{{node.name}}
				</el-checkbox>
			</el-checkbox-group>
			<div slot="footer" class="dialog-footer">
				<el-button @click="this.isShowRecoveryTreeNode = false">取 消</el-button>
				<el-button type="primary" @click="recoveryTreeNode()">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>


<script>
    import { mapGetters } from 'vuex'
    import eventBus from '@/utils/eventBus'
    import graphApi from '@/api/graph'

    export default {
        data() {
            return {
                checkAll: false,
                checkedNodes: [],
                recoveryNodes: [],
                isIndeterminate: true,
                isShowRecoveryTreeNode: false,		// 是否显示恢复节点对话框
                defaultProps: {
                    children: 'children',
                    label: 'name',
                },
                filterText: '',
                page: null,
                command: null,
                treeNodeList: null,
                offsetX: 0,
                clientX: 0,
                offsetY: 0,
                clientY: 0,
            }
        },
        computed: {
            ...mapGetters(['isAllowDrop']),
        },
        created() {
            this.bindEvent()
            this.getTree()
            this.id = this.$store.state.app.graph_id
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val)
            },
        },
        methods: {
            /**
             * 获取左侧树形图
             */
            getTree() {
                graphApi.getGraphTree({ graph_id: this.$route.params.id }).then(res => {
                    this.treeNodeList = res.data.path.data
                }).catch(error => {
                    this.$message({
                        message: error,
                        type: 'error'
                    })
                })
            },

            /**
             * 树形控件节点过滤
             */
            filterNode(value, data) {
                if (!value) return true
                return data.name.indexOf(value) !== -1
            },

            /**
             * 操作节点
             */
            handleOperation() {
                this.$store.commit('app/SET_OPERATION', !this.$store.state.app.operation)
                this.operation = !this.operation
                if (!this.$store.state.app.operation) {
                    this.saveTree()
                }
            },

			/**
			 * 保存树形图
			 */
			saveTree() {
                let data = {
                    graph_id: this.$route.params.id,
                    nodeList: JSON.stringify(this.treeNodeList),
                }
                this.axios({
                    method: 'post',
                    url: `http://39.105.21.62/flow/api/updatetree`,
                    data: data,
                }).then(() => {
                    this.getTree()
                }).catch(() => {
                    this.$message({
                        message: '树形图保存失败！',
                        type: 'error'
                    })
                })
			},

            /**
             * 显示恢复节点对话框并且获取可恢复的节点
             */
            recoveryNode() {
                this.isShowRecoveryTreeNode = true
                this.axios({
                    method: 'get',
                    url: `http://39.105.21.62/flow/api/searchdeletenode?graphid=${this.$route.params.id}&username=${localStorage.getItem('username')}`,
                }).then(res => {
                    this.recoveryNodes = res.data.data.list
                }).catch(err => {
                    this.$message({
                        message: err,
                        type: 'error'
                    })
                })
            },

            recoveryTreeNode() {
                console.log(this.checkedNodes)
                let data = {
                    graphid: this.$route.params.id,
                    checked: [],
                }
                for (let i = 0; i < this.recoveryNodes.length; i++) {
                    for (let j = 0; j < this.checkedNodes.length; j++) {
                        if (this.recoveryNodes[i].name === this.checkedNodes[j]) {
                            data.checked.push(this.recoveryNodes[i])
                        }
                    }
                }
                this.axios({
                    method: 'post',
                    url: `http://39.105.21.62/flow/api/recovernode`,
                    data: data,
                }).then(res => {
                    // console.log(res)
                    this.getTree()
                    this.isShowRecoveryTreeNode = false
                }).catch(err => {
                    this.$message({
                        message: err,
                        type: 'error'
                    })
                })
            },

            /**
             * 删除节点
             */
            deleteNodes() {
                let checkedNodes = this.$refs.tree.getCheckedNodes()
                for (let index = 0; index < checkedNodes.length; index++) {
                    let item = checkedNodes[index]
                    for (let i = 0; i < this.treeNodeList.length; i++) {
                        if (this.treeNodeList[i].children) {
                            for (let j = 0; j < this.treeNodeList[i].children.length; j++) {
                                if (this.treeNodeList[i].children[j].$treeNodeId === item.$treeNodeId) {
                                    this.treeNodeList[i].children.splice(j, 1)
                                }
                            }
                        }
                        if (this.treeNodeList[i].$treeNodeId === item.$treeNodeId) {
                            this.treeNodeList.splice(i, 1)
                        }
                    }
                }
                this.saveTree()
            },

            handleCheckAllChange(val) {
                this.checkedNodes = val ? this.recoveryNodes : []
                this.isIndeterminate = false
            },

            handleCheckedNodesChange(value) {
                let checkedCount = value.length
                this.checkAll = checkedCount === this.recoveryNodes.length
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.recoveryNodes.length
            },

            handleCheckChange(data, checked, indeterminate) {
                // console.log(data);
            },

            handleElDragStart(node, e) {
                this.offsetX = e.offsetX
                this.clientX = e.clientX
                this.offsetY = e.offsetY
                this.clientY = e.clientY
            },

            /**
             * 拖拽结束时（可能未成功）触发的事件
             * @param node：被拖拽节点对应的 Node
             * @param _node：结束拖拽时最后进入的节点（可能为空）
             * @param p：被拖拽节点的放置位置（before、after、inner）
             * @param e：event
             */
            handleElDragEnd(node, _node, p, e) {
                // console.log(node);
                let data = {}
                if (this.isAllowDrop) {
                    const item = JSON.parse(JSON.stringify(node.data))
                    item.template_id = item.id
                    Object.assign(data, item)
                    if (this.page) {
                        const graph = this.page.graph
                        const xy = graph.getPointByClient(e.x, e.y)
                        data.x = xy.x
                        data.y = xy.y
                        data.node_detail = []
                        data.point_detail = []
                        data.name = node.data.name
                        data.label = node.data.name
                        data.description = null
                        data.status = 'init'
                        // 加载输入节点
                        for (const [key, value] of Object.entries(node.data.information.inputattibute)) {
                            value.disable = 'Yes'
                            data.point_detail.push(value)
                        }
                        // 加载参数列表
                        for (const [key, value] of Object.entries(node.data.information.Parametersattibute)) {
                            data.node_detail.push(value)
                        }
                        // 加载输出节点
                        for (const [key, value] of Object.entries(node.data.information.outputattibute)) {
                            data.point_detail.push(value)
                        }
                        data.shape = 'customNode'
                        data.type = 'node'
                        this.command.executeCommand('add', [data])

                    }
                    this.$store.commit('app/SET_ALLOWDROP', false)
                }
                // 节点进入之后自动保存
                let graphData = this.$store.state.app.graph_data
                graphData.nodes.push(data)

                let subGraph = this.page.graph.save()
                subGraph.id = this.$route.params.id,
                    console.log(subGraph)
                let subData = {
                    graphid: this.$route.params.id,
                    graph: JSON.stringify(subGraph),
                }
                graphApi.sendGraph(subData).then(res => {
                    // 提交成功
                    console.log(res)
                }).catch(err => {
                    console.error(err)
                })

            },

            /**
             * 判断节点是否可拖拽，只有非菜单节点可以拖拽
             * @param node
             * @returns {boolean}
             */
            allowDrag(node) {
                return !node.data.is_menu
            },

            allowDrop(node, _node, type) {
                return this.$store.state.app.operation
            },

            handleDragStart(node, ev) {
                // console.log('drag start', node);
            },

            handleDragEnter(draggingNode, dropNode, ev) {
                // console.log('tree drag enter: ', dropNode.label);
            },

            handleDragLeave(draggingNode, dropNode, ev) {
                // console.log('tree drag leave: ', dropNode.label);
            },

            handleDragOver(draggingNode, dropNode, ev) {
                // console.log('tree drag over: ', dropNode.label);
            },

            handleDragEnd(draggingNode, dropNode, dropType, ev) {
                // console.log('tree drag end: ', dropNode && dropNode.label, dropType);
            },

            handleDrop(draggingNode, dropNode, dropType, ev) {
                // console.log('tree drop: ', dropNode.label, dropType);
            },

            bindEvent() {
                eventBus.$on('afterAddPage', page => {
                    this.page = page
                    this.command = page.command
                })
            },
        }
    }
</script>

<style lang="scss">
	.itempannel {
		.el-tree {
			background: #f6f9fc;

			.el-tree-node__content {
				background: #f6f9fc;

				&:hover {
					background: rgba(0, 0, 0, 0.05);
					color: rgb(51, 51, 51);
				}
			}

			.el-tree-node {
				&:focus {
					background: rgba(0, 0, 0, 0.05);
				}

				&:focus > .el-tree-node__content {
					background: rgba(0, 0, 0, 0.05);
				}
			}
		}
	}
</style>

<style scoped>
	.itempannel ul {
		padding: 0 0 0 16px;
	}

	.itempannel li {
		color: rgba(0, 0, 0, 0.65);
		border-radius: 4px;
		width: 160px;
		height: 28px;
		line-height: 26px;
		padding-left: 8px;
		border: 1px solid rgba(0, 0, 0, 0);
		list-style-type: none;
	}

	.itempannel li:hover {
		background: white;
		border: 1px solid #ced4d9;
		cursor: move;
	}

	.grabbable {
		cursor: move;
	}

	.grabbable:active {
		cursor: grabbing;
	}

	.itempannel .pannel-type-icon {
		width: 16px;
		height: 16px;
		display: inline-block;
		vertical-align: middle;
		margin-right: 8px;
	}

	.tree {
		position: relative;
		cursor: default;
		color: #606266;
	}

	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
	}
</style>