<template>
    <div class="header" v-if="username">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1">
                <el-link>首页</el-link>
            </el-menu-item>
            <el-menu-item index="2">
                <router-link to="Project">
                    项目中心
                </router-link>
            </el-menu-item>
            <el-submenu index="5" style="float: right">
                <template slot="title">
                    <img class="user-avatar" src="@/assets/images/logo.jpg" alt="avatar"/>
                    <span class="user-avatar-span">{{ username }}</span>
                </template>
                <el-menu-item index="5-1">
                    <i class="iconfont icon-gerenzhongxin"></i>
                    <router-link to="/personal">
                        个人中心
                    </router-link>
                </el-menu-item>
                <el-menu-item index="5-3" @click="logout">
                    <i class="iconfont icon-tuichu"></i>
                    <span>退出</span>
                </el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
    export default {
        name: "Header",
        data() {
            return {
                activeIndex: '2',
                username: localStorage.getItem('username'),
            }
        },
        create() {
            this.getUsername();
        },
        methods: {
            /**
             * 获取 localStorage 中存储的用户名，如果没有获取到，说明当前没有登录用户，则不显示顶部栏
             * @returns {string} 登录用户名
             */
            getUsername() {
                return this.username = localStorage.getItem('username');
            },
            /**
             * 退出当前登录用户，跳转到登录页面
             */
            logout() {
                this.$store.dispatch('user/Logout').then(() => {
                    this.$router.push('/login');
                }).catch(error => {
                    this.$message({
                        message: error,
                        type: 'error',
                    });
                });
                localStorage.removeItem('username');
                location.reload();
            },

            // eslint-disable-next-line no-unused-vars
            handleSelect(key, keyPath) {
                // console.log(key, keyPath);
            },
        }
    }
</script>

<style scoped>
    a {

    }

    .user-avatar {
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 2px solid #2980b9;
    }

    .user-avatar-span {
        font-size: 16px;
        font-family: fantasy;
    }
</style>