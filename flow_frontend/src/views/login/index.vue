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
                                <el-form :model="formLogin" :rules="rules" ref="formLogin">
                                    <h2 class="card-title">Login</h2>

                                    <!-- username -->
                                    <el-form-item label="用户名" prop="username">
                                        <el-input @keyup.native.enter="login" v-model="formLogin.username" clearable
                                                  prefix-icon="el-icon-user-solid"></el-input>
                                    </el-form-item>

                                    <!-- password -->
                                    <el-form-item label="密码" prop="password">
                                        <el-input @keyup.native.enter="login" v-model="formLogin.password" show-password
                                                  prefix-icon="el-icon-lock"></el-input>
                                    </el-form-item>

                                    <!-- remember -->
                                    <!-- <el-form-item>
                                      <el-checkbox style="float: left;" :v-model="formLogin.checked">Remember Me</el-checkbox>
                                    </el-form-item> -->

                                    <!-- login button -->
                                    <el-form-item>
                                        <el-button
                                                style="width: 100%; font-weight: bold;"
                                                type="primary"
                                                :loading="loading"
                                                @click="login"
                                        >登&nbsp;&nbsp;&nbsp;&nbsp;录
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
                            </div>

                            <div class="footer">Copyright &copy; 2019 &mdash; RKS</div>
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
                    cb(); // 将判断传递给后面
                }
            };
            let checkPassword = (rule, value, cb) => {
                if (!value) {
                    return cb(new Error("密码不能为空！"));
                } else {
                    cb();
                }
            };
            return {
                formLogin: {
                    username: "",
                    password: "",
                    checked: false,

                    redirect: undefined,
                    otherQuery: {}
                },
                rules: {
                    username: [{validator: checkUserName, trigger: "blur"}],
                    password: [{validator: checkPassword, trigger: "blur"}]
                },
                loading: false
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
            // 向登录接口发起请求
            login() {
                let user = this.formLogin;
                let formData = {
                    username: user.username,
                    password: user.password
                };
                // 表单验证
                this.$refs["formLogin"].validate(valid => {
                    if (valid) {
                        this.loading = true;
                        // 通过验证之后才请求登录接口
                        this.$store
                            .dispatch("user/Login", formData)
                            .then(() => {
                                localStorage.setItem("username", user.username);
                                this.loading = false;
                                this.$router.push({path: this.redirect || '/', query: this.otherQuery});
                            })
                            .catch(e => {
                                this.loading = false;
                            });
                    } else {
                        this.$message.error("error submit!!");
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
            }
        }
    };
</script>

<style scoped>
    @import "../../assets/css/my-login.css";
</style>