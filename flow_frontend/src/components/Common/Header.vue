<template>
    <div class="header">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="2">
                <el-link href="#">首页</el-link>
            </el-menu-item>
            <el-menu-item index="1">
                <el-link href="/flow/#/project">项目中心</el-link>
            </el-menu-item>
            <el-submenu index="5" style="float: right">
                <template slot="title">
                    <img class="user-avatar" src="@/assets/img/logo.jpg" alt="avatar"/>
                    <span class="user-avatar-span">{{ username }}</span>
                </template>
                <el-menu-item index="5-1">
                    <i class="iconfont icon-gerenzhongxin"></i>
                    <el-link href="/flow/#/personal/7">个人中心</el-link>
                </el-menu-item>
                <el-menu-item index="5-3" @click="logout">
                    <i class="iconfont icon-tuichu"></i>
                    <span>退出</span>
                </el-menu-item>
            </el-submenu>
            <el-submenu index="4" style="float: right">
                <template slot="title">
                    <svg width="24" height="24" viewBox="0 0 24 24"
                         class="ant-dropdown-trigger Header-module--translation--Px2mu">
                        <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"></path>
                    </svg>
                </template>
                <el-menu-item index="4-1">简体中文</el-menu-item>
                <el-menu-item index="4-2">繁体中文</el-menu-item>
                <el-menu-item index="4-3">English</el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: "Header",
        data() {
            return {
                activeIndex: '1',
                activeIndex2: '1',
                circleUrl: "@/assets/img/logo.jpg",
            };
        },
        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            },
            logout() {
                this.$store.dispatch('user/Logout').then(res => {
                    this.$router.push('/login')
                })
            }
        },
        computed: {
            ...mapGetters(['token', 'username'])
        },
    }
</script>

<style scoped>
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