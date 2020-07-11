<template>
    <div class="my-retrieve-page">
        <div class="container h-100">
            <div class="row justify-content-md-center h-100">
                <div class="card-wrapper">
                    <div class="brand">
                        <img src="@/assets/images/logo.jpg" alt="logo"/>
                    </div>
                    <div class="card fat">
                        <el-form :model="formRetrievePassword">
                            <h2 class="card-title">Retrieve Password</h2>
                            <!-- username -->
                            <el-form-item label="用户名" prop="username">
                                <el-input v-model="formRetrievePassword.username"
                                          clearable
                                          prefix-icon="el-icon-user-solid"
                                          style="width: 80%; float: right"></el-input>
                            </el-form-item>
                            <!-- phone -->
                            <el-form-item label="手机号" prop="phone">
                                <el-input v-model="formRetrievePassword.phone"
                                          clearable
                                          prefix-icon="el-icon-user-solid"
                                          style="width: 80%; float: right"></el-input>
                            </el-form-item>
                            <!-- password -->
                            <el-form-item label="新密码" prop="password">
                                <el-input style="display: inline-block; width: 80%; float: right"
                                          v-model="formRetrievePassword.password"
                                          show-password
                                          prefix-icon="el-icon-lock"></el-input>
                            </el-form-item>
                            <!-- checkPassword -->
                            <el-form-item label="确认密码" prop="checkPassword">
                                <el-input style="display: inline-block; width: 80%; float: right"
                                          v-model="formRetrievePassword.checkPassword"
                                          show-password
                                          prefix-icon="el-icon-lock"></el-input>
                            </el-form-item>
                            <!-- Verification Code -->
                            <el-form-item label="验证码" prop="VerificationCode">
                                <el-input v-model="formRetrievePassword.code"
                                          prefix-icon="el-icon-picture-outline-round"
                                          style="width: 40%; float: left; margin-left: 22px"></el-input>
                                <img :src="base64CodeVerificationCode"
                                     alt="VerificationCode"
                                     @click="getCaptcha()"
                                     style="margin-left: 20px">
                            </el-form-item>
                            <!-- 验证手机号 button -->
                            <el-form-item>
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
    </div>
</template>

<script>
    import userApi from "@/api/user";

    export default {
        name: "Retrieve",
        data() {
            return {
                loading: false,
                base64CodeVerificationCode: '',
                formRetrievePassword: {
                    username: "",
                    phone: "",
                    password: "",
                    checkPassword: "",
                    code: "",
                },
            }
        },
        created() {
            this.getCaptcha();
        },
        methods: {
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
            changePassword() {
                let userRetrievePassword = this.formRetrievePassword;
                let formData = {
                    username: userRetrievePassword.username,
                    phone: userRetrievePassword.phone,
                    password: userRetrievePassword.password,
                    checkPassword: userRetrievePassword.checkPassword,
                    code: userRetrievePassword.code,
                    access_token: this.access_token,
                };
                this.$refs["formRegister"].validate(valid => {
                    if (valid) {
                        this.loading = true;
                        this.$store.dispatch("user/Register", formData).then(() => {
                            localStorage.setItem("username", formData.username);
                            this.loading = false;
                            this.$router.push({path: "/"});
                            // eslint-disable-next-line no-unused-vars
                        }).catch(e => {
                            this.loading = false;
                        });
                    } else {
                        this.$message.error("error submit!!");
                        return false;
                    }
                });
            },
        }
    }
</script>

<style scoped>
    .my-retrieve-page {
        height: 100%;
        font-size: 14px;
    }

    .my-retrieve-page .brand {
        width: 90px;
        height: 90px;
        overflow: hidden;
        border-radius: 50%;
        margin: 40px auto;
        box-shadow: 0 4px 8px rgba(0, 0, 0, .05);
        position: relative;
        z-index: 1;
    }

    .my-retrieve-page .brand img {
        width: 100%;
    }

    .my-retrieve-page .card-wrapper {
        width: 400px;
        margin: 0 auto;
    }

    .my-retrieve-page .card {
        border-color: transparent;
        box-shadow: 0 4px 8px rgba(0, 0, 0, .05);
    }

    .my-retrieve-page .card.fat {
        padding: 10px;
    }

    .my-retrieve-page .card .card-title {
        text-align: left;
        margin-bottom: 30px;
    }

    .my-retrieve-page .footer {
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