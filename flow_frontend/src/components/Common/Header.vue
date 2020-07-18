<template>
	<div class="header" v-if="graphName">
		<el-menu :default-active="graphActiveIndex" class="el-menu-demo" mode="horizontal">
			<el-button
				type="info"
				icon="el-icon-back"
				circle
				size="medium"
				style="margin-top: 12px; margin-left: 10px; float: left"
				@click="backProject()"></el-button>
			<el-menu-item>
				<h1 style="margin: 0 10px; color: #3a8ee6">{{ graphName }}</h1>
			</el-menu-item>
			<el-submenu
				index=""
				style="float: right">
				<template slot="title">
					<img
						class="user-avatar"
						src="@/assets/img/logo.jpg"
						alt="avatar"/>
				</template>
				<el-menu-item
					index=""
					@click="jumpPersonal()">
					<i class="iconfont icon-gerenzhongxin"></i>
					<span>个人中心</span>
				</el-menu-item>
				<el-menu-item
					index=""
					@click="logout">
					<i class="iconfont icon-tuichu"></i>
					<span>退出</span>
				</el-menu-item>
			</el-submenu>
		</el-menu>
	</div>
	<div class="header" v-else-if="username">
		<el-menu
			:default-active="activeIndex"
			class="el-menu-demo"
			mode="horizontal">
			<el-menu-item index="2">
				<el-link href="#">首页</el-link>
			</el-menu-item>
			<el-menu-item index="1">
				<el-link href="/flow/#/project">项目中心</el-link>
			</el-menu-item>
			<el-submenu
				index="5"
				style="float: right">
				<template slot="title">
					<img
						class="user-avatar"
						src="@/assets/img/logo.jpg"
						alt="avatar"/>
					<span class="user-avatar-span">{{ username }}</span>
				</template>
				<el-menu-item
					index="5-1"
					@click="jumpPersonal()">
					<i class="iconfont icon-gerenzhongxin"></i>
					<span>个人中心</span>
				</el-menu-item>
				<el-menu-item
					index="5-3"
					@click="logout">
					<i class="iconfont icon-tuichu"></i>
					<span>退出</span>
				</el-menu-item>
			</el-submenu>
		</el-menu>
	</div>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: 'Header',
        data() {
            return {
                activeIndex: '1',
                graphActiveIndex: '1',
            }
        },
        computed: {
            ...mapGetters(['token', 'username', 'userId', 'graphName'])
        },
        methods: {
            backProject() {
                this.$router.push('/project')
            },
            jumpPersonal() {
                this.$router.push({ path: `/personal/${localStorage.getItem('userId')}` })
            },
            logout() {
                this.$store.dispatch('user/Logout').then(() => {
                    this.$router.push('/login')
                })
            }
        }
    }
</script>

<style scoped>
	.header {
		height: 60px;
	}

	.user-avatar {
		width: 40px;
		height: 40px;
		cursor: pointer;
		margin-top: 10px;
		margin-right: 15px;
		border-radius: 50%;
		border: 2px solid #2980b9;
	}

	.user-avatar-span {
		font-size: 20px;
		font-family: fantasy;
	}
</style>