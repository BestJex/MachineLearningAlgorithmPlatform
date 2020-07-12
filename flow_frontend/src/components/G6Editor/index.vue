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
                <minimap/>
                <!-- G6图 -->
                <page/>
            </div>
        </div>
        <Flow/>
    </div>
</template>

<script>
    import Toolbar from "../Toolbar";
    import ItemPanel from "../ItemPanel";
    import DetailPanel from "../DetailPanel";
    import Minimap from "../Minimap";
    import Page from "../Page";
    import Flow from "../Flow"
    import ContextMenu from "../ContextMenu";
    import Editor from "@/components/Base/Editor";
    import command from "@/command";
    import {mapGetters} from 'vuex';

    export default {
        name: "G6Editor",
        components: {
            Toolbar,
            ItemPanel,
            DetailPanel,
            Minimap,
            Page,
            ContextMenu,
            Flow
        },
        computed: {
            ...mapGetters(['docHeight', 'tbHeight']),
            container_height() {
                return this.docHeight - this.tbHeight
            },
            id: {
                get() {
                    const graphId = this.$router.params.id;
                    this.$store.commit('app/SET_GRAPHID', graphId)
                    return graphId
                },
                set(val) {
                    this.$store.commit('app/SET_GRAPHID', val)
                }
            }
        },
        created() {
            this.init();
        },
        data() {
            return {
                editor: {},
                command: null,
            };
        },
        methods: {
            init() {
                this.editor = new Editor();
                this.command = new command(this.editor);
            }
        }
    };
</script>

<style scoped>
    .editor {
        position: relative;
        width: 100%;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }

    .bottom-container {
        position: relative;
    }
</style>