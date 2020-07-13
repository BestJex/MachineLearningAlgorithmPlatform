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
			width="30%">
			<el-input v-model="input" placeholder="请输入内容"></el-input>
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

    export default {
        components: {
            Terminal
        },
        data() {
            return {
                pageId: 'graph-container',
				dialogVisible: false,
				input: '',
                terminalHei: 270, // 获取控制台高度
                graph: null,
                data: null,
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
            onContextmenu(event) {
                let e = event || window.event
                console.log(this.terminalHei)
                if (this.$store.state.app.terminal_display === 'block') {
                    if (e.clientY >= 0 && e.clientY <= document.body.clientHeight - this.terminalHei) {
                        this.getContextMenu()
                    }
                } else {
                    this.getContextMenu()
                }
                return false
            },

            getContextMenu() {
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
                            disabled: false,
                            icon: this.isLockCanvas ? 'el-icon-unlock' : 'el-icon-lock',
                        },
                    ],
                    customClass: 'class-a',
                    zIndex: 3,
                    minWidth: 230
                })
            },

            getGraph() {
                graphApi.getGraphById({ graphid: this.id }).then(res => {
                    this.data = res.data.data;
                    this.isRunning = this.data.status === 'loading';
                    this.forEach(this.data);
                    this.$store.commit('app/SET_MAXID', this.max_id);
                    this.graph.read(this.data);
                    if (this.data.nodes.length) {
                        this.graph.fitView(100);
                    }
                }).catch(err => {
                    Message({
                        message: err.data,
                        type: 'error',
                        duration: 3000,
                    });
                    this.$router.push('/');
                });
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
                const height = this.canvasHeight;
                const width = this.canvasWidth;

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
					animate: true,			// 切换布局时是否使用动画过度，默认为 false
                });
                const { editor, command } = this.$parent;
                editor.emit('afterAddPage', { graph: this.graph, command });
                this.readData();
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

			}
        }
    }
</script>

<style lang="scss" scoped>


</style>