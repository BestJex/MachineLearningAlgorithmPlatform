<template>
    <div :style="`width:${detailWidth}px;`" id="navigator">
        <div class="pannel-title">导航器</div>
        <div class="minimap" id="minimap" ref="minimap"></div>
    </div>
</template>

<script>
    import eventBus from "@/mixin/eventBus";
    import MiniMap from "@antv/g6/es/plugins/minimap";

    export default {
        name: "miniMap",
        data() {
            return {
                minimap: null,
                graph: null,
                detailWidth: 200,
                canvasWidth: 0,
                canvasHeight: 0,
            }
        },
        created() {
            this.bindEvent();
            this.canvasWidth = document.documentElement.clientWidth - 400;
            this.canvasHeight = document.documentElement.clientHeight - 100;
        },
        mounted() {
            this.$nextTick(() => {
                this.initMinmap()
            })
        },
        methods: {
            initMinmap() {
                let width = this.detailWidth
                let height = (this.detailWidth * this.canvasHeight) / this.canvasWidth
                height = 150
                const cfgs = {
                    size: [width, height],
                    container: 'minimap',
                }
                this.minimap = new MiniMap({...cfgs});
            },
            bindEvent() {
                eventBus.$on('afterAddPage', page => {
                    this.graph = page.graph
                    this.bindPage()
                })
            },
            bindPage() {
                if (!this.minimap || !this.graph) {
                    return
                }
                this.graph.addPlugin(this.minimap)
            }
        },
    }
</script>

<style scoped>
    #navigator {
        width: 200px;
        text-align: center;
        position: absolute;
        bottom: 0;
        right: 0;
        z-index: 3;
    }

    .pannel-title {
        height: 32px;
        border-top: 1px solid #dce3e8;
        border-bottom: 1px solid #dce3e8;
        background: #ebeef2;
        color: #000;
        line-height: 28px;
        padding-left: 12px;
    }
</style>