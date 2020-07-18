<template>
	<div>
		<el-tabs :tab-position="'left'">
			<el-tab-pane label="文件管理">
				<el-button
					@click="toggleSelectionDelete()"
					size="small"
					type="primary"
					style="margin-left: 10px">
					批量删除
				</el-button>
				<el-button
					@click="toggleSelection()"
					size="small"
					type="primary">
					取消选择
				</el-button>
				<el-table
					ref="multipleTable"
					:data="fileList.filter(data => !search || data.filename.includes(search)).slice((listQuery.page - 1) * listQuery.page_size, listQuery.page * listQuery.page_size)"
					tooltip-effect="dark" style="width: 100%;"
					:default-sort="{prop: 'buildtime', order: 'descending'}"
					@selection-change="handleSelectionChange"
					@sort-change="getSortRes">
					<el-table-column
						type="selection"
						width="45"></el-table-column>
					<el-table-column
						prop="buildtime"
						label="日期"
						width="150"
						sortable></el-table-column>
					<el-table-column
						prop="filename"
						label="文件名"
						width="90"></el-table-column>
					<el-table-column
						prop="size"
						label="文件大小"
						width="100"
						sortable="custom"></el-table-column>
					<el-table-column
						align="right">
						<template
							slot="header"
							slot-scope="scope">
							<el-input
								v-model="search"
								size="mini"
								placeholder="输入关键字搜索"/>
						</template>
						<template
							slot-scope="scope"
							style="margin-left: 15px; display: flex">
							<!--							<el-button size="mini"-->
							<!--									   type="success"-->
							<!--									   @click="handleDownload(scope.$index, scope.row)">-->
							<!--								Download-->
							<!--							</el-button>-->
							<el-button
								size="mini"
								type="danger"
								@click="handleDelete(scope.$index, scope.row)">
								Delete
							</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div class="paginator">
					<el-pagination
						:current-page="listQuery.page"
						:page-size="listQuery.page_size"
						:page-sizes="[10]"
						:total="fileList.filter(data => !search || data.filename.includes(search)).length"
						@current-change="pageCurrentChange"
						layout="total, sizes, prev, pager, next, jumper"
						style="text-align: center"/>
				</div>
			</el-tab-pane>
			<el-tab-pane label="上传文件">
				<el-upload
					:before-remove="beforeRemove"
					:before-upload="beforeUpload"
					:data="{graphId: this.$route.params.id}"
					:file-list="uploadFileList"
					:on-error="onUploadErr"
					:on-remove="handleRemove"
					:on-success="onUploadSuccess"
					:headers="{Authorization: 'JWT ' + token}"
					accept=".jpg, .csv, .png"
					:action="base_api + 'upload_file'"
					class="upload-demo"
					:show-file-list="true"
					multiple
					drag
					style="display: inline-block; margin-left: 20%;">
					<i class="el-icon-upload"></i>
					<div class="el-upload__text">将文件拖到此处，或<em>点击上传（.jpg, .csv, .png）</em></div>
					<div class="el-upload__text">大小限制10MB</div>
				</el-upload>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
    import fileApi from '@/api/file'
    import { mapGetters } from 'vuex'
    import configJS from '@/statics/config'
    import { Notification } from 'element-ui'

    export default {
        name: 'file-mange',
        data() {
            return {
                count: 0,
                state: '',
                search: '',
                status: true,
                sortCount: 0, // 修复element-ui排序特性用的参数
                timeout: null,
                restaurants: [],
                fileListNotSort: [],
                multipleSelection: [],
                base_api: configJS.BASE_API,
                listQuery: {
                    page: 1,
                    page_size: 10
                },
            }
        },
        computed: {
            ...mapGetters(['token', 'fileList']),
            graphId: {
                get() {
                    return this.$route.params.id || this.$store.getters.graphId
                }
            },
			// 上传文件列表
            uploadFileList: {
                get() {
                    let tempFileList = this.fileList
					for (let i = 0; i < tempFileList.length; i++) {
                        tempFileList[i].name = tempFileList[i].filename
					}
                    return tempFileList
				}
			}
        },
        props: {
            graph: {
                type: Object,
                required: true
            }
        },
        created() {

        },
        mounted() {
            this.restaurants = this.loadAll()
        },
        methods: {
            loadAll() {
                let fileListLength = this.fileList.length
                let fileArray = Array(fileListLength)
                for (let i = 0; i < this.fileList.length; i++) {
                    fileArray[i] = {
                        'value': this.fileList[i].name,
                    }
                }
                return fileArray
            },
            querySearchAsync(queryString, cb) {
                const restaurants = this.restaurants
                const results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants

                clearTimeout(this.timeout)
                this.timeout = setTimeout(() => {
                    cb(results)
                }, 300 * Math.random())
            },
            createStateFilter(queryString) {
                return (state) => {
                    return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
                }
            },
            handleSelect(item) {
                console.log(item)
            },

            handleDownload(index, row) {
                console.log(index, row)
            },

            handleDelete(index, row) {
                fileApi.deleteFile({ filelist: [row.id] }).then(() => {
                    Notification({
                        title: '成功',
                        message: '文件移除成功',
                        type: 'success',
                        duration: 3000
                    })
                    this.$store.dispatch('app/getFileList').then((res) => {
                        ////////////////////////细节问题日后再说
                        let fileListLength = this.$store.state.app.fileList.length
                        if (this.listQuery.page_size * (this.listQuery.page - 1) + 1 >= fileListLength) {
                            this.listQuery.page--
                        }
                    })
                }).catch(error => {
                    this.$message({
                        message: error,
                        type: 'error'
                    })
                })
            },

            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row)
                    })
                } else {
                    this.$refs.multipleTable.clearSelection()
                }
            },

            toggleSelectionDelete() {
                this.multipleSelection.forEach(item => {
                    fileApi.deleteFile({ filelist: [item.id] }).then(() => {
                        Notification({
                            title: '成功',
                            message: '文件移除成功',
                            type: 'success',
                            duration: 3000
                        })
                        this.$store.dispatch('app/getFileList')
                    }).catch(error => {
                        this.$message({
                            message: error,
                            type: 'error'
                        })
                    })
                })
            },

            handleSelectionChange(val) {
                this.multipleSelection = val
            },

            // 删除文件
            handleRemove(file, fileList) {
                fileApi.deleteFile({ id: file.id }).then(() => {
                    Notification({
                        title: '成功',
                        message: '文件移除成功',
                        type: 'success',
                        duration: 1000
                    })
                    this.$store.dispatch('app/getFileList')
                })
            },

            // 在删除文件之间需要用户确认并且判断用户要删除的文件是否存在
            beforeRemove(file, fileList) {
                return new Promise((resolve, reject) => {
                    this.$confirm(`确定移除 ${file.name}？`).then(res => {
                        return fileApi.isFileNameValid({
                            filename: file.name,
                            graphId: this.graphId
                        })
                    }).then(res => {
                        if (res.data) {
                            resolve()
                        } else {
                            Notification({
                                title: '错误',
                                message: '文件不存在或文件路径不正确',
                                type: 'error',
                                duration: 3000
                            })
                            reject()
                        }
                    }).catch(err => {
                        return reject()
                    })
                })
            },

            // 上传文件之间的检查操作
            beforeUpload(file) {
                // 上传文件大小不能超过 10MB
                if (!(file.size / 1024 / 1024 < 10)) {
                    Notification({
                        title: '错误',
                        message: '上传文件大小不能超过 10MB!',
                        type: 'error',
                        duration: 3000,
                    })
                    return false
                }
                return new Promise((resolve, reject) => {
                    // 判断文件是否已存在
                    fileApi.isFileNameValid({
                        filename: file.name,
                        graphId: this.graphId
                    }).then(res => {
                        if (res.data) {
                            return this.$confirm(`文件 ${file.name} 已存在，确认覆盖吗？`)
                        } else {
                            return resolve()
                        }
                    }).then(() => {
                        return resolve()
                    }).catch(() => {
                        return reject()
                    })
                })
            },

            // 文件上传成功时
            onUploadSuccess(res, file, fileList) {
                Notification({
                    title: '成功',
                    message: '文件上传成功',
                    type: 'success',
                    duration: 3000
                })
                this.$store.dispatch('app/getFileList')
            },

            // 上传文件出现错误时
            onUploadErr(res, file, fileList) {
                // console.log(res)
                this.$message({
                    message: res,
                    type: 'error',
                })
            },

            pageCurrentChange(val) {
                this.listQuery.page = val
            },

            getSortRes(res) {
                // console.log(res)
                if (res.prop === 'size') {
                    if (res.order === 'descending') {
                        this.fileList.sort((a, b) => {
                            let size1, size2
                            size1 = parseFloat(a.size.substring(0, a.size.length - 2))
                            size2 = parseFloat(b.size.substring(0, b.size.length - 2))
                            return size1 - size2
                        })
                    } else if (res.order === 'ascending') {
                        this.fileList.sort((a, b) => {
                            let size1, size2
                            size1 = parseFloat(a.size.substring(0, a.size.length - 2))
                            size2 = parseFloat(b.size.substring(0, b.size.length - 2))
                            return size2 - size1
                        })
                    } else if (res.order === null) {
                        // 去他妈的深拷贝
                        this.fileList = this.fileListNotSort.concat()
                    }
                } else if (res.prop === 'buildtime') {
                    if (res.order === 'descending') {
                        this.fileList.sort((a, b) => {
                            return a.buildtime < b.buildtime ? 1 : -1
                        })
                    } else if (res.order === 'descending') {
                        this.fileList.sort((a, b) => {
                            return a.buildtime > b.buildtime ? 1 : -1
                        })
                    } else if (res.order === null) {
                        this.fileList = this.fileListNotSort.concat()
                    }
                }
            },
        }
    }
</script>

<style>
</style>