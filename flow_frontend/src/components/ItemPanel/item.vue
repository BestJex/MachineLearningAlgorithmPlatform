<template>
    <div>
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
                @click="isShowTreeNodeAppand = true"></el-button>
        <el-button
                v-show="operation"
                type="warning"
                icon="el-icon-refresh-left"
                circle
                @click="recoveryNodes()"></el-button>
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
                  <span
                          class="custom-tree-node"
                          slot-scope="{ node, data }">
                      <span v-show="!operation">{{ node.label }}</span>
                      <el-input v-model="node.label" v-show="operation"></el-input>
                  </span>
        </el-tree>
        <el-dialog
                :append-to-body="true"
                :visible.sync="isShowTreeNodeRecovery"
                custom-class="preview-dialog"
                title="恢复结点">
            <!--            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>-->
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="city in cities" :label="city.name" :key="city.id">{{city.name}}</el-checkbox>
            </el-checkbox-group>
            <el-button
                    @click="recoveryTreeNode()"
                    size="small"
                    style="margin-top: 20px; margin-left: 450px;"
                    type="success">确认
            </el-button>
        </el-dialog>
        <el-dialog
                :append-to-body="true"
                :visible.sync="isShowTreeNodeAppand"
                custom-class="preview-dialog"
                title="添加结点">
            <div style="margin: 15px 0;"></div>
            <el-button
                    @click="appendNodes()"
                    size="small"
                    style="margin-top: 20px; margin-left: 450px;"
                    type="success">确认
            </el-button>
        </el-dialog>
    </div>
</template>


<script>
    import eventBus from '@/utils/eventBus';
    import {mapGetters} from 'vuex';

    export default {
        data() {
            return {
                checkAll: false,
                checkedCities: [],
                cities: [],
                isIndeterminate: true,

                isShowTreeNodeRecovery: false,
                isShowTreeNodeAppand: false,
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
                page: null,
                command: null,
                nodeList: null,
                offsetX: 0,
                clientX: 0,
                offsetY: 0,
                clientY: 0,
                operation: false,
            }
        },
        computed: {
            ...mapGetters(['isAllowDrop']),
        },
        created() {
            this.bindEvent();
            // 1.获取左侧树形图
            this.getTree();
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            },
        },
        methods: {
            handleCheckAllChange(val) {
                this.checkedCities = val ? this.cities : [];
                this.isIndeterminate = false;
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
                this.axios({
                    method: 'get',
                    url: `https://bird.ioliu.cn/v2?url=http://39.105.21.62/flow/api/node_template/?graph_id=${this.$route.params.id}`,
                }).then(res => {
                    this.nodeList = res.data.data.path.data;
                }).catch(err => {
                    this.$message({
                        message: err,
                        type: 'error'
                    });
                });
            },

            handleCheckChange(data, checked, indeterminate) {
                // console.log(data);
            },

            /**
             * 操作节点
             */
            handleOperation() {
                this.operation = !this.operation;
                let itempannel = document.getElementById('itempannel');
                if (this.operation) {
                    itempannel.style.width = 250 + 'px';
                } else {
                    itempannel.style.width = 240 + 'px';
                    // 保存修改的树形图
                    let data = {
                        graph_id: this.$route.params.id,
                        nodeList: JSON.stringify(this.nodeList),
                    }
                    this.axios({
                        method: 'post',
                        url: `https://bird.ioliu.cn/v2?url=http://39.105.21.62/flow/api/updatetree`,
                        data: data,
                    }).then(res => {
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
             * 添加节点：根据json文件添加新的节点
             */
            appendNodes() {
                this.isShowTreeNodeAppand = false;
            },

            /**
             * 恢复节点：恢复标砖模板中已经被删除的节点
             */
            recoveryNodes() {
                this.axios({
                    method: 'get',
                    url: `http://39.105.21.62/flow/api/searchdeletenode?graphid=${this.$route.params.id}&username=${localStorage.getItem('username')}`,
                }).then(res => {
                    this.cities = res.data.data.list;
                    if (this.cities.length === 0) {
                        this.$message({
                            message: "没有已删除的节点",
                            type: 'warning',
                        });
                    } else {
                        this.isShowTreeNodeRecovery = true;
                    }
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
                for (let i = 0; i < this.cities.length; i++) {
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
                    this.isShowTreeNodeRecovery = false;
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
            hideNodes() {
                let checkArr = this.$refs.tree.getCheckedNodes();
                console.log(checkArr);
            },

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
                        for (const [key, value] of Object.entries(node.data.information.inputattibute)) {
                            data.point_detail.push(value);
                        }
                        // 加载参数列表
                        for (const [key, value] of Object.entries(node.data.information.Parametersattibute)) {
                            data.node_detail.push(value);
                        }
                        // 加载输出节点
                        for (const [key, value] of Object.entries(node.data.information.outputattibute)) {
                            data.point_detail.push(value);
                        }
                        data.shape = "customNode";
                        data.type = 'node';
                        this.command.executeCommand('add', [data]);
                    }
                    this.$store.commit('app/SET_ALLOWDROP', false);
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

            allowDrop(node, _node, type) {
                return this.operation;
            },

            handleDragStart(node, ev) {
                // console.log('drag start', node);
            },

            handleDragEnter(draggingNode, dropNode, ev) {
                // console.log('tree drag enter: ', dropNode.label);
            },

            handleDragLeave(draggingNode, dropNode, ev) {
                // console.log('tree drag leave: ', dropNode.label);
            },

            handleDragOver(draggingNode, dropNode, ev) {
                // console.log('tree drag over: ', dropNode.label);
            },

            handleDragEnd(draggingNode, dropNode, dropType, ev) {
                // console.log('tree drag end: ', dropNode && dropNode.label, dropType);
            },

            handleDrop(draggingNode, dropNode, dropType, ev) {
                // console.log('tree drop: ', dropNode.label, dropType);
            },

            bindEvent() {
                eventBus.$on('afterAddPage', page => {
                    this.page = page;
                    this.command = page.command;
                })
            },
        }
    }
</script>

<style lang="scss">
    .itempannel {
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

    .grabbable {
        cursor: move;
    }

    .grabbable:active {
        cursor: grabbing;
    }

    .itempannel .pannel-type-icon {
        width: 16px;
        height: 16px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 8px;
    }

    .tree {
        position: relative;
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