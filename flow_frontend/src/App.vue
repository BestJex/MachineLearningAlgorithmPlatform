<template>
    <div id="app">
        <Header></Header>
        <router-view/>
    </div>
</template>

<script>
    import ResizeMixin from './mixin/ResizeHandler'
    import {mapGetters} from 'vuex';
    import Header from "@/components/Common/Header";

    export default {
        name: 'app',
        components: {
            Header,
        },
        mixins: [ResizeMixin],
        computed: {
            ...mapGetters(['token'])
        },
    }
</script>

<style>
    html, body, #app {
        font-family: sans-serif, Helvetica, Arial;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        /* text-align: center; */
        color: #2c3e50;
        line-height: 1.5;
        font-size: 15px;
        max-height: 100vh;
		overflow: hidden;
        margin: 0;
        /* margin-top: 60px; */
    }
</style>
