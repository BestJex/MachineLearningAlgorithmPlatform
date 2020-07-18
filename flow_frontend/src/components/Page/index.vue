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
		<Menu ref="menu" :graphs="graph" :datas="data" v-on:changeGraph="changeGraph"/>
	</div>
</template>

<script>
    import G6 from '@antv/g6/build/g6'
    import { initBehavors } from '@/behavior'
    import { mapGetters } from 'vuex'
    import graphApi from '@/api/graph'
    import { Message } from 'element-ui'
    import Terminal from '../Terminal'
    import Menu from './Menu/index.vue'
    import { Notification } from 'element-ui'

    export default {
        components: {
            Terminal, Menu
        },

        data() {
            return {
                pageId: 'graph-container',
                status: true,
                graph: null,
                data: null, // 图里元素信息
                max_id: 0,
                isLockCanvas: false,
                editor: null,
                command: null,
                // isRunning: '',
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
        },

        created() {
            this.initEvent()
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
            initEvent() {
                const { editor, command } = this.$parent
                this.editor = editor
                this.command = command
            },
            changeGraph(event) {
                console.log(event)
                this.command.executeCommand('delete', event)
                let graph = this.graph.save()
                Object.assign(graph, { id: this.$route.params.id })
                let data = {
                    graphid: this.$route.params.id,
                    graph: JSON.stringify(graph),
                }
                graphApi.sendGraph(data).then(res => {

                }).then(() => {
                    // 注释是为了提高用户体验
                    // return graphApi.getGraphById({ graphid: this.graphId })
                }).catch(err => {
                    Notification({
                        title: '错误',
                        message: err,
                        type: 'error',
                        duration: 3000
                    })
                })
            },
            // 检验点击区域
            onContextmenu(event) {
                let e = event || window.event
                if (this.$store.state.app.terminal_display === 'block') {
                    if (e.clientY >= 0 && e.clientY <= document.body.clientHeight - this.$store.state.app.terminal_height) {
                        this.$refs.menu.getContextMenu()
                    }
                } else {
                    this.$refs.menu.getContextMenu()
                }
                return false
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
                console.log(this.graph)
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

	.list {
		overflow: auto;
		height: 350px;
		margin: 0 auto;
		padding: 0 15px;
	}

</style>