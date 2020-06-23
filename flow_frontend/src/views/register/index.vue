<template>
    <div class="my-login-page">
        <el-row>
            <el-col :span="24" align="center">
                <div class="container h-100">
                    <div class="row justify-content-md-center h-100">
                        <div class="card-wrapper">
                            <div class="brand">
                                <img src="@/assets/img/logo.jpg" alt="bootstrap 4 login page"/>
                            </div>
                            <div class="card fat">
                                <div class="card-body">
                                    <h2 class="card-title">注册</h2>
                                    <el-form
                                            label-position="left"
                                            :model="formRegister"
                                            :rules="rules"
                                            ref="formRegister"
                                    >
                                        <!-- name -->
                                        <el-form-item label="用户名" prop="username">
                                            <el-input
                                                    v-model="formRegister.username"
                                                    clearable
                                                    prefix-icon="el-icon-user-solid"
                                            ></el-input>
                                        </el-form-item>

                                        <!-- password -->
                                        <el-form-item label="密码" prop="password">
                                            <el-input
                                                    v-model="formRegister.password"
                                                    show-password
                                                    prefix-icon="el-icon-lock"
                                            ></el-input>
                                        </el-form-item>

                                        <!-- checkPassword -->
                                        <el-form-item label="确认密码" prop="checkPassword">
                                            <el-input
                                                    v-model="formRegister.checkPassword"
                                                    show-password
                                                    prefix-icon="el-icon-lock"
                                            ></el-input>
                                        </el-form-item>

                                        <!-- register button -->
                                        <el-form-item>
                                            <el-button
                                                    style="width: 100%; font-weight: bold;"
                                                    type="primary"
                                                    :loading="loading"
                                                    @click="register"
                                            >注&nbsp;&nbsp;&nbsp;&nbsp;册
                                            </el-button>
                                        </el-form-item>

                                        <!-- login -->
                                        <el-form-item>
                                            已经有账户了？
                                            <router-link to="/login">
                                                <el-button type>
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
            </el-col>
        </el-row>
    </div>
</template>
<script type="text/javascript">
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
                formRegister: {
                    username: "",
                    password: "",
                    checkPassword: ""
                },
                rules: {
                    username: [{validator: checkUserName, trigger: "blur"}],
                    password: [{validator: checkPassword, trigger: "blur"}],
                    checkPassword: [{validator: checkPasswordAgain, trigger: "blur"}]
                },
                loading: false
            };
        },
        methods: {
            // 用户注册
            register() {
                let user = this.formRegister;
                let formData = {
                    name: user.name,
                    username: user.username,
                    password: user.password
                };
                // 表单验证
                this.$refs["formRegister"].validate(valid => {
                    if (valid) {
                        this.loading = true;
                        // 通过验证之后才请求登录接口
                        this.$store
                            .dispatch("user/Register", formData)
                            .then(() => {
                                this.loading = false;
                                this.$router.push({path: "/"});
                            })
                            .catch(e => {
                                this.loading = false;
                            });
                    } else {
                        this.$message.error("error submit!!");
                        return false;
                    }
                });
            }
        }
    };
</script>
<style scoped>
    @import "../../assets/css/my-login.css";
</style>