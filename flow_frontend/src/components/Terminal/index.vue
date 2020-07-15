<template>
	<div class="main" ref="hei">
		<div class="terminal-top" @mousedown="doMove">
			<div class="a" v-if="terminalOpen === 0">
				<div class="top-left">
					<span>变量名</span>
					<span>变量类型</span>
					<span>变量值</span>
				</div>
			</div>
			<div class="b" v-if="terminalOpen === 1">
				<!--				<span>ln</span>-->
				<span>代码</span>
			</div>

			<div class="c" v-if="terminalOpen === 2"><span>实时数据(每分钟采样一次) 硬盘 0GB/100GB</span></div>
			<div class="top-right" @click="offTerminal">×</div>
		</div>
		<div class="terminal-body" ref="terminal_body">
			<div v-if="terminalOpen === 0" class="a"></div>
			<div v-if="terminalOpen === 1" class="b" v-html="terminalContent"></div>
			<div v-if="terminalOpen === 2" class="c">
				<el-row>
					<el-col :span="4">
						<div class="body-left">
							<div class="a">
								<p>CPU</p>
								<p>5%</p>
							</div>
							<div class="a">
								<p>内存</p>
								<p>0.16GB/8GB</p>
							</div>
						</div>
					</el-col>
					<el-col :span="20">
						<div class="body-right">ddd</div>
					</el-col>
				</el-row>
			</div>
		</div>
		<div class="terminal-foot">
<!--			<div class="foot-left">命令模式</div>-->
			<div class="foot-right">
<!--				<div class="actions" :style="{ backgroundColor: terminalOpen === 0 ? `#BFD1E2` : `` }"-->
<!--					 @click="terminalTrans(0)">变量监控-->
<!--				</div>-->
				<div class="actions" :style="{ backgroundColor: terminalOpen === 1 ? `#BFD1E2` : `` }"
					 @click="terminalTrans(1)">运行历史
				</div>
<!--				<div class="actions" :style="{ backgroundColor: terminalOpen === 2 ? `#BFD1E2` : `` }"-->
<!--					 @click="terminalTrans(2)">性能监控-->
<!--				</div>-->
			</div>
		</div>
	</div>
</template>

<script>
    import { mapState } from 'vuex'
    import { mapGetters } from 'vuex'

    export default {
        data() {
            return {
                terminalOpen: 1,
                isOpen: false,
                cont: ''
            }
        },
        mounted() {
            this.$refs.hei.style.height = `${this.$store.state.app.terminal_height}px`
        },

        methods: {
            terminalTrans(i) {
                this.terminalOpen = i
            },

            doMove(e) {
                e = window.event || e

                // 实现拖拽
                document.onmousemove = (e) => {
                    if (document.body.clientHeight - e.clientY < 100) {
                        this.$refs.hei.style.height = 100
                    } else if (document.body.clientHeight - e.clientY > document.body.clientHeight * 0.6) {
                        this.$refs.hei.style.height = document.body.clientHeight * 0.6
                    } else {
                        this.$refs.hei.style.height = `${document.body.clientHeight - e.clientY}px`
                        this.$refs.terminal_body.style.height = `${document.body.clientHeight - e.clientY - 70}px`
                    }
                }

                // 取消鼠标移动的全局监听
                document.onmouseup = () => {
                    document.onmousemove = null
                    this.$store.commit('app/SET_TERMINALHEIGHT', parseInt(this.$refs.hei.style.height.substring(0, this.$refs.hei.style.height.length - 2)))
                    // 把最后的单位px去除并强转数字类型，然后传给全局，以便在画布右键的时候检测它的高度，并在点击控制台的时候禁止弹出菜单
                }
            },

            offTerminal() {
                this.$store.commit('app/SET_TERMINALDISPLAY', 'none')
            },
        },
        computed: {
            ...mapGetters(['terminalDisplay', 'terminalContent'])
        },
        watch: {
            terminalContent(val) {
                // 最后一下也可以顺利到底部
                setTimeout(() => {
                    this.$refs.terminal_body.scrollTop = this.$refs.terminal_body.scrollHeight
                }, 20)
            }
        }
    }
</script>

<style lang="scss" scoped>
	$hei: 270px;

	.main {
		z-index: 1;
		width: 100%;
		height: $hei;
		position: absolute;
		bottom: 8px;
		max-height: 70%;
	}

	.terminal-top {
		position: relative;
		top: 0;
		padding: 5px 8px 7px 8px;
		width: 100%;
		background-color: rgb(246, 249, 252);
		font-size: 12px;
		display: flex;
		justify-content: space-between;
		cursor: n-resize;

		.top-right {
			margin-right: 20px;
			cursor: pointer;
		}

		.a {
			display: flex;
			justify-content: space-between;
			width: inherit;

			.top-left {
				width: 41%;
				display: flex;
				justify-content: space-between;
			}
		}

		.b {
			width: 20%;
			display: flex;
			justify-content: space-between;
		}
	}

	.terminal-body {
		height: $hei - 70px;
		max-height: 50vh;
		position: relative;
		bottom: 0;
		background-color: #fafafa;
		padding: 5px 8px;
		overflow-y: scroll;

		.a {
			/*overflow-y: scroll;*/
		}

		.b {
			/*overflow-y: scroll;*/
		}

		.c {
			/*overflow: hidden;*/
		}
	}

	.terminal-foot {
		box-sizing: border-box;
		position: relative;
		bottom: 0;
		display: flex;
		justify-content: space-between;
		padding: 0 0 0 15px;
		width: 100%;
		background-color: rgb(232, 237, 243);
		font-size: 12px;

		.foot-left {
			margin: auto 0;
			color: #a655ef;
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
				background-color: #bfd1e2;
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
		height: 35vh;
	}


	// 隐藏滚动条
	::-webkit-scrollbar {
		display: none
	}
</style>