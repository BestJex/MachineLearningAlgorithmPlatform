<template>
    <div style="height: 600px">
        <div
                :style="`right:${detailWidth}px;`"
                @mousedown="onResizeMouseDown"
                class="resizer"
                id="detail-resizer"></div>
        <div
                :style="`width:${detailWidth}px;`"
                class="detailpannel"
                id="detailpannel">
            <detail/>
        </div>
    </div>
</template>

<script>
    import detail from "@/components/Editor/components/DetailPanel/components/detail";

    export default {
        name: "index",
        components: {
            detail,
        },
        data() {
            return {
                status: 'canvas-selected',
                showGrid: false,
                page: {},
                graph: {},
                item: {},
                node: {},
                grid: null,
                form: {},
                // 可拉伸侧边栏
                isActive: false,
                startX: 0,
                endX: 0,
                detailWidth: 200,
                DEFAULT_DETAIL_WIDTH: 200,
                DEFAULT_RESIZER_RIGHT: 200,
                MAX_DETAIL_WIDTH: 400,
                MIN_DETAIL_WIDTH: 180
            }
        },
        methods: {
            onResizeMouseDown(e) {
                this.isActive = true;
                this.startX = e.clientX;

                let detailpannel = document.getElementById('detailpannel');
                let resizer = document.getElementById('detail-resizer');

                const preDetailWidth = this.detailWidth;
                document.onmousemove = e => {
                    this.onResizeMouseMove(e, preDetailWidth, detailpannel, resizer);
                }

                document.onmouseup = () => {
                    this.isActive = false;
                    const nowDetailpannelWidth = parseInt(
                        detailpannel.style.width.replace('px', '')
                    );
                    if (nowDetailpannelWidth !== this.detailWidth) {
                        this.detailWidth = nowDetailpannelWidth;
                    }
                }
            },

            onResizeMouseMove(e, preDetailWidth, detailpannel, resizer) {
                if (e.width === 0) {
                    this.isActive = false;
                }

                if (this.isActive) {
                    this.endX = e.clientX;

                    let nowDetailpannelWidth = parseInt(
                        detailpannel.style.width.replace('px', '')
                    )
                    if (
                        nowDetailpannelWidth <= this.MAX_DETAIL_WIDTH &&
                        nowDetailpannelWidth >= this.MIN_DETAIL_WIDTH
                    ) {
                        detailpannel.style.width =
                            preDetailWidth + this.startX - this.endX + 'px';
                        resizer.style.right = preDetailWidth + this.startX - this.endX + 'px';
                    }

                    nowDetailpannelWidth = parseInt(
                        detailpannel.style.width.replace('px', '')
                    )
                    let nowResizerRight = parseInt(resizer.style.right.replace('px', ''));

                    if (nowDetailpannelWidth > this.MAX_DETAIL_WIDTH) {
                        detailpannel.style.width = `${this.MAX_DETAIL_WIDTH}px`;
                        resizer.style.right = `${this.MAX_DETAIL_WIDTH}px`;
                    } else if (
                        nowDetailpannelWidth < this.MIN_DETAIL_WIDTH ||
                        nowResizerRight < this.MIN_DETAIL_WIDTH
                    ) {
                        detailpannel.style.width = `${this.MIN_DETAIL_WIDTH}px`;
                        resizer.style.right = `${this.MIN_DETAIL_WIDTH}px`;
                    }
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    .detailpannel {
        height: 100%;
        position: absolute;
        right: 0;
        z-index: 2;
        background: rgb(246, 249, 252);
        width: 200px;
        border-left: 1px solid #e6e9ed;
    }

    .detailpannel .block-container {
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
