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
							<el-tooltip class="item" effect="dark" content="str类型" placement="left">
								<el-input
									type="text"
									@change="changeValue(node)"
									v-if="node.type==='object' || node.type==='str' || node.type==='model'"
									v-model="node.value"></el-input>
							</el-tooltip>
							<!-- int/随机数类型输入框 -->
							<el-tooltip class="item" effect="dark" content="int类型" placement="left">
								<el-input
									@change="changeValue(node)"
									v-if="(node.type === 'int' || node.type === 'RandomState') && node.value !== 'None'"
									type="number"
									:DangerColor="node.value.toString().indexOf('.') !== -1 ? 'danger' : ''"
									v-model="node.value"></el-input>
							</el-tooltip>
							<!-- int && value 可以为None或数字类型输入框 -->
							<el-tooltip class="item" effect="dark" content="None或int类型" placement="left">
								<el-input
									@change="changeValue(node)"
									v-if="(node.type === 'int' || node.type === 'RandomState') && node.value === 'None'"
									type="text" :DangerColor="node.value.indexOf('.') !== -1 ? 'danger' : ''"
									v-model="node.value"></el-input>
							</el-tooltip>
							<!-- float类型输入框 -->
							<el-tooltip class="item" effect="dark" content="float类型" placement="left">
								<el-input-number
									@change="changeValue"
									v-if="node.type==='float'"
									type="number"
									v-model="node.value"></el-input-number>
							</el-tooltip>
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
							<el-tooltip class="item" effect="dark" content="选择CSV文件" placement="left">
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
							</el-tooltip>
							<!-- 选择Model文件 -->
							<el-tooltip class="item" effect="dark" content="选择Model文件" placement="left">
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
							</el-tooltip>
							<!-- 选择算法 -->
							<el-tooltip class="item" effect="dark" content="选择" placement="left">
								<el-select
									@change="changeValue"
									v-if="node.type==='selection'"
									v-model="node.value">
									<el-option
										:label="item"
										:value="item"
										v-for="item in node.selection"></el-option>
								</el-select>
							</el-tooltip>
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
    import graphApi from '@/api/graph'
    import { mapGetters } from 'vuex'
    import { Notification } from 'element-ui'

    export default {
        data() {
            return {
                status: 'canvas-selected',	// 页面状态（选中画布/选中节点）
                showGrid: false,
                page: {},
                graph: {},
                item: {},
                visible: false,
                node_detail: {},
                point_detail: {},
                grid: null,
            }
        },
        computed: {
            ...mapGetters(['docHeight', 'fileList']),
            graphId: {
                get() {
                    return this.$route.params.id || this.$store.getters.graphId
                }
            },

            // 获取文件列表中的CSV文件
            csvFileList() {
                let ans = []
                for (let i = 0; i < this.fileList.length; i++) {
                    if (this.fileList[i].filename.endsWith('csv')) {
                        ans.push(this.fileList[i])
                    }
                }
                return ans
            },

            // 获取文件列表中的model文件
            modelFileList() {
                let ans = []
                for (let i = 0; i < this.fileList.length; i++) {
                    if (this.fileList[i].filename.endsWith('m')) {
                        ans.push(this.fileList[i])
                    }
                }
                return ans
            },
        },
        created() {
            this.bindEvent()
        },
        methods: {
            bindEvent() {
                let self = this
                eventBus.$on('afterAddPage', page => {
                    self.page = page
                    self.graph = self.page.graph
                    eventBus.$on('nodeselectchange', item => {
                        if (item.select === true && item.target.getType() === 'node') {
                            self.status = 'node-selected'
                            self.item = item.target
                            this.$store.commit(
                                'app/SET_SETSELECTEDNODEID',
                                item.target.getModel().id,
                            )
                            self.node_detail = item.target.getModel().node_detail
                            self.point_detail = item.target.getModel().point_detail
                            this.$store.dispatch('app/getFileList')
                        } else {
                            self.status = 'canvas-selected'
                            this.$store.commit('app/SET_SETSELECTEDNODEID', null)
                            self.item = null
                            self.node = null
                            self.node_detail = null
                            self.point_detail = null
                        }
                    })
                })
            },

            changeValue(node) {
                if (node.type === 'int' || node.type === 'RandomState') {
                    this.checkIntInput(node)
                }
                if (node.type === 'object' || node.type === 'str') {
                    if (!this.checkBraces(node.value)) {
                        node.value = ''
                        Notification({
                            title: '错误',
                            message: `${node.label}括号必须匹配！`,
                            type: 'error',
                            duration: 3000,
                        })
                    }
                }
                const model = {
                    node_detail: this.node_detail
                }
                this.graph.update(this.item, model)
				this.saveDetail()
            },

            // 检查输入内容中括号是否匹配
            checkBraces(braces) {
                let leftBraReg = /[\(\{\[]/, stack = [], bracket, rightBracket
                braces = braces.split('')
                for (bracket of braces) {
                    if (leftBraReg.test(bracket)) {
                        stack.push(bracket)
                    } else {
                        switch (bracket) {
                            case ')':
                                rightBracket = stack.pop()
                                if (rightBracket !== '(') {
                                    return false
                                }
                                break
                            case ']':
                                rightBracket = stack.pop()
                                if (rightBracket !== '[') {
                                    return false
                                }
                                break
                            case '}':
                                rightBracket = stack.pop()
                                if (rightBracket !== '{') {
                                    return false
                                }
                                break
                        }
                    }
                }
                return stack.length === 0
            },

            checkIntInput(node) {
                if (node.value.indexOf('.') !== -1) {
                    Notification({
                        title: '错误',
                        message: `${node.label}必须为整数！`,
                        type: 'error',
                        duration: 3000,
                    })
                }
            },

            /**
             * 画布添加网格
             * @param value
             */
            changeGridState(value) {
                if (value) {
                    this.grid = new Grid()
                    this.graph.addPlugin(this.grid)
                } else {
                    this.graph.removePlugin(this.grid)
                }
            },

            saveDetail() {
                let graph = this.$store.state.app.graph_info.save()

                Object.assign(graph, { id: this.$route.params.id })
                let data = {
                    graphid: this.$route.params.id,
                    graph: JSON.stringify(graph),
                }
                graphApi.sendGraph(data).then(res => {
                    graphApi.getGraphById({ graphid: this.$route.params.id }).then(res => {
                        this.$store.commit('app/SET_GRAPHDATA', res.data.data) // 全局保存一下图数据
                        this.graph.read(this.data)
                        if (this.data.nodes.length) {
                            this.graph.fitView(100)
                        }
                    }).catch(err => {
                        // console.log(err)
                    })
                }).catch(err => {
                    // console.error(err)
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

<style>
	.el-input__inner[DangerColor="danger"] {
		background-color: #F56C6C;
	}

	.el-input__inner[WarningColor="warning"] {
		background-color: #E6A23C;
	}

	.el-input__inner[SuccessColor="success"] {
		background-color: #67C23A;
	}
</style>