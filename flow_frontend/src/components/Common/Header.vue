<template>
    <div class="header" v-if="localStorage.getItem('username')">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
            <el-menu-item index="2">
                <el-link href="#">首页</el-link>
            </el-menu-item>
            <el-menu-item index="1">
                <el-link href="/flow/#/project">项目中心</el-link>
            </el-menu-item>
            <el-submenu index="5" style="float: right">
                <template slot="title">
                    <img class="user-avatar" src="@/assets/img/logo.jpg" alt="avatar"/>
                    <span class="user-avatar-span">{{ localStorage.getItem('username') }}</span>
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
    import {mapGetters} from "vuex";

    export default {
        name: "Header",
        data() {
            return {
                activeIndex: '1',
            };
        },
        methods: {
            logout() {
                this.$store.dispatch('user/Logout').then(res => {
                    this.$router.push('/login')
                });
                localStorage.removeItem('username');
                location.reload();
            }
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