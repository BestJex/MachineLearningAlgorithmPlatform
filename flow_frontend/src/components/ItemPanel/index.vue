<template>
    <div class="main">
        <div
                :style="`left: ${itemWidth}px; height: 500px; margin-top: 100px;display: ${$store.state.app.operation ? 'block' : 'none'}`"
                @mousedown="onResizeMouseDown"
                class="resizer"
                id="item-resizer"></div>
        <div :style="`width: ${itemWidth}px;`" class="itempannel" id="itempannel">
            <Item/>
        </div>
    </div>
</template>

<script>
    import Item from './item'
    import eventBus from '@/utils/eventBus'

    export default {
        components: {Item},
        data() {
            return {
                page: null,
                command: null,

                // 可拉伸侧边栏
                isActive: false,
                startX: 0,
                endX: 0,
                DEFAULT_ITEM_WIDTH: 200,
                DEFAULT_RESIZER_LEFT: 190,
                MAX_ITEM_WIDTH: 400,
                MIN_ITEM_WIDTH: 200
            }
        },
        computed: {
            itemWidth: {
                get() {
                    return this.$store.getters.itemWidth;
                },
                set(val) {
                    this.$store.dispatch('app/setItemPannelWidth', val)
                }
            }
        },
        created() {
            this.bindEvent()
        },
        methods: {
            bindEvent() {
                eventBus.$on('afterAddPage', page => {
                    this.page = page
                })
            },
            onResizeMouseDown(e) {

                this.isActive = true
                this.startX = e.clientX

                let itempannel = document.getElementById('itempannel')
                let resizer = document.getElementById('item-resizer')

                const preItemWidth = this.itemWidth;
                // 拦截器
                document.onmousemove = e => {
                    this.onResizeMouseMove(e, preItemWidth, itempannel, resizer)
					// 增加用户体验，实时修改相应组件尺寸
					const nowItempannelWidth = parseInt(
                        itempannel.style.width.replace('px', '')
                    );
                    if (nowItempannelWidth !== this.itemWidth) {
                        this.itemWidth = nowItempannelWidth
                    }
                    // 拦截器，不允许宽度过小

                }

                document.onmouseup = e => {
                    this.isActive = false
                    const nowItempannelWidth = parseInt(
                        itempannel.style.width.replace('px', '')
                    );
                    if (nowItempannelWidth !== this.itemWidth) {
                        this.itemWidth = nowItempannelWidth
                    }
                    // this.$store.dispatch(
                    //   'app/setItemPannelWidth',
                    //   parseInt(itempannel.style.width.replace('px', ''))
                    // )
                }
            },
            onResizeMouseMove(e, preItemWidth, itempannel, resizer) {
                if (e.witch === 0) {
                    this.isActive = false
                }

                if (this.isActive) {
                    this.endX = e.clientX

                    let nowItempannelWidth = parseInt(
                        itempannel.style.width.replace('px', '')
                    )
                    if (
                        nowItempannelWidth <= this.MAX_ITEM_WIDTH &&
                        nowItempannelWidth >= this.MIN_ITEM_WIDTH
                    ) {
                        itempannel.style.width = preItemWidth - this.startX + this.endX + 'px'
                        resizer.style.left = preItemWidth - this.startX + this.endX + 'px'
                    }

                    nowItempannelWidth = parseInt(itempannel.style.width.replace('px', ''))
                    let nowResizerLeft = parseInt(resizer.style.left.replace('px', ''))
                    if (nowItempannelWidth > this.MAX_ITEM_WIDTH) {
                        itempannel.style.width = `${this.MAX_ITEM_WIDTH}px`
                        resizer.style.left = `${this.MAX_ITEM_WIDTH - 10}px`
                    } else if (
                        nowItempannelWidth < this.MIN_ITEM_WIDTH ||
                        nowResizerLeft < this.MIN_ITEM_WIDTH
                    ) {
                        itempannel.style.width = `${this.MIN_ITEM_WIDTH}px`
                        resizer.style.left = `${this.MIN_ITEM_WIDTH - 10}px`
                        resizer.style.left = `${this.MIN_ITEM_WIDTH - 10}px`
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
	.main {
		/*height: calc(100vh - 45px);*/
	}

    // 隐藏滚动条
    ::-webkit-scrollbar {
        display: none
    }

    .itempannel {
        position: absolute;
        left: 0;
        z-index: 2;
        background: rgb(246, 249, 252);
        border-right: 1px solid #e6e9ed;
        /*以下两行代码*/
        height: calc(100vh - 60px);
		overflow-y: scroll;
        /*设置超出滚动*/
    }

    .itempannel ul {
        padding: 0 0 0 16px;
    }

    .itempannel li {
        color: rgba(0, 0, 0, 0.65);
        border-radius: 4px;
        width: 160px;
        height: 28px;
        line-height: 26px;
        padding-left: 8px;
        border: 1px solid rgba(0, 0, 0, 0);
        list-style-type: none;
    }

    .itempannel li:hover {
        background: white;
        border: 1px solid #ced4d9;
        cursor: move;
    }

    .itempannel .pannel-type-icon {
        width: 16px;
        height: 16px;
        display: inline-block;
        vertical-align: middle;
        margin-left: 8px;
    }

    .resizer {
        cursor: col-resize;
        position: absolute;
        width: 10px;
        top: 0;
        bottom: 0;
        z-index: 99;
        transform: scale(-1, 1);

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