<template>
	<div
		:style="`margin-left: ${itemWidth}px; margin-right: ${detailWidth}px; height: 90%;min-width: 800px`"
		@click="clickCanvas"
		@dragover.prevent
		@drop="handleDrop">
		<div
			:id="pageId"
			class="graph-container"
			style="position: relative; height: 100%;"
			@contextmenu.prevent="onContextmenu">

			<div :style="{display: this.$store.state.app.terminal_display}" ref="terminal">
				<Terminal/>
			</div>

		</div>

		<el-dialog
			v-if="params === 0"
			title="修改节点名"
			:visible.sync="dialogVisible"
			width="400px"
		>
			<!--	el-dialog处减少报错，暂时移除 :before-close="handleClose" -->

			<el-input v-model="input.name" placeholder="请输入内容"></el-input>
			<span slot="footer" class="dialog-footer">
   				<el-button @click="dialogVisible = false">取 消</el-button>
    			<el-button type="primary" @click="submitName">确 定</el-button>
  			</span>
		</el-dialog>

		<el-dialog
			v-else
			title="具体信息"
			:visible.sync="dialogVisible"
			width="700px"
		>
			<!--	el-dialog处减少报错，暂时移除 :before-close="handleClose" -->
			<div v-if="resStatus === 0">
				此节点内容不可查看！
			</div>
			<div class="matrix" v-if="resStatus === 1">
				矩阵信息
				<el-table
					:data="outputDetails"
					style="margin: 0 auto;"
				>
					<el-table-column
						v-for="(item, i) in matrixOutputTitle" :key="i"
						:prop="item"
						:label="item"
						width="200"
					>
					</el-table-column>

				</el-table>


			</div>
			<div v-if="resStatus === 2" style="display: flex;justify-content: space-between;overflow: auto;height: 300px;width: 140px;margin: 0 auto">
				<div style="width: 50px" >
					<p>键</p>
					<p v-for="(item, i) in listInfo[0]">{{item}}</p>
				</div>
				<div style="width: 50px" >
					<p>值</p>
					<p v-for="(item, i) in listInfo[1]">{{item}}</p>
				</div>
			</div>
			<div v-if="resStatus === 3">
				{{value}}
			</div>
			<span slot="footer" class="dialog-footer">
    			<el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  			</span>
		</el-dialog>
	</div>
</template>

<script>
    import G6 from '@antv/g6/build/g6'
    import { initBehavors } from '@/behavior'
    import { mapGetters } from 'vuex'
    import graphApi from '@/api/graph'
    import { Message } from 'element-ui'
    import Terminal from '../Terminal'
    import eventBus from '@/utils/eventBus'

    export default {
        components: {
            Terminal
        },
        data() {
            return {
                pageId: 'graph-container',
                dialogVisible: false,
                input: {},
                status: true,
                resStatus: 0, // 返回数据的类型 0为不可查看 1为矩阵 2为数列 3位数字
                interceptor: null, // 拦截器，防止用户的憨憨行为
                isRightClickNode: false, // 判断右击是否点了节点
                graph: null,
                data: null, // 图里元素信息
                outputDetails: [],  // 存放具体的输出信息
                matrixOutputTitle: [],
                value: 0,
				listInfo: [[], []],
                params: null,
                max_id: 0,
                isLockCanvas: false,
                supportBehavior: [
                    'drag-canvas',
                    'brush-select',
                    'drag-select',
                    'canvas-zoom',
                    'hover-node',
                    'drag-node',
                    'select-node',
                    'hover-edge',
                    'keyboard',
                    'add-menu',
                ],
            }
        },

        computed: {
            ...mapGetters(['canvasHeight', 'canvasWidth', 'itemWidth', 'detailWidth', 'terminalDisplay']),
            id: {
                get() {
                    const graphId = this.$route.params.id
                    this.$store.commit('app/SET_GRAPHID', graphId)
                    return graphId
                },
                set(val) {
                    this.$store.commit('app/SET_GRAPHID', val)
                }
            },
            isRunning: {
                get() {
                    return this.$store.state.app.is_running
                },
                set(val) {
                    this.$store.commit('app/SET_ISRUNNING', val)
                }
            },
        },

        watch: {
            canvasWidth: function (val) {
                val = val <= 800 ? 800 : val  // 防止出现画布在浏览器尺寸压缩时候的白带（草！）
                this.graph.changeSize(val, this.canvasHeight)
            },
            canvasHeight: function (val) {
                this.graph.changeSize(this.canvasWidth, val)
            },
            dialogVisible: function (val) {
                if (val === false) {
                    this.outputDetails = []
                    this.matrixOutputTitle = []
                    this.value = 0
					this.list = [[], []]
                }
            }

        },

        created() {
            initBehavors()
            this.getGraph()
            // this.$store.dispatch('app/getProjectFileList', this.id);
            document.body.style.overflow = 'hidden'
        },

        mounted() {
            this.$nextTick(() => {
                this.init()
            })
        },

        methods: {
            // 提交数据
            saveDetail() {
                let graph = this.graph.save()
                Object.assign(graph, { id: this.id })
                let data = {
                    graphid: this.id,
                    graph: JSON.stringify(graph),
                }
                graphApi.sendGraph(data).then(res => {
                    graphApi.getGraphById({ graphid: this.id }).then(res => {
                        this.data = res.data.data
                        this.isRunning = this.data.status === 'loading'
                        this.forEach(this.data)
                        this.$store.commit('app/SET_GRAPHDATA', res.data.data) // 全局保存一下图数据
                        this.$store.commit('app/SET_MAXID', this.max_id)
                        this.graph.read(this.data)
                        if (this.data.nodes.length) {
                            this.graph.fitView(100)
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                }).catch(err => {
                    console.error(err)
                })
            },

            isClickNode() {
                // 使用全局不使用$on触发，防止出现注册先后的问题，草
                if (this.$store.state.app.click_node) {
                    this.input = this.$store.state.app.click_node
                    this.isRightClickNode = true
                } else {
                    this.isRightClickNode = false
                }
            },

            onContextmenu(event) {
                let e = event || window.event
                if (this.$store.state.app.terminal_display === 'block') {
                    if (e.clientY >= 0 && e.clientY <= document.body.clientHeight - this.$store.state.app.terminal_height) {
                        this.getContextMenu(event)
                    }
                } else {
                    this.getContextMenu(event)
                }
                return false
            },

            getContextMenu(event) {
                this.isClickNode()
                this.$contextmenu({
                    items: [
                        {
                            label: '返回(B)',
                            onClick: () => {
                                // console.log("返回(B)");
                            },
                            disabled: false,
                            icon: 'el-icon-back',
                        },
                        {
                            label: this.isLockCanvas ? '解除锁定' : '锁定画布',
                            onClick: () => {
                                this.isLockCanvas = !this.isLockCanvas
                            },
                            disabled: false,
                            icon: this.isLockCanvas ? 'el-icon-unlock' : 'el-icon-lock',
                        },
                        {
                            label: '修改节点名',
                            onClick: () => {
                                this.params = 0
                                this.dialogVisible = true
                            },
                            disabled: !this.isRightClickNode,
                            icon: 'el-icon-edit',
                        },
                        {
                            // 还需解决问题，对于上面的circle进行拦截
                            label: '查看输出结果',
                            onClick: () => {
                                this.params = 1
                                setTimeout(() => {
                                    this.dialogVisible = true
                                }, 100)
                                let submitInfo = {
                                    graphid: parseInt(this.$route.params.id),
                                    circleid: this.$store.state.app.circle_info.id
                                }
                                graphApi.getOutputInfo(submitInfo).then(res => {
                                    let data = res.data
                                    console.log(data)
                                    if (data.status === '不支持该节点的查看') {
                                        this.resStatus = 0
                                    } else if (data.status === 'finished') {
                                        if (data.type === 'matrix') {
                                            let value = JSON.parse(data.value)
                                            let allInfo = []
                                            this.resStatus = 1
                                            let a = 0, b = 0 // a是宽 b/a是长
                                            for (let cont in value) {
                                                a++
                                                this.matrixOutputTitle.push(String(cont))
                                                for (let num in value[cont]) {
                                                    b++
                                                    allInfo.push(value[cont][num])
                                                }
                                            }
                                            for (let i = 0; i < b / a; i++) {
                                                this.outputDetails.push({})
                                                for (let j = 0; j < a; j++) {
                                                    Object.assign(this.outputDetails[i], JSON.parse(`{"${this.matrixOutputTitle[j]}": ${allInfo[b / a + j]}}`))
                                                }

                                            }
                                            console.log(this.outputDetails)
                                        } else if (data.type === 'list') {
                                            this.resStatus = 2
                                            let value = JSON.parse(data.value)
                                            console.log(value);
                                            for (let cont in value) {
												this.listInfo[0].push(cont)
												this.listInfo[1].push(value[cont])
											}
                                        } else if (data.type === 'num') {
                                            this.resStatus = 3
                                            this.value = data.value
                                        }

                                    }
                                }).catch(err => {
                                    console.log(err)
                                })
                            },
                            disabled: !(this.$store.state.app.running_complete && this.isRightClickNode && this.$store.state.app.is_on_circle),
                            icon: 'el-icon-edit',
                        },
                    ],
                    event,
                    customClass: 'class-a',
                    zIndex: 3,
                    minWidth: 230
                })
                this.isRightClickNode = false
                this.$store.commit('app/SET_CLICKNODE', null)
            },

            // 获取节点
            getGraph() {
                graphApi.getGraphById({ graphid: this.id }).then(res => {
                    this.data = res.data.data
                    this.isRunning = this.data.status === 'loading'
                    this.forEach(this.data)
                    this.$store.commit('app/SET_GRAPHDATA', res.data.data) // 全局保存一下图数据
                    this.$store.commit('app/SET_MAXID', this.max_id)
                    this.graph.read(this.data)
                    if (this.data.nodes.length) {
                        this.graph.fitView(100)
                    }
                }).catch(err => {
                    Message({
                        message: err.data,
                        type: 'error',
                        duration: 3000,
                    })
                })
            },

            // 递归读取元素信息
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

            init() {
                const height = this.canvasHeight
                const width = this.canvasWidth

                this.graph = new G6.Graph({
                    container: 'graph-container',
                    height: height,
                    width: width <= 800 ? 800 : width,
                    modes: {
                        default: this.supportBehavior,
                        moveCanvas: ['drag-canvas'],
                        multiSelect: [
                            {
                                type: 'drag-select',
                                trigger: 'drag',
                            }
                        ],
                        addEdge: ['add-edge'],
                    },
                    groupType: 'rect',		// 指定分组的类型
                    groupStyle: {
                        default: {
                            fill: '#ff0000',
                            radius: 10,
                            minDis: 10,
                        },
                    },
                    animate: true,			// 切换布局时是否使用动画过度，默认为 false
                })
                const { editor, command } = this.$parent
                editor.emit('afterAddPage', { graph: this.graph, command })
                this.readData()
                // 把图信息（整张图）存到全局
                this.$store.commit('app/SET_GRAPHINFO', this.graph)
            },

            readData() {
                let data = this.data
                if (data) {
                    this.graph.read(data)
                }
            },

            clickCanvas() {
                this.$store.dispatch('app/setIsFocusCanvas', true)
            },

            handleDrop(e) {
                this.$store.commit('app/SET_ALLOWDROP', true)
            },

            submitName() {
                if (!this.input.name) {
                    if (this.status) {
                        this.$message({
                            message: '请输入节点名',
                            type: 'error'
                        })
                        this.status = false
                        this.interceptor = setTimeout(() => {
                            this.status = true
                        }, 2500)
                    }
                } else {
                    for (let i = 0; i < this.data.nodes.length; i++) {
                        if (this.data.nodes[i].id === this.input.id) {
                            console.log(this.data.nodes[i])
                            this.data.nodes[i].label = this.input.name

                            // this.reDrewGraph(this.init)

                            // graphApi.
                            this.saveDetail()

                            setTimeout(() => {
                                this.dialogVisible = false
                            }, 500)
                        }
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
	.matrix {
		height: 450px;
		min-width: 500px;
		max-width: 700px;
		overflow: auto;
		position: relative;
	}

	.el-scrollbar__wrap {
		overflow-x: hidden;
	}

	.el-table {
		position: absolute;
		width: auto;
		max-width: none;
	}

</style>