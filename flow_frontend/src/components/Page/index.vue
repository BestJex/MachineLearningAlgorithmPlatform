<template>
	<div
		:style="`margin-left: ${itemWidth}px; margin-right: ${detailWidth}px; height: 90%;`"
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
                interceptor: null, // 拦截器，防止用户的憨憨行为
                terminalHei: 270, // 获取控制台高度,以后有需求就改成动态的
                isRightClickNode: false, // 判断右击是否点了节点
                graph: null,
                data: null, // 图里元素信息
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
                this.graph.changeSize(val, this.canvasHeight)
            },
            canvasHeight: function (val) {
                this.graph.changeSize(this.canvasWidth, val)
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
            saveDetail() {
                const loading = this.$loading({
                    lock: true,
                    text: '保存中',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.8)'
                })
                let graph = this.graph.save()
                Object.assign(graph, { id: this.id })
                let data = {
                    graphid: this.id,
                    graph: JSON.stringify(graph),
                }

                graphApi.sendGraph(data).then(res => {
                    loading.close()
                    graphApi.getGraphById({ graphid: this.id }).then(res => {
                        this.data = res.data.data
                        this.isRunning = this.data.status === 'loading'
                        this.forEach(this.data)
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
                    loading.close()
                })
            },

            isClickNode() {
                // 使用全局不使用$on触发，防止出现注册先后的问题，草
                if (this.$store.state.app.click_node !== null) {
                    this.input = this.$store.state.app.click_node
                    this.isRightClickNode = true
                } else {
                    this.isRightClickNode = false
                }
            },

            onContextmenu(event) {
                let e = event || window.event
                if (this.$store.state.app.terminal_display === 'block') {
                    if (e.clientY >= 0 && e.clientY <= document.body.clientHeight - this.terminalHei) {
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
                                this.dialogVisible = true
                            },
                            disabled: !this.isRightClickNode,
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
                    width: width,
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


</style>