<template>
	<div id="mountNode">
		<div class="editor">
			<context-menu/>
			<!-- 上面的菜单栏 -->
			<toolbar/>
			<div class="bottom-container">
				<!-- 左侧工具栏 -->
				<item-panel/>
				<!-- 右侧参数栏 -->
				<detail-panel/>
				<!--缩略图-->
				<MiniMap/>
				<!-- G6图 -->
				<page/>
			</div>
		</div>
		<Flow/>
	</div>
</template>

<script>
    import Toolbar from '../Toolbar'
    import ItemPanel from '../ItemPanel'
    import DetailPanel from '../DetailPanel'
    import MiniMap from '../Minimap'
    import Page from '../Page'
    import Flow from '../Flow'
    import ContextMenu from '../ContextMenu'
    import Editor from '@/components/Base/Editor'
    import command from '@/command'
    import { mapGetters } from 'vuex'
    import graphApi from '@/api/graph'
    import { Notification } from 'element-ui'

    export default {
        name: 'G6Editor',
        components: {
            Toolbar,
            ItemPanel,
            DetailPanel,
            MiniMap,
            Page,
            ContextMenu,
            Flow,
        },
        computed: {
            ...mapGetters(['docHeight', 'tbHeight']),
            container_height() {
                return this.docHeight - this.tbHeight
            },
            id: {
                get() {
                    const graphId = this.$router.params.id
                    this.$store.commit('app/SET_GRAPHID', graphId)
                    return graphId
                },
                set(val) {
                    this.$store.commit('app/SET_GRAPHID', val)
                }
            }
        },
        data() {
            return {
                editor: {},
                command: null,
            }
        },
        created() {
            this.init()
        },
        methods: {
            init() {
                this.editor = new Editor()
                this.command = new command(this.editor)
                this.$store.dispatch('app/getFileList')

                graphApi.getGraphs(this.listQuery).then(res => {
                    let projects = res.res
					let param = location.href.split('/')
					projects.forEach(item => {
						if (item.id === parseInt(param[param.length - 1])) {
                            this.$store.commit('app/SetGraphName', item.project_name)
						}
					})
                }).catch(error => {
                    Notification({
                        title: '错误',
                        message: error,
                        type: 'error',
                        duration: 10000
                    })
                    this.loading = false
                })
            }
        },
		destroyed() {
            this.$store.commit('app/SetGraphName', null)
        }
    }
</script>

<style lang="scss" scoped>
	.editor {
		position: relative;
		width: 100%;
		user-select: none;
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		min-width: 1165px;
		height: calc(100vh - 60px);
	}

	.bottom-container {
		position: relative;
	}
</style>