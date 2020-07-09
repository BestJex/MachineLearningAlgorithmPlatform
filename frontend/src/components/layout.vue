<template>
    <div>
        <router-view :key="key"/>
    </div>
</template>

<script>
    export default {
        name: 'layout',
        computed: {
            key() {
                return this.$route.path;
            },
        },
    }
</script>

<style scoped>

</style>