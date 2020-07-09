<template>
    <div class="header" v-if="username">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="2">
                <el-link href="#">首页</el-link>
            </el-menu-item>
            <el-menu-item index="1">
                <el-link href="/flow/#/project">项目中心</el-link>
            </el-menu-item>
            <el-submenu index="5" style="float: right">
                <template slot="title">
                    <img class="user-avatar" src="@/assets/images/logo.jpg" alt="avatar"/>
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
        </el-menu>
    </div>
</template>

<script>
    export default {
        name: "Header",
        data(){
            return {
                username: 'Alex',
                activeIndex: '1',
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
                // return this.username = localStorage.getItem('username');
                return 'Alex';
            },
        }
    }
</script>

<style scoped>

</style>