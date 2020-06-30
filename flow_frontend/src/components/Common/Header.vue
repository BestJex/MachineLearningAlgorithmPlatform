<template>
    <div class="header" v-if="header_username">
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
                    <span class="user-avatar-span">{{ header_username }}</span>
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
                header_username: localStorage.getItem('username'),
                activeIndex: '1',
                activeIndex2: '1',
                circleUrl: "@/assets/img/logo.jpg",
            };
        },
        beforeCreate() {
            this.header_username = localStorage.getItem('username');
        },
        methods: {
            handleSelect(key, keyPath) {

            },
            logout() {
                this.$store.dispatch('user/Logout').then(res => {
                    this.$router.push('/login')
                });
                localStorage.removeItem('username');
                localStorage.removeItem('expires');
                location.reload();
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