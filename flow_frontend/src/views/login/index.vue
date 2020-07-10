<template>
    <div class="my-login-page">
        <el-row>
            <el-col :span="24" align="center">
                <div class="container h-100">
                    <div class="row justify-content-md-center h-100">
                        <div class="card-wrapper">
                            <div class="brand">
                                <img src="@/assets/img/logo.jpg" alt="logo"/>
                            </div>
                            <div class="card fat">
                                <el-form :model="formLogin" :rules="rules" ref="formLogin" v-if="!isRetrievePassword">
                                    <h2 class="card-title">Login</h2>

                                    <!-- username -->
                                    <el-form-item label="用户名" prop="username">
                                        <el-input @keyup.native.enter="login"
                                                  v-model="formLogin.username" clearable
                                                  prefix-icon="el-icon-user-solid"
                                                  style="width: 80%; float: right"></el-input>
                                    </el-form-item>

                                    <!-- password -->
                                    <el-form-item label="密码" prop="password">
                                        <el-input @keyup.native.enter="login"
                                                  v-model="formLogin.password" show-password
                                                  prefix-icon="el-icon-lock"
                                                  style="width: 80%; float: right">
                                            <template slot="append">
                                                <el-button @click="retrievePassword()">
                                                    找回密码
                                                </el-button>
                                            </template>
                                        </el-input>
                                    </el-form-item>

                                    <!-- Verification Code -->
                                    <el-form-item label="验证码" prop="VerificationCode">
                                        <el-input @keyup.native.enter="login"
                                                  v-model="formLogin.code"
                                                  prefix-icon="el-icon-picture-outline-round"
                                                  style="width: 40%; float: left; margin-left: 22px"></el-input>
                                        <img :src="base64CodeVerificationCode" alt="" @click="changeVerificationCode()">
                                    </el-form-item>

                                    <!-- login button -->
                                    <el-form-item>
                                        <el-button
                                                style="width: 100%; font-weight: bold;"
                                                type="primary"
                                                :loading="loading"
                                                @click="login">
                                            登&nbsp;&nbsp;&nbsp;&nbsp;录
                                        </el-button>
                                    </el-form-item>

                                    <!-- register -->
                                    <el-form-item>
                                        还没有账户?
                                        <router-link to="/register">
                                            <el-button type>
                                                注 册
                                                <i class="el-icon-arrow-right el-icon--right"></i>
                                            </el-button>
                                        </router-link>
                                    </el-form-item>
                                </el-form>

                                <el-form :model="formRetrievePassword" v-if="isRetrievePassword">
                                    <h2 class="card-title">Retrieve Password</h2>

                                    <!-- username -->
                                    <el-form-item label="用户名" prop="username" v-if="!isVerifyPhoneNumber">
                                        <el-input v-model="formRetrievePassword.username" clearable
                                                  prefix-icon="el-icon-user-solid"
                                                  style="width: 80%; float: right"></el-input>
                                    </el-form-item>

                                    <!-- phone -->
                                    <el-form-item label="手机号" prop="phone" v-if="!isVerifyPhoneNumber">
                                        <el-input v-model="formRetrievePassword.phone" clearable
                                                  prefix-icon="el-icon-user-solid"
                                                  style="width: 80%; float: right"></el-input>
                                    </el-form-item>

                                    <!-- password -->
                                    <el-form-item label="新密码" prop="password" v-if="!isVerifyPhoneNumber">
                                        <el-input style="display: inline-block; width: 80%; float: right"
                                                  v-model="formRetrievePassword.password"
                                                  show-password
                                                  prefix-icon="el-icon-lock"></el-input>
                                    </el-form-item>

                                    <!-- checkPassword -->
                                    <el-form-item label="确认密码" prop="checkPassword" v-if="!isVerifyPhoneNumber">
                                        <el-input style="display: inline-block; width: 80%; float: right"
                                                  v-model="formRetrievePassword.checkPassword"
                                                  show-password
                                                  prefix-icon="el-icon-lock"></el-input>
                                    </el-form-item>

                                    <!-- Verification Code -->
                                    <el-form-item label="验证码" prop="VerificationCode" v-if="!isVerifyPhoneNumber">
                                        <el-input v-model="formRetrievePassword.code"
                                                  prefix-icon="el-icon-picture-outline-round"
                                                  style="width: 40%; float: left; margin-left: 22px"></el-input>
                                        <img :src="base64CodeVerificationCode" alt="" @click="getCaptcha()">
                                    </el-form-item>

                                    <!-- 验证手机号 button -->
                                    <el-form-item v-if="!isVerifyPhoneNumber">
                                        <el-button
                                                style="width: 100%; font-weight: bold;"
                                                type="primary"
                                                :loading="loading"
                                                @click="changePassword()">
                                            更改密码
                                        </el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <div class="footer">Copyright &copy; 2020 &mdash; NKAI</div>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        data() {
            let checkUserName = (rule, value, cb) => {
                if (!value) {
                    return cb(new Error("用户名不能为空！"));
                } else {
                    cb();
                }
            };
            let checkPassword = (rule, value, cb) => {
                if (!value) {
                    return cb(new Error("密码不能为空！"));
                } else {
                    cb();
                }
            };
            let checkVerificationCode = (rule, value, cb) => {
                if (!value) {
                    return cb(new Error("验证码不能为空！"));
                } else if (this.formLogin.code !== this.rightVerificationCode) {
                    return cb(new Error("验证码不正确！"));
                } else {
                    cb();
                }
            };
            return {
                isRetrievePassword: false,
                isVerifyPhoneNumber: false,
                phoneNumber: '',
                access_token: '',
                rightVerificationCode: '',
                base64CodeVerificationCode: '',
                formLogin: {
                    username: "",
                    password: "",
                    code: "",
                    checked: false,

                    redirect: undefined,
                    otherQuery: {}
                },
                formRetrievePassword: {
                    username: "",
                    phone: "",
                    password: "",
                    checkPassword: "",
                    code: "",
                },
                rules: {
                    username: [{validator: checkUserName, trigger: "blur"}],
                    password: [{validator: checkPassword, trigger: "blur"}],
                    code: [{validator: checkVerificationCode, trigger: "blur"}],
                },
                loading: false,
            };
        },
        watch: {
            $route: {
                handler: function (route) {
                    const query = route.query
                    if (query) {
                        this.redirect = query.redirect
                        this.otherQuery = this.getOtherQuery(query)
                    }
                },
                immediate: true
            }
        },
        methods: {
            changePassword() {
                this.isVerifyPhoneNumber = true;
                let userRetrievePassword = this.formRetrievePassword;
                let formData = {
                    username: userRetrievePassword.username,
                    phone: userRetrievePassword.phone,
                    password: userRetrievePassword.password,
                    checkPassword: userRetrievePassword.checkPassword,
                    code: userRetrievePassword.code,
                    access_token: this.access_token,
                };
                console.log(formData);
                this.axios({
                    method: 'post',
                    url: 'http://39.105.21.62/flow/api/user/chapassword',
                    data: formData,
                }).then(res => {
                    alert(res);
                    location.reload();
                }).catch(err => {
                    this.$message({
                        message: err,
                        type: 'error'
                    });
                })
            },
            retrievePassword() {
                this.isRetrievePassword = true;
            },

            // 向登录接口发起请求
            login: function () {
                let user = this.formLogin;
                let formData = {
                    username: user.username,
                    password: user.password,
                    code: user.code,
                    access_token: this.access_token,
                };
                // 表单验证
                this.$refs["formLogin"].validate(valid => {
                    if (valid) {
                        this.loading = true;
                        // 通过验证之后才请求登录接口
                        this.$store
                            .dispatch("user/Login", formData)
                            .then(() => {
                                let expires = (new Date().getTime() + 3 * 24 * 60 * 60 * 1000);
                                localStorage.setItem("username", user.username);
                                localStorage.setItem("expires", expires.toString());
                                this.loading = false;
                                this.$router.push({path: '/project'});
                                location.reload();
                            })
                            .catch(e => {
                                this.loading = false;
                            });
                    } else {
                        this.$message.error("error submit!");
                        return false;
                    }
                });
            },
            getOtherQuery(query) {
                return Object.keys(query).reduce((acc, cur) => {
                    if (cur !== 'redirect') {
                        acc[cur] = query[cur]
                    }
                    return acc
                }, {})
            },
            getCaptcha() {
                this.axios({
                    method: 'get',
                    url: `http://39.105.21.62/flow/api/user/captcha?access_token=${new Date().getTime()}`,
                }).then(res => {
                    this.access_token = res.data.data.access_token;
                    this.rightVerificationCode = res.data.data.rightCode;
                    this.base64CodeVerificationCode = `data:image/png;base64,${res.data.data.img}`;
                }).catch(err => {
                    this.$message({
                        message: err,
                        type: 'error'
                    });
                })
            },
        },
        created() {
            this.getCaptcha();
            localStorage.removeItem('username');
            localStorage.removeItem('expires');
        }
    };
</script>

<style scoped>
    @import "../../assets/css/my-login.css";
</style>