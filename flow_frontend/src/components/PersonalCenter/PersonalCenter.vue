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
                            <p class="modify">修改头像</p></div>
                        <div class="right_c">
                            <div class="right_info">
                                <div class="id_card">
                                    <span class="id_name">ID：weixin_43336281</span>
                                </div>
                            </div>
                            <div class="nick">
                                <span data-v-0d738edb="">昵称：Alex 007</span>
                                <span class="mod">修改资料</span>
                            </div>
                            <ul class="self">
                                <li class="comon">姓名：刘兆峰</li>
                                <br>
                                <li class="comon">性别：男</li>
                                <br>
                                <li class="comon">生日：2000-10-01</li>
                                <br>
                                <li class="comon">职位：学生</li>
                                <br>
                                <li class="comon">公司：天津科技大学</li>
                                <br>
                                <li class="comon">学历：本科</li>
                                <br>
                                <li class="comon">学校：天津科技大学</li>
                                <br>
                                <li class="comon">行业：教育</li>
                                <br>
                            </ul>
                        </div>
                    </div>
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
                        <li class="error_tips">
                            <label style="color: red">{{changePasswordError}}</label>
                        </li>
                        <br>
                        <li class="acc_pass_b">
                            <button class="confirm_btn confirm_disable" @click="changePassword()">确认</button>
                        </li>
                        <br>
                    </ul>
                </div>
            </div>
            <!--修改手机-->
            <div v-show="asideIndex === 4" class="contain">
                <div class="form-main">
                    <div class="title acount-title">
                        <span data-v-5505c8c8="">
                            <strong data-v-5505c8c8="">修改手机号</strong>
                        </span>
                    </div>
                    <div role="form" class="form-coustom">
                        <div class="form-group form-info">
                            <span data-v-5505c8c8="">验证码将发送到手机188****9207</span>
                            <p data-v-5505c8c8="">如果长时间未收到验证码，请检查是否将运营商拉黑</p>
                        </div>
                        <div class="form-group form-info hide">
                            <span data-v-5505c8c8="">验证码将发送到邮箱</span>
                            <p data-v-5505c8c8="">如果长时间未收到验证码，请检查垃圾箱</p>
                        </div>
                        <div class="form-group hide">
                            <label class="inline form-label">输入新手机：</label>
                            <div class="select-list dropdown-select inline">
                                <span data-toggle="dropdown" data-target="drop-new-menus" data-value="86"
                                      class="dropdown-text" unselectable="on">
                                    86
                                </span>
                            </div>
                            <div class="inline control-phone">
                                <input type="text" id="phone" name="cnPhone" validate="true" data-rule="['enPhone']"
                                       autocomplete="off" class="form-control">
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-12 control-col-pos drop-wrap">
                            <div class="select-list dropdown-select control-col-absos">
                                <ul id="drop-new-menus" class="dropdown-list dropdown-menus">
                                    <li data-text="86">
                                        <span data-text="86">+ 86</span>
                                        <em data-text="86">中国</em></li>
                                    <br>
                                    <li data-text="1">
                                        <span data-text="1">+ 1</span>
                                        <em data-text="1">美国</em>
                                    </li>
                                    <br>
                                    <li data-text="1">
                                        <span data-text="1">+ 1</span>
                                        <em data-text="1">加拿大</em>
                                    </li>
                                    <br>
                                    <li data-text="852">
                                        <span data-text="852">+ 852</span>
                                        <em data-text="852">中国香港</em>
                                    </li>
                                    <br>
                                    <li data-text="886">
                                        <span data-text="886">+ 886</span>
                                        <em data-text="886">中国台湾</em>
                                    </li>
                                    <br>
                                    <li data-text="81">
                                        <span data-text="81">+ 81</span>
                                        <em data-text="81">日本</em>
                                    </li>
                                    <br>
                                    <li data-text="65">
                                        <span data-text="65">+ 65</span>
                                        <em data-text="65">新加坡</em>
                                    </li>
                                    <br>
                                </ul>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="inline form-label">填写验证码：</label>
                            <div class="inline control-col-pos control-col">
                                <input type="text" name="code" validate="true" data-rule="['code']" autocomplete="off"
                                       class="form-control inline control-code">
                                <button class="btn btn-confirm btn-control">获取短信验证码</button>
                            </div>
                        </div>
                        <div class="form-group form-group-error">
                            <label class="inline form-label"></label>
                            <div class="text-error hide"></div>
                        </div>
                        <div class="form-group">
                            <div class="form-submit">
                                <label class="inline form-label"></label>
                                <button disabled="disabled" data-type="phone" class="btn btn-primary__disabled">
                                    下一步
                                </button>
                            </div>
                        </div>
                        <div class="wx-wrap hide">
                            <div style="display: none;">
                                <div id="wxqr" class="wx-code">
                                    <iframe id="iframe_id"
                                            src="https://open.weixin.qq.com/connect/qrconnect?appid=wx0ae11b6a28b4b9fc&amp;scope=snsapi_login&amp;redirect_uri=https%3A%2F%2Fpassport.csdn.net%2Fv1%2Fservice%2FchangeMobile%2FcheckWeixin%3FmobileType%3Dweixin&amp;state=csdn&amp;login_type=jssdk&amp;self_redirect=default&amp;style=white&amp;href=https://csdnimg.cn/release/passport/history/css/replace-wx-style.css"
                                            sandbox="allow-scripts allow-top-navigation" frameborder="0" scrolling="no"
                                            width="172px" height="172px"></iframe>
                                </div>
                                <em data-v-5505c8c8="">请使用您绑定的微信账号扫码验证</em>
                            </div>
                            <div style="display: none;">
                                <div class="wx-info">
                                    <span data-v-5505c8c8="">
                                        <span class="phone-icon">
                                            <span class="error-icon">×</span>
                                        </span>
                                    </span>
                                    <em data-v-5505c8c8=""></em>
                                    <p data-v-5505c8c8="">
                                        <a href="" class="link-l link-button">重新扫码验证</a>
                                        <a href="" class="link-r link-button">返回</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="info-text hide">
                        <div class="info-status">
                            <label class="icon-coustom-check icon-control">
                                <svg aria-hidden="true" class="icon">
                                    <use xlink:href="#csdnc-check"></use>
                                </svg>
                            </label>
                        </div>
                        <span data-v-5505c8c8="">成功设置/修改手机</span>
                        <p data-v-5505c8c8="">新手机号码为</p>
                        <button class="btn btn-primary">完成(s)</button>
                    </div>
                    <div class="line"></div>
                </div>
            </div>
            <!--修改邮箱-->
            <div v-show="asideIndex === 5" class="form-main">
                <div class="title acount-title">
                    <span data-v-d2bb5870="">
                        <strong data-v-d2bb5870="">修改邮箱</strong>
                    </span>
                </div>
                <div role="form" class="form-coustom">
                    <div class="form-group form-info">
                        <span data-v-d2bb5870="">验证码将发送到al****邮箱</span>
                        <p data-v-d2bb5870="">如果长时间未收到验证码，请检查垃圾箱</p>
                    </div>
                    <div class="form-group form-info hide">
                        <span data-v-d2bb5870="">验证码将发送到手机188****9207</span>
                        <p data-v-d2bb5870="">如果长时间未收到验证码，请检查是否将运营商拉黑</p>
                    </div>
                    <div class="form-group hide">
                        <label class="inline form-label">输入新邮箱：</label>
                        <div class="inline control-col-pos control-col">
                            <input type="text" id="email" name="email" validate="true" data-rule="['email']"
                                   autocomplete="off" placeholder="不建议使用QQ邮箱" class="form-control inline control-email">
                            <ul class="email-list hide">
                                <li class="last-li"></li>
                                <br>
                            </ul>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="inline form-label">填写验证码：</label>
                        <div class="inline control-col-pos control-col">
                            <input type="text" id="code" name="code" validate="true" data-rule="['code']"
                                   autocomplete="off" class="form-control inline control-code">
                            <button class="btn btn-confirm btn-control">获取验证码</button>
                        </div>
                    </div>
                    <div class="form-group form-group-error">
                        <label class="inline form-label"></label>
                        <div class="text-error hide"></div>
                    </div>
                    <div class="form-group hide">
                        <p class="info-p">如果长时间未收到验证码，请检查垃圾箱</p>
                    </div>
                    <div class="form-group">
                        <div class="form-submit">
                            <label class="inline form-label"></label>
                            <button disabled="disabled" data-type="email" class="btn btn-primary__disabled">
                                下一步
                            </button>
                        </div>
                    </div>
                    <div class="form-group info-other">
                        <label class="inline form-label"></label>
                        <div class="inline control-col-pos control-col">
                            <a class="zl" style="cursor: pointer">通过手机号修改</a>
                        </div>
                    </div>
                </div>
                <div class="info-text hide">
                    <div class="info-status">
                        <label data-v-d2bb5870="" class="icon-coustom-check icon-control">
                            <svg aria-hidden="true" class="icon">
                                <use xlink:href="#csdnc-check"></use>
                            </svg>
                        </label>
                    </div>
                    <span data-v-d2bb5870="">成功修改邮箱</span>
                    <p data-v-d2bb5870="">新邮箱为</p>
                    <button class="btn btn-primary">完成(s)</button>
                </div>
                <div class="line"></div>
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
                        <img src="https://i.csdn.net/static/img/bind_sinat.png" alt="新浪微博" class="icon_img">
                        <span class="method_name">新浪微博</span>
                        <span class="user_name">知其不可奈何而安之若命7</span>
                        <a href="javascript:void(0)" class="handle_text remove_text">解绑</a>
                    </li>
                    <br>
                    <li class="item_cont">
                        <img src="https://i.csdn.net/static/img/bind_linkedin.png" alt="领英" class="icon_img">
                        <span class="method_name">领英</span>
                        <span class="user_name">兆峰</span>
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
                    <li class="item_cont">
                        <img src="https://i.csdn.net/static/img/bind_maimai.png" alt="脉脉" class="icon_img">
                        <span class="method_name">脉脉</span>
                        <span class="user_name">绑账号领勋章</span>
                        <span class="handle_text">绑定</span>
                    </li>
                    <br>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PersonalCenter",
        data() {
            return {
                asideList: [
                    {id: 1, name: "PersonalData", title: "个人资料"},
                    {id: 2, name: "ProjectList", title: "项目列表"},
                    {id: 3, name: "ChangePassword", title: "修改密码"},
                    {id: 4, name: "ModifyPhone", title: "修改手机"},
                    {id: 5, name: "ModifyMailbox", title: "修改邮箱"},
                    {id: 6, name: "BindAccount", title: "绑定账号"},
                ],
                asideIndex: 1,

                token: "",
                username: "",

                oldPassword: "",
                newPassword: "",
                confirmNewPassword: "",
                changePasswordError: "",
            };
        },
        methods: {
            asideClick(itemId) {
                this.asideIndex = itemId;
            },
            changePassword() {
                // 1.校验密码位数
                if (this.oldPassword.length < 6) {
                    this.changePasswordError = "密码位数错误！";
                }
                let changePasswordParam = {
                    username: "",
                    oldPassword: this.oldPassword,
                    newPassword: this.newPassword,
                }
            }
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

    li {
        display: inline-block;
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