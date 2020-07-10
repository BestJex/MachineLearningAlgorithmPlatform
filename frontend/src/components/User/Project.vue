<template>
    <div class="project-container" style="padding-top: 50px;">
        <el-row justify="center" type="flex">
            <el-col :span="18">
                <div class="action-group">
                    <el-row justify="space-between" type="flex">
                        <el-col class="action-group-left">
                            <el-button :disabled="!multipleSelection.length"
                                       @click="deleteUserProjects"
                                       circle
                                       class="action-btn"
                                       icon="el-icon-delete"
                                       type="danger"
                                       size="small"></el-button>
                            <el-button :disabled="!multipleSelection.length"
                                       @click="copyProjects"
                                       circle
                                       class="action-btn"
                                       icon="el-icon-copy-document"
                                       type="primary"
                                       size="small"></el-button>
                        </el-col>
                        <el-col class="action-group-right">
                            <el-button @click="isShowDialog = true"
                                       class="action-btn"
                                       size="medium">
                                创建项目
                            </el-button>
                        </el-col>
                    </el-row>
                </div>
                <el-divider/>
                <el-table :data="projectList"
                          @selection-change="handleSelectionChange"
                          border
                          highlight-current-row
                          style="width: 100%"
                          v-loading="loading">
                    <el-table-column type="selection" width="55"/>
                    <el-table-column label="项目名">
                        <template slot-scope="scope">
                            <el-link @click="$router.push({path: `/graph/${scope.row.id}`})">
                                {{ scope.row.project_name }}
                            </el-link>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="状态" width="100px">
                        <template slot-scope="scope">
                            <span>{{ scope.row.status | statusFilter}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="所有者" width="150px">
                        <template slot-scope="scope">
                            <span>{{ scope.row.owner }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="编辑时间" width="150px">
                        <template slot-scope="scope">
                            <span>{{ scope.row.modified_time }}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页器 -->
                <div class="paginator">
                    <el-pagination :current-page="listQuery.page"
                                   :page-size="listQuery.page_size"
                                   :page-sizes="[10, 20]"
                                   :total="count"
                                   @current-change="pageCurrentChange"
                                   @size-change="pageSizeChange"
                                   layout="total, sizes, prev, pager, next, jumper"
                                   style="text-align: center"/>
                </div>
            </el-col>
        </el-row>
        <el-dialog :append-to-body="false"
                   :close-on-click-modal="false"
                   :modal-append-to-body="true"
                   :visible.sync="isShowDialog"
                   custom-class="preview-dialog"
                   title="创建项目">
            <el-form :model="form"
                     :rules="rules"
                     label-position="top"
                     ref="ruleForm">
                <el-form-item label="项目名称"
                              prop="projectName">
                    <el-input @keyup.native.enter="createProject"
                              size="small"
                              v-model="form.projectName"></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer" slot="footer">
                <el-button :disabled="form.projectName === '' || form.owner === ''"
                           @click="createProject"
                           type="primary">
                    完 成
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import projectApi from "@/api/project";
    import {Notification} from 'element-ui';

    export default {
        name: "Project",
        data() {
            return {
                count: 0,
                loading: false,
                projectList: [],
                isShowDialog: false,
                multipleSelection: [],
                form: {
                    projectName: ''
                },
                listQuery: {
                    page: 1,
                    page_size: 10
                },
                rules: {
                    projectName: [{
                        required: true,
                        message: '请输入项目名称',
                        trigger: 'blur',
                    }]
                },
            }
        },
        computed: {
            ...mapGetters(['token', 'username'])
        },
        filters: {
            statusFilter(status) {
                switch (status) {
                    case 'init':
                        return '初始化';
                    case 'loading':
                        return '运行中';
                    case 'complete':
                        return '已完成';
                }
            }
        },
        created() {
            this.getUserProjects();
        },
        methods: {
            /**
             * 获取当前登录用户的所有项目
             */
            getUserProjects() {
                this.loading = true;
                projectApi.getProjects(this.listQuery).then(response => {
                    this.count = response.count;
                    this.projectList = response.res;
                    this.loading = false;
                }).catch(error => {
                    this.loading = false;
                    Notification({
                        title: '错误',
                        message: error,
                        type: 'error',
                        duration: 3000,
                    });
                })
            },

            pageSizeChange(val) {
                this.listQuery.page_size = val;
                this.listQuery.page = 1;
                this.getUserProjects();
            },

            pageCurrentChange(val) {
                this.listQuery.page = val;
                this.getUserProjects();
            },

            createProject() {
                this.$refs['ruleForm'].validate(valid => {
                    if (valid) {
                        // eslint-disable-next-line no-unused-vars
                        projectApi.createGraph(this.form).then(response => {
                            Notification({
                                title: '成功',
                                message: '创建项目成功',
                                type: 'success',
                                duration: 3000
                            });
                            this.getUserProjects();
                            this.isShowDialog = false;
                            this.form.projectName = '';
                            this.form.owner = '';
                        }).catch(err => {
                            Notification({
                                title: '错误',
                                message: err.data,
                                type: 'error',
                                duration: 3000
                            });
                        });
                    }
                })
            },

            handleSelectionChange(val) {
                const multipleSelection = [];
                val.forEach(item => {
                    multipleSelection.push(item.id)
                })
                this.multipleSelection = multipleSelection;
            },

            /**
             * 删除项目
             */
            deleteUserProjects() {
                this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
                    confirmButtonText: '确 定',
                    cancelButtonText: '取 消',
                    type: 'warning',
                }).then(() => {
                    return projectApi.deleteProjects({
                        projectIds: this.multipleSelection
                    })
                    // eslint-disable-next-line no-unused-vars
                }).then(response => {
                    Notification({
                        title: '成功',
                        message: '文件移除成功',
                        type: 'success',
                        duration: 3000,
                    })
                    this.getUserProjects();
                }).catch(error => {
                    this.$message({
                        type: error === 'cancel' ? 'info' : 'error',
                        message: error === 'cancel' ? '已取消删除' : error.data,
                    })
                });
            },

            copyProjects() {
                this.axios({
                    method: 'post',
                    url: 'http://39.105.21.62/flow/api/graph/copy/',
                    withCredentials: true,
                    data: {projectIds: this.multipleSelection},
                    // eslint-disable-next-line no-unused-vars
                }).then(res => {
                    Notification({
                        title: '成功',
                        message: '文件复制成功',
                        type: 'success',
                        duration: 3000
                    })
                    this.getUserProjects()
                }).catch(err => {
                    this.$message({
                        type: err === 'cancel' ? 'info' : 'error',
                        message: err === 'cancel' ? '已取消复制' : err.data
                    })
                })
            },
        }
    }
</script>

<style scoped>
    .action-btn {
        margin-left: 10px;
    }

    .paginator {
        margin-top: 20px;
    }
</style>
<style lang="scss">
    .project-container {
        .el-divider--horizontal {
            margin: 5px 0 24px 0;
        }
    }
</style>
<style lang="scss" scoped>
    .action-group {
        text-align: right;
        padding: 30px 0 0 0;

        .action-group-left {
            display: flex;
            align-items: center;
        }
    }

    .avatar-container {
        margin-right: 30px;

        .avatar-wrapper {
            margin-top: 5px;
            position: relative;
            display: flex;
            align-items: flex-end;
            font-size: 16px;
            font-family: fantasy;

            .user-avatar {
                cursor: pointer;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: 2px solid #2980b9;
            }

            .el-icon-caret-bottom {
                cursor: pointer;
                position: absolute;
                right: -20px;
                top: 25px;
                font-size: 12px;
            }
        }
    }
</style>