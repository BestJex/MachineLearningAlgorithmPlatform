<template>
	<div>
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
			v-if="params === 1"
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
			<div v-if="resStatus === 2" class="list">
				<div style="display: flex;justify-content: space-between;" :key="i">
					<p>键</p>
					<p>值</p>
				</div>
				<div style="display: flex;justify-content: space-between;border-bottom: 1px solid #eeeeee"
					 v-for="(item, i) in listInfo_key" :key="i">
					<p style="border-right: 1px solid #eeeeee; padding-right: 5px">
						{{item}}</p>
					<p style="padding-left: 5px">{{listInfo_value[i]}}</p>
				</div>
			</div>
			<div v-if="resStatus === 3">
				{{value}}
			</div>
			<div v-if="resStatus === 4">
				此节点内容不可查看！
			</div>
			<span slot="footer" class="dialog-footer">
    			<el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  			</span>
		</el-dialog>
		<el-dialog
			v-if="params === 2"
			title="提示"
			:visible.sync="dialogVisible"
			width="400px">
			<p>确认删除此节点？</p>
			<span slot="footer" class="dialog-footer">
   				<el-button @click="dialogVisible = false">取 消</el-button>
    			<el-button type="primary" @click="doDelete">确 定</el-button>
  			</span>
		</el-dialog>
	</div>
</template>

<script>
    /*
	*
	* 触发的菜单方法
	*
	* */
    import graphApi from '@/api/graph'
    import graph from '../../../api/graph'

    export default {
        name: 'Menu',
        props: {
            datas: {
                type: Object,
                default: {}
            },
            graph: {
                type: Object,
                default: {}
            }
        },
        data() {
            return {
                input: {},
                resStatus: 4, // 返回数据的类型 0为不可查看 1为矩阵 2为数列 3位数字 4没有
                dialogVisible: false,
                params: 0,
                listInfo_value: [],
                listInfo_key: [],
                outputDetails: [],  // 存放具体的输出信息
                matrixOutputTitle: [],
                value: 0,
                isRightClickNode: false, // 判断右击是否点了节点
                interceptor: null, // 拦截器，防止用户的憨憨行为
                _graph: {},
                _data: {},
                command: null
            }
        },
        mounted() {
            // this.$nextTick(() => {
            // this._graph = Object.assign(this.graph, {})
            // this._data = Object.assign(this.data, {})
            // 	console.log(this._graph);
            // })
        },
        created() {
            this.init()
        },
        watch: {
            dialogVisible: function (val) {
                if (val === false) {
                    this.outputDetails = []
                    this.matrixOutputTitle = []
                    this.value = 0
                    this.listInfo_value = []
                    this.listInfo_key = []
                    this.resStatus = 0
                }
            },
			datas: function (val) {
				this.data = val
				// console.log(this.data);
				////////////////////////////////////////解决方法
            }
        },
        methods: {
            init() {
                let { editor, command } = this.$parent
                this.command = command
            },
            getContextMenu() {
                this.isClickNode()
                this.$contextmenu({
                    items: [
                        // {
                        //     label: '返回(B)',
                        //     onClick: () => {
                        //         // console.log("返回(B)");
                        //     },
                        //     disabled: false,
                        //     icon: 'el-icon-back',
                        // },
                        // {
                        //     label: this.isLockCanvas ? '解除锁定' : '锁定画布',
                        //     onClick: () => {
                        //         this.isLockCanvas = !this.isLockCanvas
                        //     },
                        //     disabled: false,
                        //     icon: this.isLockCanvas ? 'el-icon-unlock' : 'el-icon-lock',
                        // },
                        {
                            label: '修改节点名',
                            onClick: () => {
                                this.params = 0
                                // 触发
                                this.dialogVisible = true
                            },
                            disabled: !this.isRightClickNode,
                            icon: 'el-icon-edit',
                        },
                        {
                            label: '删除节点',
                            onClick: () => {
                                this.params = 2
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
                                    if (data.status === '不支持该节点的查看') {
                                        this.resStatus = 0
                                    } else if (data.status === 'finished') {
                                        if (data.type === 'matrix') {
                                            let value = JSON.parse(data.value)
                                            // console.log(value)
                                            let allInfo = []
                                            this.resStatus = 1
                                            let a = 0, b = 0 // a是宽 b/a是长
                                            for (let cont in value) {
                                                a++

                                                let regPos = /^\d+(\.\d+)?$/ //非负浮点数
                                                let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/ //负浮点数
                                                if (regNeg.test(cont) || regPos.test(cont)) {
                                                    this.matrixOutputTitle.push(`列${a}`)
                                                    allInfo.push(cont)
                                                } else {
                                                    this.matrixOutputTitle.push(cont)
                                                }

                                                for (let num in value[cont]) {
                                                    b++
                                                    allInfo.push(value[cont][num])
                                                }
                                            }
                                            for (let i = 0; i < b / a; i++) {
                                                this.outputDetails.push({})
                                                for (let j = 0; j < a; j++) {
                                                    Object.assign(this.outputDetails[i], JSON.parse(`{"${this.matrixOutputTitle[j]}": "${String(allInfo[a * i + j])}"}`))
                                                }
                                            }
                                            // console.log(this.outputDetails)
                                        } else if (data.type === 'list') {
                                            this.resStatus = 2
                                            let value = JSON.parse(data.value)
                                            // console.log(value)
                                            for (let cont in value) {
                                                this.listInfo_key.push(cont)
                                                this.listInfo_value.push(value[cont])
                                            }
                                        } else if (data.type === 'num') {
                                            this.resStatus = 3
                                            this.value = data.value
                                        }
                                    }
                                }).catch(err => {
                                    // console.log(err)
                                })
                            },
                            disabled: !(this.$store.state.app.running_complete && this.isRightClickNode && this.$store.state.app.is_on_circle),
                            icon: 'el-icon-tickets',
                        },

                    ],
                    event,
                    customClass:
                        'class-a',
                    zIndex:
                        3,
                    minWidth:
                        230
                })
                this.isRightClickNode = false
                // this.$store.commit('app/SET_CLICKNODE', null)
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
                            // console.log(this.data.nodes[i])
                            this.data.nodes[i].label = this.input.name

                            this.saveDetail()

                            setTimeout(() => {
                                this.dialogVisible = false
                            }, 500)
                        }
                    }
                }
            },
            isClickNode() {
                // 使用全局不使用$on触发，防止出现注册先后的问题，草
                if (this.$store.state.app.click_node) {
                    // console.log(this.$store.state.app.click_node);
                    this.input = this.$store.state.app.click_node.node._cfg.model
                    this.isRightClickNode = true
                } else {
                    this.isRightClickNode = false
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
                        // 为了实现功能，暂时关闭不是很重要的副功能，如果有需要的话，就解除注释
                        // this.data = res.data.data

                        // this.isRunning = this.data.status === 'loading'
                        // this.forEach(this.data)
                        this.$store.commit('app/SET_GRAPHDATA', res.data.data) // 全局保存一下图数据
                        // this.$store.commit('app/SET_MAXID', this.max_id)
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
            },

            doDelete() {
                for (let i = 0; i < this.graph._cfg.data.nodes.length; i++) {
                    // 遍历，寻找id符合的节点
                    if (this.graph._cfg.data.nodes[i].id === this.$store.state.app.click_node.node._cfg.id) {
						let graphData = Object.assign({}, this.$store.state.app.graph_info)
						graphData._cfg.data.nodes.splice(i, 1)
						// console.log(graphData);
						this.$store.commit('app/SET_GRAPHINFO', graphData)
                        this.saveDetail()
                        setTimeout(() => {
                            this.dialogVisible = false
                        }, 500)
                    }
                }
                // let deleteObj = [].push(this.$store.state.app.click_node.node)
                // this.command.executeCommand('delete', deleteObj)
                // this.saveDetail()
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

	.list {
		overflow: auto;
		height: 350px;
		margin: 0 auto;
		padding: 0 15px;
	}
</style>