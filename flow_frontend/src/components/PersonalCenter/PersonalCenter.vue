<template>
    <div class="container view">
        <div class="left_box">
            <ul class="aside">
                <li v-for="(item, _) in asideList"
                    :key="item.id"
                    :class="{asideActive: item.id === asideIndex}"
                    @click="asideClick(item.id)">
                    <a class="zl" style="cursor: pointer">{{item.title}}</a>
                </li>
            </ul>
        </div>
        <div class="view-container" style="margin-left: 250px">
            <!--个人资料-->
            <div v-show="asideIndex === 1" class="cont view">
                <div class="right_cont">
                    <h3 class="title">个人资料</h3>
                    <div class="user_info">
                        <div class="header">
                            <img src="@/assets/img/logo.jpg" alt="" class="head">
                            <!--                            <p class="modify">修改头像</p>-->
                        </div>
                        <div class="right_c">
                            <div class="nick">
                                <span class="mod" @click="changeInformation()" v-if="!changeInformationFlag">
                                    修改资料
                                </span>
                                <span class="mod" @click="saveChangeInformation()" v-if="changeInformationFlag">
                                    保存资料
                                </span>
                            </div>
                            <ul class="self">
                                <li class="comon" v-for="(item, _) in userInfo" :key="item.id">
                                    <div>
                                        <span>{{item.title}}：</span>
                                        <span v-if="!changeInformationFlag">
                                            {{item.value ? item.value : "不告诉你！"}}
                                        </span>
                                        <input v-model="item.value" v-if="changeInformationFlag"
                                               :disabled="item.id === 1"></input>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <!--项目列表-->
            <div v-show="asideIndex === 2" class="acc_project">
                <div class="acc_index_t">
                    <h3 class="acc_t">
                        <strong>项目列表</strong>
                    </h3>
                </div>
                <div class="acc_pass_con">
                    <div style="margin-bottom: 20px;">
                        <span>等级：</span>
                        <span>{{userLevel}}</span>
                        <span style="margin-left: 100px;">已上传文件总数：</span>
                        <span>{{userFileCount}}</span>
                        <span style="margin-left: 100px;">已上传文件总大小：</span>
                        <span>{{(userTotalSize / 1024).toFixed(2)}}KB / {{userLevel + 1}}G</span>
                    </div>
                    <el-table
                            ref="multipleTable"
                            :data="fileTableData"
                            tooltip-effect="dark"
                            style="width: 100%"
                            :default-sort="{prop: 'buildtime', order: 'descending'}">
                        <el-table-column prop="buildtime" label="日期" width="200" sortable></el-table-column>
                        <el-table-column prop="filename" label="文件名" width="200"></el-table-column>
                        <el-table-column prop="size" label="文件大小" width="200" sortable></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <!--修改密码-->
            <div v-show="asideIndex === 3" class="acc_pass">
                <div class="acc_index_t">
                    <h3 class="acc_t">
                        <strong>修改密码</strong>
                    </h3>
                </div>
                <div class="acc_pass_con">
                    <ul class="acc_pass_list">
                        <li>
                            <label>输入旧密码：</label>
                            <label for="oldPassword"></label>
                            <input type="password" name="password" id="oldPassword"
                                   placeholder="输入旧密码" autocomplete="off" validate="true"
                                   data-rule="['password']" oncopy="return false" class="inpt"
                                   v-model="oldPassword">
                        </li>
                        <li>
                            <label>输入新密码：</label>
                            <label for="password"></label>
                            <input type="password" name="password" id="password"
                                   placeholder="6-18位数字和字母组合" autocomplete="off" validate="true"
                                   data-rule="['password']" oncopy="return false" class="inpt"
                                   v-model="newPassword">
                        </li>
                        <li>
                            <label>确认新密码：</label>
                            <label for="confirmPwd"></label>
                            <input id="confirmPwd" type="password" placeholder="确认新密码"
                                   autocomplete="off" oncopy="return false" class="inpt"
                                   v-model="confirmNewPassword">
                        </li>
                        <li class="acc_pass_b">
                            <button class="confirm_btn confirm_disable" @click="changePassword()">确认</button>
                        </li>
                        <br>
                    </ul>
                </div>
            </div>
            <!--绑定账号-->
            <div v-show="asideIndex === 6" class="content">
                <div class="bar">
                    <h3 class="title">绑定登录帐号</h3>
                </div>
                <ul class="bind_list">
                    <li class="item_cont">
                        <img src="https://i.csdn.net/static/img/bind_weixin.png" alt="微信" class="icon_img">
                        <span class="method_name">微信</span>
                        <span class="user_name">相守相忘</span>
                        <a href="javascript:void(0)" class="handle_text remove_text">解绑</a>
                    </li>
                    <br>
                    <li class="item_cont">
                        <img src="https://i.csdn.net/static/img/bind_qq.png" alt="QQ" class="icon_img">
                        <span class="method_name">QQ</span>
                        <span class="user_name">rm -rf /*</span>
                        <a href="javascript:void(0)" class="handle_text remove_text">解绑</a>
                    </li>
                    <br>
                    <li class="item_cont">
                        <img src="https://i.csdn.net/static/img/bind_github.png" alt="GitHub" class="icon_img">
                        <span class="method_name">GitHub</span>
                        <span class="user_name">koking0</span>
                        <a href="javascript:void(0)" class="handle_text remove_text">解绑</a>
                    </li>
                    <br>
                    <li class="item_cont">
                        <img src="https://i.csdn.net/static/img/bind_baidu.png" alt="百度" class="icon_img">
                        <span class="method_name">百度</span>
                        <span class="user_name">刘***k</span>
                        <a href="javascript:void(0)" class="handle_text remove_text">解绑</a>
                    </li>
                    <br>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import Message from "element-ui/packages/message/src/main";

    export default {
        name: "PersonalCenter",
        data() {
            return {
                asideList: [
                    {id: 1, name: "PersonalData", title: "个人资料"},
                    {id: 2, name: "ProjectList", title: "项目列表"},
                    {id: 3, name: "ChangePassword", title: "修改密码"},
                    {id: 6, name: "BindAccount", title: "绑定账号"},
                ],
                asideIndex: 1,

                token: "",
                changeInformationFlag: false,
                userInfo: [
                    {id: 1, name: "username", title: "昵称", value: localStorage.getItem('username')},
                    {id: 2, name: "name", title: "姓名", value: ''},
                    {id: 3, name: "gender", title: "性别", value: ''},
                    {id: 5, name: "phone", title: "手机", value: ''},
                    {id: 6, name: "mailbox", title: "邮箱", value: ''},
                ],
                userLevel: 0,
                userTotalSize: 0,
                userFileCount: 0,

                oldPassword: "",
                newPassword: "",
                confirmNewPassword: "",
                changePasswordError: "",

                fileTableData: [],
            };
        },
        methods: {
            handleDelete(index, row) {
                console.log('index = ', index);
            },

            asideClick(itemId) {
                this.asideIndex = itemId;
            },
            changePassword() {
                // 1.校验密码位数
                if (this.oldPassword.length < 6 || this.newPassword.length < 6) {
                    this.$message({
                        message: '密码位数错误！',
                        type: 'warning'
                    });
                }
                // 2.校验新密码和确认密码
                if (this.newPassword !== this.confirmNewPassword) {
                    this.$message({
                        message: '新密码不一致！',
                        type: 'error'
                    });
                }
                // 3.整理消息体
                let changePasswordParam = {
                    username: localStorage.getItem('username'),
                    password: this.oldPassword,
                    newpassword: this.newPassword,
                }
                // 4.通过axios发送数据
                this.axios({
                    method: 'post',
                    url: 'http://39.105.21.62/flow/api/user/chapassword',
                    data: changePasswordParam
                }).then(res => {
                    this.$message('密码更改成功！');
                }).catch(err => {
                    this.$message({
                        message: err,
                        type: 'error'
                    });
                })
            },
            changeInformation() {
                this.changeInformationFlag = true;
            },
            saveChangeInformation() {
                let phone = this.userInfo[3].value;
                if (!/^1[34578]\d{9}$/.test(phone)) {
                    Message({
                        message: "请填写正确的手机号！",
                        type: "warning",
                    });
                    return
                }
                let mailbox = this.userInfo[4].value;
                if (!/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(mailbox)) {
                    Message({
                        message: "请填写正确的邮箱！",
                        type: "warning",
                    });
                    return
                }

                this.changeInformationFlag = false;
                let changeData = {
                    username: localStorage.getItem('username'),
                    name: this.userInfo[1].value,
                    gender: this.userInfo[2].value,
                    phone: this.userInfo[3].value,
                    mailbox: this.userInfo[4].value,
                };
                this.axios({
                    method: 'post',
                    url: 'http://39.105.21.62/flow/api/user/chainformation',
                    data: changeData,
                }).then(res => {
                    this.$message({
                        message: '保存成功！',
                        type: 'success'
                    });
                }).catch(err => {
                    this.$message({
                        message: err,
                        type: 'error'
                    });
                })
            }
        },
        created() {
            // 1.获取用户个人资料
            this.axios({
                method: 'get',
                url: `http://39.105.21.62/flow/api/user/information?username=${localStorage.getItem('username')}`,
            }).then(res => {
                this.userInfo[1].value = res.data.data.name;
                this.userInfo[2].value = res.data.data.gender === 2 ? '男' : '女';
                this.userInfo[3].value = res.data.data.phone;
                this.userInfo[4].value = res.data.data.mailbox;
            }).catch(err => {
                this.$message({
                    message: err,
                    type: 'error'
                });
            });
            // 2.获取用户等级、上传文件总数、总文件大小
            this.axios({
                method: 'get',
                url: `http://39.105.21.62/flow/api/fileinf?username=${localStorage.getItem('username')}`,
            }).then(res => {
                this.userLevel = res.data.data.userlvl;
                this.userTotalSize = res.data.data.totalsize;
                this.userFileCount = res.data.data.filecount;
            }).catch(err => {
                this.$message({
                    message: err,
                    type: 'error'
                });
            });
            // 3.获取用户所有上传文件
            this.axios({
                method: 'get',
                url: `http://39.105.21.62/flow/api/filelistall?username=${localStorage.getItem('username')}`,
            }).then(res => {
                this.fileTableData = Array(res.data.data.list)[0];
                for (let i = 0; i < this.fileTableData.length; i++) {
                    let item = this.fileTableData[i];
                    let TIndex = item.buildtime.indexOf('T');
                    let pointIndex = item.buildtime.indexOf('.');
                    item.buildtime = item.buildtime.substring(0, TIndex) + ' ' + item.buildtime.substring(TIndex + 1, pointIndex);
                    item.size = (parseInt(item.size) / 1024).toFixed(2) + 'KB';
                }
            }).catch(err => {
                this.$message({
                    message: err,
                    type: 'error'
                });
            });
        }
    }
</script>

<style scoped>
    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        text-align: center;
        line-height: 200px;
    }

    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        line-height: 160px;
    }

    .container {
        flex: 1;
        width: 1200px;
        margin: 16px auto 0;
    }

    .container .left_box {
        width: 199px;
        float: left;
        -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .05);
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .05);
    }

    .container .left_box .aside {
        background: #fff;
        border-bottom: 1px solid #e9eaeb;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li, ul {
        padding: 0;
        margin: 0;
        list-style: none;
    }

    .container .left_box .aside li.asideActive {
        background: rgb(40, 150, 170);
        color: #fff;
    }

    .container .left_box .aside li {
        height: 70px;
        line-height: 70px;
        text-align: center;
        width: 100%;
        font-size: 14px;
        color: #4d4d4d;
        padding-left: 16px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        margin-bottom: 1px;
    }

    .container .left_box .aside li.asideActive .zl {
        color: #fff;
    }

    .container .left_box .aside li .zl {
        font-size: 14px;
        color: #4d4d4d;
        display: inline-block;
        height: 35px;
        line-height: 35px;
        width: 100%;
    }

    a {
        text-decoration: none;
    }

    .cont {
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
    }

    .cont .right_cont h3.title {
        font-size: 20px;
        color: #3d3d3d;
        height: 90px;
        line-height: 90px;
        border-bottom: 1px solid #e0e0e0;
    }

    .cont .right_cont div.user_info {
        overflow: hidden;
    }

    .cont .right_cont div.user_info .header {
        float: left;
        text-align: center;
        margin-right: 16px;
        cursor: pointer;
    }

    .cont .right_cont div.user_info .header .head {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        margin: 16px auto 0;
    }

    .cont .right_cont div.user_info .header .modify {
        font-size: 14px;
        color: #3399ea;
        margin-top: 8px;
        cursor: pointer;
    }

    .cont .right_cont div.user_info .right_c {
        float: left;
        width: 820px;
    }

    .cont .right_cont div.user_info .right_c .right_info {
        margin-top: 16px;
        overflow: hidden;
    }

    .cont .right_cont div.user_info .right_c .right_info .id_card {
        height: 20px;
        line-height: 20px;
    }

    .cont .right_cont div.user_info .right_c .right_info .id_card .id_name {
        float: left;
        font-size: 14px;
        color: #999;
        margin-right: 16px;
        margin-top: 3px;
    }

    .cont .right_cont div.user_info .right_c .csdn_info {
        margin-top: 8px;
        margin-bottom: 16px;
    }

    .cont .right_cont div.user_info .right_c .csdn_info .splits {
        color: #ccc;
        margin-right: 16px;
    }

    .cont .right_cont div.user_info .right_c .csdn_info a.charge {
        font-size: 14px;
        color: #3399ea;
        margin: 0;
    }

    .cont .right_cont div.user_info .right_c .line {
        height: 1px;
        background: #e0e0e0;
    }

    .cont .right_cont div.user_info .right_c .nick {
        height: 36px;
        line-height: 36px;
        overflow: hidden;
    }

    .cont .right_cont div.user_info .right_c .nick span {
        float: left;
        font-size: 14px;
        color: #4d4d4d;
    }

    .cont .right_cont div.user_info .right_c .nick .mod {
        float: right;
        font-size: 14px;
        color: #3399ea;
        cursor: pointer;
    }

    .cont .right_cont div.user_info .right_c .self .comon {
        height: 36px;
        line-height: 36px;
        font-size: 14px;
        color: #4d4d4d;
    }

    .cont .right_cont div.user_info .right_c .self .comon:last-child {
        height: auto;
    }

    .cont .right_cont div.user_info .right_c .self .intro {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        font-size: 14px;
        color: #4d4d4d;
        overflow: hidden;
    }

    .acc_index_t {
        height: 88px;
        line-height: 88px;
        border-bottom: 1px solid #e0e0e0;
    }

    .acc_index_t .acc_t {
        font-size: 20px;
        color: #3d3d3d;
    }

    .acc_index_t .acc_t em, .acc_index_t .acc_t i {
        font-style: normal;
    }

    .acc_index_t .acc_t em {
        margin-left: 10px;
    }

    .acc_index_t .acc_t em, .acc_index_t .acc_t i {
        font-style: normal;
    }

    li, ul {
        padding: 0;
        margin: 0;
        list-style: none;
    }

    .acc_index .acc_con_list li {
        height: 83px;
        line-height: 83px;
        border-bottom: 1px solid #e0e0e0;
    }

    .acc_index .acc_con_list li a, .acc_index .acc_con_list li label {
        display: inline-block;
        vertical-align: middle;
    }

    .acc_index .acc_con_list li label {
        width: 16%;
        font-size: 14px;
    }

    .acc_index .acc_con_list li a, .acc_index .acc_con_list li label {
        display: inline-block;
        vertical-align: middle;
    }

    .acc_index .acc_con_list li label .icon {
        width: 16px;
        height: 16px;
    }

    .icon {
        width: 1em;
        height: 1em;
        vertical-align: -.15em;
        fill: currentColor;
    }

    .icon {
        overflow: hidden;
    }

    :not(svg) {
        transform-origin: 0 0;
    }

    .icon {
        width: 1em;
        height: 1em;
        vertical-align: -.15em;
        fill: currentColor;
    }

    .acc_index .acc_con_list li label {
        width: 16%;
        font-size: 14px;
    }

    svg:not(:root) {
        overflow: hidden;
    }

    .acc_index_t {
        height: 88px;
        line-height: 88px;
        border-bottom: 1px solid #e0e0e0;
    }

    .acc_index_t {
        height: 88px;
        line-height: 88px;
        border-bottom: 1px solid #e0e0e0;
    }

    .acc_index_t .acc_t {
        font-family: PingFangSC-Semibold;
        font-size: 20px;
        color: #3d3d3d;
    }

    .acc_index_t .acc_t {
        font-family: PingFangSC-Semibold;
        font-size: 20px;
        color: #3d3d3d;
    }

    .acc_pass_con {
        padding: 28px 0 30px;
    }

    .acc_pass_con .acc_pass_list {
        width: 360px;
        margin: 0 auto;
    }

    .acc_pass_con .acc_pass_list li {
        position: relative;
        width: 100%;
        margin-bottom: 8px;
        font-size: 0;
    }

    .acc_pass_con .acc_pass_list li label {
        width: 100px;
        text-align: right;
        font-size: 14px;
        color: #4d4d4d;
    }

    .acc_pass_con .acc_pass_list li input, .acc_pass_con .acc_pass_list li label {
        display: inline-block;
        vertical-align: middle;
    }

    .acc_pass_con .acc_pass_list li input {
        width: 252px;
        height: 32px;
        line-height: 30px;
        margin-left: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 0 8px;
        font-size: 14px;
        color: #4d4d4d;
    }

    .acc_pass_con .acc_pass_list li input, .acc_pass_con .acc_pass_list li label {
        display: inline-block;
        vertical-align: middle;
    }

    .acc_pass_con .acc_pass_list li .visible_icon {
        position: absolute;
        right: 10px;
        top: 8px;
        font-size: 16px;
        color: #999;
        cursor: pointer;
    }

    .icon {
        width: 1em;
        height: 1em;
        vertical-align: -.15em;
        fill: currentColor;
    }

    .icon {
        overflow: hidden;
    }

    .acc_pass_con .acc_pass_list li {
        position: relative;
        margin-bottom: 8px;
        font-size: 0;
    }

    .acc_pass_con .acc_pass_list li label {
        width: 100px;
        text-align: right;
        font-size: 14px;
        color: #4d4d4d;
    }

    .acc_pass_con .acc_pass_list li input, .acc_pass_con .acc_pass_list li label {
        display: inline-block;
        vertical-align: middle;
    }

    .acc_pass_con .acc_pass_list li input {
        width: 252px;
        height: 32px;
        line-height: 30px;
        margin-left: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 0 8px;
        font-size: 14px;
        color: #4d4d4d;
    }

    .acc_pass_con .acc_pass_list li input, .acc_pass_con .acc_pass_list li label {
        display: inline-block;
        vertical-align: middle;
    }

    .acc_pass_con .acc_pass_list li .visible_icon {
        position: absolute;
        right: 10px;
        top: 8px;
        font-size: 16px;
        color: #999;
        cursor: pointer;
    }

    .acc_pass_con .acc_pass_list .acc_pass_b {
        padding: 20px 0 0 108px;
    }

    .acc_pass_con .acc_pass_list li {
        position: relative;
        margin-bottom: 8px;
        font-size: 0;
    }

    .acc_pass_con .acc_pass_list li .confirm_disable {
        color: #4d4d4d;
        background: #f5f5f5;
        border: 1px solid #f5f5f5;
        cursor: default;
    }

    .acc_pass_con .acc_pass_list li .confirm_btn {
        width: 80px;
        height: 36px;
        line-height: 34px;
        border-radius: 4px;
        font-size: 14px;
        text-align: center;
    }

    .contain {
        overflow: hidden !important;
    }

    .form-main .acount-title {
        padding: 32px 0;
        margin-bottom: 28px;
        border-bottom: 1px solid #e0e0e0;
        font-size: 20px;
        color: #3d3d3d;
        letter-spacing: 0;
        line-height: 24px;
    }

    .form-coustom {
        width: 50%;
        margin: 0 auto 30px;
    }

    .form-coustom .form-info {
        margin-bottom: 25px;
    }

    .form-coustom .form-group {
        margin: 8px 0;
        font-size: 0;
    }

    .form-coustom .form-info span {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        color: #4d4d4d;
        letter-spacing: 0;
        line-height: 22px;
    }

    .form-coustom .form-info p {
        font-size: 14px;
        color: #ccc;
        letter-spacing: 0;
        line-height: 22px;
    }

    .form-coustom .form-info {
        margin-bottom: 25px;
    }

    .form-coustom .form-group {
        margin: 8px 0;
        font-size: 0;
    }

    .hide {
        display: none !important;
    }

    .hide {
        display: none !important;
    }

    .form-coustom .form-info span {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        color: #4d4d4d;
        letter-spacing: 0;
        line-height: 22px;
    }

    .form-coustom .form-info p {
        font-size: 14px;
        color: #ccc;
        letter-spacing: 0;
        line-height: 22px;
    }

    .form-coustom .form-group {
        margin: 8px 0;
        font-size: 0;
    }

    .hide {
        display: none !important;
    }

    .form-coustom .form-label {
        width: 20%;
        font-size: 14px;
        color: #4d4d4d;
        letter-spacing: 0;
        line-height: 22px;
        vertical-align: middle;
    }

    .inline {
        display: inline-block;
    }

    .contain .dropdown-select {
        width: auto;
        position: relative;
        z-index: 10;
    }

    .form-coustom .select-list {
        width: 15%;
        vertical-align: middle;
    }

    .inline {
        display: inline-block;
    }

    .contain .dropdown-select .dropdown-text {
        display: inline-block;
        height: 32px;
        padding: 0 8px 0 20px;
        position: relative;
        border: 1px solid #ccc;
        border-radius: 4px;
        line-height: 32px;
        cursor: pointer;
    }

    .contain .dropdown-select .dropdown-menus, .contain .dropdown-select .dropdown-text {
        width: 100%;
        font-size: 14px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        background-color: #fff;
    }

    .form-coustom .control-phone {
        width: 35%;
        margin-left: 8px;
    }

    .inline {
        display: inline-block;
    }

    .form-coustom .form-control {
        height: 32px;
        padding: 0 8px;
        line-height: 100%;
        width: 100%;
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 4px;
        vertical-align: middle;
    }

    .contain .drop-wrap {
        width: 52%;
        padding: 0;
        top: -.32rem;
        left: 20%;
    }

    .contain .drop-wrap .dropdown-select {
        width: auto;
    }

    .contain .dropdown-select {
        width: auto;
        position: relative;
        z-index: 10;
    }

    .form-coustom .select-list {
        width: 15%;
        vertical-align: middle;
    }

    .contain .drop-wrap .dropdown-select .dropdown-menus {
        border-top: 1px solid #ccc;
        margin-top: -1px;
    }

    .contain .dropdown-select .dropdown-menus {
        display: none;
        margin: -4px 0 0;
        padding: 0 8px;
        position: absolute;
        background-color: #fff;
        border-left: 1px solid #ccc;
        border-right: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
    }

    .contain .dropdown-select .dropdown-menus, .contain .dropdown-select .dropdown-text {
        width: 100%;
        font-size: 14px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        background-color: #fff;
    }

    .contain .dropdown-select .dropdown-menus li {
        padding: 4px 0;
    }

    .contain .drop-wrap .dropdown-select .dropdown-menus li span {
        display: inline-block;
        width: 20%;
    }

    .contain .dropdown-select .dropdown-menus li span {
        display: block;
        cursor: pointer;
        font-size: 14px;
        color: #4d4d4d;
    }

    .contain .drop-wrap .dropdown-select .dropdown-menus li em {
        font-style: normal;
    }

    .form-coustom .form-group {
        margin: 8px 0;
        font-size: 0;
    }

    .form-coustom .form-label {
        width: 20%;
        font-size: 14px;
        color: #4d4d4d;
        letter-spacing: 0;
        line-height: 22px;
        vertical-align: middle;
    }

    .inline {
        display: inline-block;
    }

    .form-coustom .control-col {
        width: 52%;
    }

    .inline {
        display: inline-block;
    }

    .control-col-pos {
        position: relative;
    }

    .form-coustom .control-code {
        width: 100%;
        padding-right: 40%;
    }

    .form-coustom .form-control {
        height: 32px;
        padding: 0 8px;
        line-height: 100%;
        width: 100%;
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 4px;
        vertical-align: middle;
    }

    .inline {
        display: inline-block;
    }

    .form-coustom .btn-control {
        position: absolute;
        top: 50%;
        right: 4px;
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%);
        background-color: transparent;
        border: none;
        font-size: 14px;
        color: #3399ea;
        line-height: 24px;
    }

    .btn {
        height: 36px;
        border-radius: 4px;
        cursor: pointer;
    }

    .form-coustom .form-group {
        margin: 8px 0;
        font-size: 0;
    }

    .form-coustom .form-group-error {
        margin-top: -10px;
        min-height: 30px;
    }

    .form-coustom .form-label {
        width: 20%;
        font-size: 14px;
        color: #4d4d4d;
        letter-spacing: 0;
        line-height: 22px;
        vertical-align: middle;
    }

    .text-error {
        display: inline-block;
        margin: 8px 0 0;
        color: #f21f2b;
        font-size: 12px;
    }

    .hide {
        display: none !important;
    }

    .form-coustom .form-submit .btn {
        width: 80px;
        border: none;
    }

    .btn[disabled] {
        cursor: default;
    }

    .btn-primary__disabled {
        color: #c2c2c2;
        background-color: #f5f5f5;
        border-color: transparent;
    }

    .btn {
        height: 36px;
        border-radius: 4px;
        cursor: pointer;
    }

    .content .bar {
        overflow: hidden;
        height: 90px;
        line-height: 90px;
        border-bottom: 1px solid #e0e0e0;
    }

    .content .bar {
        overflow: hidden;
        height: 90px;
        line-height: 90px;
        border-bottom: 1px solid #e0e0e0;
    }

    .content .bar .title {
        font-size: 20px;
        color: #3d3d3d;
        float: left;
    }

    .content .bar .title {
        font-size: 20px;
        color: #3d3d3d;
        float: left;
    }

    li, ul {
        padding: 0;
        margin: 0;
        list-style: none;
    }

    .content .bind_list .item_cont {
        height: 68px;
        width: 100%;
        line-height: 68px;
        overflow: hidden;
        border-bottom: 1px solid #e0e0e0;
        cursor: pointer;
    }

    .content .bind_list .item_cont .icon_img {
        width: 30px;
        height: 30px;
        float: left;
        border-radius: 50%;
        margin-top: 19px;
    }

    .content .bind_list .item_cont .method_name {
        font-size: 16px;
        color: #4d4d4d;
        float: left;
        margin-left: 12px;
        width: 250px;
    }

    .content .bind_list .item_cont .user_name {
        font-size: 14px;
        color: #ccc;
        float: left;
    }

    .content .bind_list .item_cont .remove_text {
        color: #ca0c16;
    }

    .content .bind_list .item_cont .handle_text {
        font-size: 14px;
        color: #3399ea;
        cursor: pointer;
        float: right;
    }
</style>