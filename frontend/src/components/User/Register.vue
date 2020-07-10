<template>
    <div class="my-register-page">
        <div class="container h-100">
            <div class="row justify-content-md-center h-100">
                <div class="card-wrapper">
                    <div class="brand">
                        <img src="@/assets/images/logo.jpg" alt="bootstrap 4 login page"/>
                    </div>
                    <div class="card fat">
                        <div class="card-body">
                            <h2 class="card-title">注册</h2>
                            <el-form
                                    label-position="left"
                                    :model="formRegister"
                                    :rules="rules"
                                    ref="formRegister">
                                <!-- name -->
                                <el-form-item label="用户名" prop="username">
                                    <el-input style="display: inline-block; width: 80%; float: right"
                                              v-model="formRegister.username"
                                              clearable
                                              prefix-icon="el-icon-user-solid"></el-input>
                                </el-form-item>
                                <!-- password -->
                                <el-form-item label="密码" prop="password">
                                    <el-input style="display: inline-block; width: 80%; float: right"
                                              v-model="formRegister.password"
                                              show-password
                                              prefix-icon="el-icon-lock"></el-input>
                                </el-form-item>
                                <!-- checkPassword -->
                                <el-form-item label="确认密码" prop="checkPassword">
                                    <el-input style="display: inline-block; width: 80%; float: right"
                                              v-model="formRegister.checkPassword"
                                              show-password
                                              prefix-icon="el-icon-lock"></el-input>
                                </el-form-item>
                                <!-- Invitation Code -->
                                <el-form-item label="邀请码" prop="checkPassword">
                                    <el-input style="display: inline-block; width: 80%; float: right"
                                              v-model="formRegister.invitationCode"
                                              clearable
                                              prefix-icon="el-icon-ice-cream-square"></el-input>
                                </el-form-item>
                                <!-- register button -->
                                <el-form-item>
                                    <el-button
                                            style="width: 100%; font-weight: bold;"
                                            type="primary"
                                            :loading="loading"
                                            @click="register">
                                        注&nbsp;&nbsp;&nbsp;&nbsp;册
                                    </el-button>
                                </el-form-item>
                                <!-- login -->
                                <el-form-item style="margin-left: 30%">
                                    已经有账户了？
                                    <router-link to="/login">
                                        <el-button>
                                            登 录
                                            <i class="el-icon-arrow-right el-icon--right"></i>
                                        </el-button>
                                    </router-link>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                    <div class="footer">Copyright &copy; 2019 &mdash; RKS</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Register",
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
                } else if (value.length < 6) {
                    return cb(new Error("密码不能小于6位数！"));
                } else {
                    cb();
                }
            };
            let checkPasswordAgain = (rule, value, cb) => {
                if (!value) {
                    return cb(new Error("密码不能为空！"));
                } else if (value !== this.formRegister.password) {
                    return cb(new Error("密码不匹配！"));
                } else if (value.length < 6) {
                    return cb(new Error("密码不能小于6位数！"));
                } else {
                    cb();
                }
            };
            return {
                loading: false,
                formRegister: {
                    username: "",
                    password: "",
                    checkPassword: "",
                    invitationCode: "",
                },
                rules: {
                    username: [{validator: checkUserName, trigger: "blur"}],
                    password: [{validator: checkPassword, trigger: "blur"}],
                    checkPassword: [{validator: checkPasswordAgain, trigger: "blur"}]
                },
            };
        },
        methods: {
            // 用户注册
            register() {
                let user = this.formRegister;
                let formData = {
                    name: user.name,
                    username: user.username,
                    password: user.password,
                    invitcode: user.invitationCode,
                };
                // 表单验证
                this.$refs["formRegister"].validate(valid => {
                    if (valid) {
                        this.loading = true;
                        // 通过验证之后才请求登录接口
                        this.$store.dispatch("user/Register", formData).then(() => {
                                localStorage.setItem("username", formData.username);
                                this.loading = false;
                                this.$router.push({path: "/"});
                            })
                            // eslint-disable-next-line no-unused-vars
                            .catch(e => {
                                this.loading = false;
                            });
                    } else {
                        this.$message.error("error submit!!");
                        return false;
                    }
                });
            }
        },
    }
</script>

<style scoped>
    .my-register-page {
        height: 100%;
        font-size: 14px;
    }

    .my-register-page .brand {
        width: 90px;
        height: 90px;
        overflow: hidden;
        border-radius: 50%;
        margin: 40px auto;
        box-shadow: 0 4px 8px rgba(0, 0, 0, .05);
        position: relative;
        z-index: 1;
    }

    .my-register-page .brand img {
        width: 100%;
    }

    .my-register-page .card-wrapper {
        width: 400px;
        margin: 0 auto;
    }

    .my-register-page .card {
        border-color: transparent;
        box-shadow: 0 4px 8px rgba(0, 0, 0, .05);
    }

    .my-register-page .card.fat {
        padding: 10px;
    }

    .my-register-page .card .card-title {
        text-align: left;
        margin-bottom: 30px;
    }

    .my-register-page .footer {
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