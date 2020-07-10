<template>
    <div class="my-login-page">
        <div class="container h-100">
            <div class="row justify-content-md-center h-100">
                <div class="card-wrapper">
                    <div class="brand">
                        <img src="@/assets/images/logo.jpg" alt="logo"/>
                    </div>
                    <div class="card fat">
                        <el-form :model="formLogin" :rules="rules" ref="formLogin">
                            <h2 class="card-title">Login</h2>
                            <!-- username -->
                            <el-form-item label="用户名" prop="username">
                                <el-input @keyup.native.enter="login"
                                          v-model="formLogin.username"
                                          clearable
                                          prefix-icon="el-icon-user-solid"
                                          style="width: 80%; float: right"></el-input>
                            </el-form-item>
                            <!-- password -->
                            <el-form-item label="密码" prop="password">
                                <el-input @keyup.native.enter="login"
                                          v-model="formLogin.password"
                                          show-password
                                          prefix-icon="el-icon-lock"
                                          style="width: 80%; float: right">
                                    <template slot="append">
                                        <router-link to="/retrieve">
                                            <el-button>
                                                找回密码
                                            </el-button>
                                        </router-link>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <!-- Verification Code -->
                            <el-form-item label="验证码" prop="VerificationCode">
                                <el-input @keyup.native.enter="login"
                                          v-model="formLogin.code"
                                          prefix-icon="el-icon-picture-outline-round"
                                          style="width: 40%; float: left; margin-left: 22px"></el-input>
                                <img :src="base64CodeVerificationCode"
                                     @click="changeVerificationCode()"
                                     alt="VerificationCode"
                                     style="margin-left: 20px">
                            </el-form-item>
                            <!-- login button -->
                            <el-form-item>
                                <el-button
                                        style="width: 100%; font-weight: bold;"
                                        type="primary"
                                        :loading="loading"
                                        @click="login()">
                                    登&nbsp;&nbsp;&nbsp;&nbsp;录
                                </el-button>
                            </el-form-item>
                            <!-- register -->
                            <el-form-item style="margin-left: 30%">
                                还没有账户?
                                <router-link to="/register">
                                    <el-button>
                                        注 册
                                        <i class="el-icon-arrow-right el-icon--right"></i>
                                    </el-button>
                                </router-link>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="footer">Copyright &copy; 2020 &mdash; NKAI</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import userApi from "@/api/user";

    export default {
        name: "Login",
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
                loading: false,
                access_token: '',
                rightVerificationCode: '',
                base64CodeVerificationCode: '',
                formLogin: {
                    code: "",
                    username: "",
                    password: "",
                    checked: false,
                    otherQuery: {},
                    redirect: undefined,
                },
                rules: {
                    username: [{validator: checkUserName, trigger: "blur"}],
                    password: [{validator: checkPassword, trigger: "blur"}],
                    code: [{validator: checkVerificationCode, trigger: "blur"}],
                },
            };
        },
        watch: {
            $route: {
                handler: function (route) {
                    const query = route.query;
                    if (query) {
                        this.redirect = query.redirect;
                        this.otherQuery = this.getOtherQuery(query);
                    }
                },
                immediate: true,
            }
        },
        created() {
            this.initLogin();
        },
        methods: {
            initLogin() {
                localStorage.removeItem('username');
                this.getCaptcha();
            },
            getCaptcha() {
                userApi.captcha({access_token: new Date().getTime()}).then(response => {
                    this.access_token = response.data.access_token;
                    this.rightVerificationCode = response.data.rightCode;
                    this.base64CodeVerificationCode = `data:image/png;base64,${response.data.img}`;
                }).catch(error => {
                    this.$message({
                        message: error,
                        type: 'error',
                    });
                });
            },
            changeVerificationCode() {
                this.getCaptcha();
            },
            login() {
                let user = this.formLogin;
                let formData = {
                    code: user.code,
                    username: user.username,
                    password: user.password,
                    access_token: this.access_token,
                };
                this.$refs["formLogin"].validate(valid => {
                    if (valid) {
                        this.loading = true;
                        this.$store.dispatch("user/Login", formData).then(() => {
                            this.loading = false;
                            this.$router.push({path: '/project'});
                            localStorage.setItem("username", user.username);
                            location.reload();
                        }).catch(error => {
                            console.log("Login: ", error);
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
                        acc[cur] = query[cur];
                    }
                    return acc;
                }, {})
            },
        },
    }
</script>

<style scoped>
    .my-login-page {
        height: 100%;
        font-size: 14px;
    }

    .my-login-page .brand {
        width: 90px;
        height: 90px;
        overflow: hidden;
        border-radius: 50%;
        margin: 40px auto;
        box-shadow: 0 4px 8px rgba(0, 0, 0, .05);
        position: relative;
        z-index: 1;
    }

    .my-login-page .brand img {
        width: 100%;
    }

    .my-login-page .card-wrapper {
        width: 400px;
        margin: 0 auto;
    }

    .my-login-page .card {
        border-color: transparent;
        box-shadow: 0 4px 8px rgba(0, 0, 0, .05);
    }

    .my-login-page .card.fat {
        padding: 10px;
    }

    .my-login-page .card .card-title {
        text-align: left;
        margin-bottom: 30px;
    }

    .my-login-page .footer {
        margin: 40px 0;
        color: #888;
        text-align: center;
    }

    .footer {
        position: fixed;
        bottom: 0;
        left: 42%;
    }
</style>