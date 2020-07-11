<template>
    <div>
        <div
                :style="`left: ${treeWidth}px; height: 500px; margin-top: 100px;`"
                @mousedown="onResizeMouseDown"
                class="reSizer"
                id="treeReSizer"></div>
        <div :style="`width: ${treeWidth}px;`" class="tree" id="tree">
            <hr>
            <el-button
                    :type="operation ? 'primary' : ''"
                    icon="el-icon-edit"
                    circle
                    style="margin-left: 5px;"
                    @click="handleOperation()"></el-button>
            <el-button
                    v-show="operation"
                    type="success"
                    icon="el-icon-circle-plus-outline"
                    circle
                    @click="addNodes()"></el-button>
            <!--        <el-button-->
            <!--                v-show="operation"-->
            <!--                type="info"-->
            <!--                icon="el-icon-view"-->
            <!--                circle-->
            <!--                @click="hideNodes()"></el-button>-->
            <el-button
                    v-show="operation"
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    @click="deleteNodes()"></el-button>
            <el-input
                    v-show="!operation"
                    placeholder="输入关键字进行过滤"
                    v-model="filterText"
                    style="display: inline-block; width: 80%">
            </el-input>
            <hr>
            <el-tree
                    ref="tree"
                    class="filter-tree"
                    default-expand-all
                    :data="nodeList"
                    :draggable="true"
                    :props="defaultProps"
                    :allow-drop="allowDrop"
                    :allow-drag="allowDrag"
                    :highlight-current="true"
                    :show-checkbox="operation"
                    :filter-node-method="filterNode"
                    :expand-on-click-node="!operation"
                    @node-drop="handleDrop"
                    @node-drag-over="handleDragOver"
                    @node-drag-end="handleElDragEnd"
                    @check-change="handleCheckChange"
                    @node-drag-enter="handleDragEnter"
                    @node-drag-leave="handleDragLeave"
                    @node-drag-start="handleElDragStart">
            </el-tree>
            <el-dialog
                    :append-to-body="true"
                    :visible.sync="isShowTreeNodeManage"
                    custom-class="preview-dialog"
                    title="恢复结点">
                <!--<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>-->
                <div style="margin: 15px 0;"></div>
                <el-checkbox-group v-model="checkedCities"
                                   @change="handleCheckedCitiesChange">
                    <el-checkbox v-for="city in cities"
                                 :label="city.name"
                                 :key="city.id">
                        {{city.name}}
                    </el-checkbox>
                </el-checkbox-group>
                <el-button
                        @click="recoveryTreeNode()"
                        size="small"
                        style="margin-top: 20px; margin-left: 450px;"
                        type="success">确认
                </el-button>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import projectApi from "@/api/project";
    import eventBus from "@/mixin/eventBus";

    export default {
        name: "index",
        data() {
            return {
                endX: 0,
                startX: 0,
                page: null,
                treeWidth: 240,
                isActive: false,
                MaxTreeWidth: 400,
                MinTreeWidth: 200,

                checkAll: false,
                checkedCities: [],
                cities: [],
                isIndeterminate: true,
                isShowTreeNodeManage: false,
                treeNode: {
                    nodeId: 0,
                    categoryName: "",
                    parentId: 0,
                },
                treeList: [],
                initTree: false,
                treeListData: [],
                defaultProps: {
                    children: 'children',
                    label: 'name',
                },
                filterText: '',
                command: null,
                nodeList: null,
                offsetX: 0,
                clientX: 0,
                offsetY: 0,
                clientY: 0,
                operation: false,
            }
        },
        created() {
            this.bindEvent();
            this.getTree();
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            },
        },
        methods: {
            bindEvent() {
                eventBus.$on('afterAddPage', page => {
                    this.page = page;
                    this.command = page.command;
                })
            },
            
            onResizeMouseDown(e) {
                this.isActive = true;
                this.startX = e.clientX;

                let tree = document.getElementById('tree');
                let reSizer = document.getElementById('treeReSizer');

                const preTreeWidth = this.treeWidth;
                document.onmousemove = e => {
                    this.onResizeMouseMove(e, preTreeWidth, tree, reSizer)
                };
                document.onmouseup = () => {
                    this.isActive = false
                    const nowTreeWidth = parseInt(tree.style.width.replace('px', ''));
                    if (nowTreeWidth !== this.treeWidth) {
                        this.treeWidth = nowTreeWidth;
                    }
                };
            },
            
            onResizeMouseMove(e, preTreeWidth, tree, reSizer) {
                if (e.width === 0) {
                    this.isActive = false;
                }

                if (this.isActive) {
                    this.endX = e.clientX;

                    let nowTreeWidth = parseInt(tree.style.width.replace('px', ''));
                    if (
                        nowTreeWidth <= this.MaxTreeWidth &&
                        nowTreeWidth >= this.MinTreeWidth
                    ) {
                        tree.style.width = preTreeWidth - this.startX + this.endX + 'px';
                        reSizer.style.left = preTreeWidth - this.startX + this.endX + 'px';
                    }

                    nowTreeWidth = parseInt(tree.style.width.replace('px', ''));
                    let nowReSizerLeft = parseInt(reSizer.style.left.replace('px', ''));
                    if (nowTreeWidth > this.MaxTreeWidth) {
                        tree.style.width = `${this.MaxTreeWidth}px`;
                        reSizer.style.left = `${this.MaxTreeWidth - 10}px`;
                    } else if (
                        nowTreeWidth < this.MinTreeWidth ||
                        nowReSizerLeft < this.MinTreeWidth
                    ) {
                        tree.style.width = `${this.MinTreeWidth}px`;
                        reSizer.style.left = `${this.MinTreeWidth - 10}px`;
                        reSizer.style.left = `${this.MinTreeWidth - 10}px`;
                    }
                }
            },
            handleCheckedCitiesChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.cities.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
            },

            /**
             * 获取左侧树形图
             */
            getTree() {
                projectApi.getTree({graph_id: this.$route.params.id}).then(res => {
                    this.nodeList = res.data.path.data;
                }).catch(error => {
                    this.$message({
                        message: error,
                        type: 'error'
                    });
                });
            },

            // eslint-disable-next-line no-unused-vars
            handleCheckChange(data, checked, indeterminate) {
                // console.log(data);
            },

            /**
             * 操作节点
             */
            handleOperation() {
                this.operation = !this.operation;
                let tree = document.getElementById('tree');
                if (this.operation) {
                    tree.style.width = 250 + 'px';
                } else {
                    tree.style.width = 240 + 'px';
                    // 保存修改的树形图
                    let data = {
                        graph_id: this.$route.params.id,
                        nodeList: JSON.stringify(this.nodeList),
                    }
                    this.axios({
                        method: 'post',
                        url: `https://bird.ioliu.cn/v2?url=http://39.105.21.62/flow/api/updatetree`,
                        data: data,
                    }).then(() => {
                        this.getTree();
                    }).catch(err => {
                        this.$message({
                            message: err,
                            type: 'error'
                        });
                    });
                }
            },

            /**
             * 树形控件节点过滤
             */
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },

            /**
             * 新增节点
             */
            addNodes() {
                this.isShowTreeNodeManage = true;
                this.axios({
                    method: 'get',
                    url: `http://39.105.21.62/flow/api/searchdeletenode?graphid=${this.$route.params.id}&username=${localStorage.getItem('username')}`,
                }).then(res => {
                    this.cities = res.data.data.list;
                }).catch(err => {
                    this.$message({
                        message: err,
                        type: 'error'
                    });
                });
            },

            recoveryTreeNode() {
                console.log(this.checkedCities);
                let data = {
                    graphid: this.$route.params.id,
                    checked: [],
                };
                for (let i = 0; i < this.cities.length; i++){
                    for (let j = 0; j < this.checkedCities.length; j++) {
                        if (this.cities[i].name === this.checkedCities[j]) {
                            data.checked.push(this.cities[i]);
                        }
                    }
                }
                this.axios({
                    method: 'post',
                    url: `http://39.105.21.62/flow/api/recovernode`,
                    data: data,
                }).then(res => {
                    console.log(res);
                    this.getTree();
                    this.isShowTreeNodeManage = false;
                }).catch(err => {
                    this.$message({
                        message: err,
                        type: 'error'
                    });
                });
            },

            /**
             * 隐藏节点
             */
            // hideNodes() {
            //     let checkArr = this.$refs.tree.getCheckedNodes();
            //     console.log(checkArr);
            // },

            /**
             * 删除节点
             */
            deleteNodes() {
                let arr = this.$refs.tree.getCheckedNodes();
                let res = []
                for (let i = 0; i < arr.length; i++) {
                    res.push(arr[i].$treeNodeId);
                }
                for (let index = 0; index < res.length; index++) {
                    let item = res[index];
                    for (let i = 0; i < this.nodeList.length; i++) {
                        if (this.nodeList[i].$treeNodeId === item) {
                            this.nodeList.splice(i, 1);
                            continue;
                        }
                        if (this.nodeList[i].children) {
                            for (let j = 0; j < this.nodeList[i].children.length; j++) {
                                if (this.nodeList[i].children[j].$treeNodeId === item) {
                                    this.nodeList[i].children.splice(j, 1);
                                }
                            }
                        }
                    }
                }
            },

            handleElDragStart(node, e) {
                this.offsetX = e.offsetX;
                this.clientX = e.clientX;
                this.offsetY = e.offsetY;
                this.clientY = e.clientY;
            },

            /**
             * 拖拽结束时（可能未成功）触发的事件
             * @param node：被拖拽节点对应的 Node
             * @param _node：结束拖拽时最后进入的节点（可能为空）
             * @param p：被拖拽节点的放置位置（before、after、inner）
             * @param e：event
             */
            handleElDragEnd(node, _node, p, e) {
                // console.log(node);
                if (this.isAllowDrop) {
                    const item = JSON.parse(JSON.stringify(node.data));
                    item.template_id = item.id;
                    let data = {};
                    Object.assign(data, item);
                    if (this.page) {
                        const graph = this.page.graph;
                        const xy = graph.getPointByClient(e.x, e.y);
                        data.x = xy.x;
                        data.y = xy.y;
                        data.node_detail = [];
                        data.point_detail = [];
                        data.name = node.data.name;
                        data.label = node.data.name;
                        data.description = null;
                        data.status = "init";
                        // 加载输入节点
                        // eslint-disable-next-line no-unused-vars
                        for (const [key, value] of Object.entries(node.data.information.inputattibute)) {
                            data.point_detail.push(value);
                        }
                        // 加载参数列表
                        // eslint-disable-next-line no-unused-vars
                        for (const [key, value] of Object.entries(node.data.information.Parametersattibute)) {
                            data.node_detail.push(value);
                        }
                        // 加载输出节点
                        // eslint-disable-next-line no-unused-vars
                        for (const [key, value] of Object.entries(node.data.information.outputattibute)) {
                            data.point_detail.push(value);
                        }
                        data.shape = "customNode";
                        data.type = 'node';
                        this.command.executeCommand('add', [data]);
                    }
                }
            },

            /**
             * 判断节点是否可拖拽，只有非菜单节点可以拖拽
             * @param node
             * @returns {boolean}
             */
            allowDrag(node) {
                return !node.data.is_menu;
            },

            // eslint-disable-next-line no-unused-vars
            allowDrop(node, _node, type) {
                return this.operation;
            },

            // eslint-disable-next-line no-unused-vars
            handleDragStart(node, ev) {
                // console.log('drag start', node);
            },

            // eslint-disable-next-line no-unused-vars
            handleDragEnter(draggingNode, dropNode, ev) {
                // console.log('tree drag enter: ', dropNode.label);
            },

            // eslint-disable-next-line no-unused-vars
            handleDragLeave(draggingNode, dropNode, ev) {
                // console.log('tree drag leave: ', dropNode.label);
            },

            // eslint-disable-next-line no-unused-vars
            handleDragOver(draggingNode, dropNode, ev) {
                // console.log('tree drag over: ', dropNode.label);
            },

            // eslint-disable-next-line no-unused-vars
            handleDrop(draggingNode, dropNode, dropType, ev) {
                // console.log('tree drop: ', dropNode.label, dropType);
            },
        }
    }
</script>

<style scoped lang="scss">
    // 隐藏滚动条
    ::-webkit-scrollbar {
        display: none
    }

    .tree {
        left: 0;
        z-index: 2;
        position: absolute;
        background: rgb(246, 249, 252);
        border-right: 1px solid #e6e9ed;
        /*以下两行代码*/
        overflow: scroll;
        /*设置超出滚动*/
    }

    .tree ul {
        padding: 0 0 0 16px;
    }

    .tree li {
        color: rgba(0, 0, 0, 0.65);
        border-radius: 4px;
        width: 160px;
        height: 28px;
        line-height: 26px;
        padding-left: 8px;
        border: 1px solid rgba(0, 0, 0, 0);
        list-style-type: none;
    }

    .tree li:hover {
        background: white;
        border: 1px solid #ced4d9;
        cursor: move;
    }

    .tree .pannel-type-icon {
        width: 16px;
        height: 16px;
        display: inline-block;
        vertical-align: middle;
        margin-left: 8px;
    }

    .reSizer {
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

    .tree {
        .el-tree {
            background: #f6f9fc;

            .el-tree-node__content {
                background: #f6f9fc;

                &:hover {
                    background: rgba(0, 0, 0, 0.05);
                    color: rgb(51, 51, 51);
                }
            }

            .el-tree-node {
                &:focus {
                    background: rgba(0, 0, 0, 0.05);
                }

                &:focus > .el-tree-node__content {
                    background: rgba(0, 0, 0, 0.05);
                }
            }
        }
    }
</style>

<style scoped>
    .tree ul {
        padding: 0 0 0 16px;
    }

    .tree li {
        color: rgba(0, 0, 0, 0.65);
        border-radius: 4px;
        width: 160px;
        height: 28px;
        line-height: 26px;
        padding-left: 8px;
        border: 1px solid rgba(0, 0, 0, 0);
        list-style-type: none;
    }

    .tree li:hover {
        background: white;
        border: 1px solid #ced4d9;
        cursor: move;
    }

    .grabbable {
        cursor: move;
    }

    .grabbable:active {
        cursor: grabbing;
    }

    .tree .pannel-type-icon {
        width: 16px;
        height: 16px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 8px;
    }

    .tree {
        cursor: default;
        color: #606266;
    }

    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
</style>