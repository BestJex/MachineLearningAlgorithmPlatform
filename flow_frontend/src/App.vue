<template>
    <div id="app">
        <Header></Header>
        <router-view/>
    </div>
</template>

<script>
    import ResizeMixin from './mixin/ResizeHandler'
    import WebSocket from './mixin/socket'
    import {mapGetters} from 'vuex';
    import Header from "@/components/Common/Header";

    export default {
        name: 'app',
        components: {
            Header,
        },
        mixins: [ResizeMixin, WebSocket],
        computed: {
            ...mapGetters(['token'])
        },
        created() {
            if (this.token) {
                WebSocket.initWebSocket();
            }
        }
    }
</script>

<style>
    /* html, body {
        overflow: hidden;
        margin: 0;
        font-size: 12px;
    } */
    html,
    body,
    #app {
        font-family: sans-serif, Helvetica, Arial;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        /* text-align: center; */
        color: #2c3e50;
        line-height: 1.5;
        font-size: 15px;
        height: 100%;
        width: 100%;
        margin: 0;
        /* margin-top: 60px; */
    }
</style>
