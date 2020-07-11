(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-cd977dc8"],{"096b":function(t,e,n){"use strict";var o=n("9eb7"),a=n.n(o);a.a},"5d86":function(t,e,n){"use strict";var o=n("8d7b"),a=n.n(o);a.a},"707c":function(t,e,n){"use strict";n.r(e);var o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"project-container",staticStyle:{"padding-top":"50px"}},[n("el-row",{attrs:{justify:"center",type:"flex"}},[n("el-col",{attrs:{span:18}},[n("div",{staticClass:"action-group"},[n("el-row",{attrs:{justify:"space-between",type:"flex"}},[n("el-col",{staticClass:"action-group-left"},[n("el-button",{staticClass:"action-btn",attrs:{disabled:!t.multipleSelection.length,circle:"",icon:"el-icon-delete",type:"danger",size:"small"},on:{click:t.deleteProjects}}),t._v(" "),n("el-button",{staticClass:"action-btn",attrs:{disabled:!t.multipleSelection.length,circle:"",icon:"el-icon-copy-document",type:"primary",size:"small"},on:{click:t.copyProjects}})],1),t._v(" "),n("el-col",{staticClass:"action-group-right"},[n("el-button",{staticClass:"action-btn",attrs:{size:"medium"},on:{click:function(e){t.isShowDialog=!0}}},[t._v("\n\t\t\t\t\t\t\t创建项目\n\t\t\t\t\t\t")])],1)],1)],1),t._v(" "),n("el-divider"),t._v(" "),n("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticStyle:{width:"100%"},attrs:{data:t.project_list,border:"","highlight-current-row":""},on:{"selection-change":t.handleSelectionChange}},[n("el-table-column",{attrs:{type:"selection",width:"55"}}),t._v(" "),n("el-table-column",{attrs:{label:"项目名"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("el-link",{on:{click:function(n){return t.$router.push({path:"/graph/"+e.row.id})}}},[t._v("\n\t\t\t\t\t\t\t"+t._s(e.row.project_name)+"\n\t\t\t\t\t\t")])]}}])}),t._v(" "),n("el-table-column",{attrs:{align:"center",label:"状态",width:"100px"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("span",[t._v(t._s(t._f("statusFilter")(e.row.status)))])]}}])}),t._v(" "),n("el-table-column",{attrs:{align:"center",label:"所有者",width:"150px"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("span",[t._v(t._s(e.row.owner))])]}}])}),t._v(" "),n("el-table-column",{attrs:{align:"center",label:"编辑时间",width:"150px"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("span",[t._v(t._s(e.row.modified_time))])]}}])})],1),t._v(" "),n("div",{staticClass:"paginator"},[n("el-pagination",{staticStyle:{"text-align":"center"},attrs:{"current-page":t.listQuery.page,"page-size":t.listQuery.page_size,"page-sizes":[10,20],total:t.count,layout:"total, sizes, prev, pager, next, jumper"},on:{"current-change":t.pageCurrentChange,"size-change":t.pageSizeChange}})],1)],1)],1),t._v(" "),n("el-dialog",{attrs:{"append-to-body":!1,"close-on-click-modal":!1,"modal-append-to-body":!0,visible:t.isShowDialog,"custom-class":"preview-dialog",title:"创建项目"},on:{"update:visible":function(e){t.isShowDialog=e}}},[n("el-form",{ref:"ruleForm",attrs:{model:t.form,rules:t.rules,"label-position":"top"}},[n("el-form-item",{attrs:{label:"项目名称",prop:"projectName"}},[n("el-input",{attrs:{size:"small"},nativeOn:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.createProject(e)}},model:{value:t.form.projectName,callback:function(e){t.$set(t.form,"projectName",e)},expression:"form.projectName"}})],1)],1),t._v(" "),n("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[n("el-button",{attrs:{disabled:""===t.form.projectName||""===t.form.owner,type:"primary"},on:{click:t.createProject}},[t._v("完 成\n\t\t\t")])],1)],1)],1)},a=[],i=(n("8e6e"),n("456d"),n("ac6a"),n("ade3")),r=n("e74e"),c=(n("c24f"),n("5c96")),s=n("2f62");function l(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);e&&(o=o.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,o)}return n}function u(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?l(Object(n),!0).forEach((function(e){Object(i["a"])(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var p={name:"Project",data:function(){return{listQuery:{page:1,page_size:10},count:0,isShowDialog:!1,project_list:[],loading:!1,form:{projectName:""},rules:{projectName:[{required:!0,message:"请输入项目名称",trigger:"blur"}]},multipleSelection:[]}},computed:u({},Object(s["b"])(["token","username"])),filters:{statusFilter:function(t){switch(t){case"init":return"初始化";case"loading":return"运行中";case"complete":return"已完成"}}},created:function(){this.getGraphs()},methods:{getGraphs:function(){var t=this;this.loading=!0,r["a"].getGraphs(this.listQuery).then((function(e){t.count=e.count,t.project_list=e.res,t.loading=!1})).catch((function(e){t.loading=!1}))},pageSizeChange:function(t){this.listQuery.page_size=t,this.listQuery.page=1,this.getGraphs()},pageCurrentChange:function(t){this.listQuery.page=t,this.getGraphs()},createProject:function(){var t=this;this.$refs["ruleForm"].validate((function(e){e&&r["a"].createGraph(t.form).then((function(e){Object(c["Notification"])({title:"成功",message:"创建项目成功",type:"success",duration:3e3}),t.getGraphs(),t.isShowDialog=!1,t.form.projectName="",t.form.owner=""})).catch((function(t){Object(c["Notification"])({title:"错误",message:t.data,type:"error",duration:3e3})}))}))},handleSelectionChange:function(t){var e=[];t.forEach((function(t){e.push(t.id)})),this.multipleSelection=e},deleteProjects:function(){var t=this;this.$confirm("此操作将永久删除该项目, 是否继续?","提示",{confirmButtonText:"确 定",cancelButtonText:"取 消",type:"warning"}).then((function(){return r["a"].deleteGraphs({projectIds:t.multipleSelection})})).then((function(e){Object(c["Notification"])({title:"成功",message:"文件移除成功",type:"success",duration:3e3}),t.getGraphs()})).catch((function(e){t.$message({type:"cancel"===e?"info":"error",message:"cancel"===e?"已取消删除":e.data})}))},copyProjects:function(){var t=this;this.axios({method:"post",url:"http://39.105.21.62/flow/api/graph/copy/",withCredentials:!0,data:{projectIds:this.multipleSelection}}).then((function(e){Object(c["Notification"])({title:"成功",message:"文件复制成功",type:"success",duration:3e3}),t.getGraphs()})).catch((function(e){t.$message({type:"cancel"===e?"info":"error",message:"cancel"===e?"已取消复制":e.data})}))}}},f=p,d=(n("8d1e"),n("096b"),n("5d86"),n("2877")),g=Object(d["a"])(f,o,a,!1,null,"0fc6cf66",null);e["default"]=g.exports},"8d1e":function(t,e,n){"use strict";var o=n("b244"),a=n.n(o);a.a},"8d7b":function(t,e,n){},"9eb7":function(t,e,n){},b244:function(t,e,n){}}]);