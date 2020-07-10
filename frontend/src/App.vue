<template>
    <div id="app">
        <Header></Header>
        <router-view/>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import webSocket from "@/config/webSocket";
    import Header from "@/components/Currency/Header";

    export default {
        name: 'App',
        components: {
            Header,
        },
        mixins: [webSocket],
        computed: {
            ...mapGetters(['token'])
        },
        created() {
            this.initWebSocket();
        },
        methods: {
            initWebSocket() {
                if (this.token) {
                    webSocket.initWebSocket();
                }
            }
        }
    }
</script>

<style>

</style>
