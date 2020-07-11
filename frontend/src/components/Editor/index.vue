<template>
    <div id="mountNode" style="display: block;">
        <div class="editor">
            <Toolbar/>
            <div class="bottom-container">
                <Tree/>
                <DetailPanel/>
                <MiniMap/>
            </div>
        </div>
<!--        <Flow/>-->
    </div>
</template>

<script>
    import Tree from "@/components/Editor/components/Tree/index";
    import Toolbar from "@/components/Editor/components/Toolbar/index";
    import DetailPanel from "@/components/Editor/components/DetailPanel/index";
    import MiniMap from "@/components/Editor/components/DetailPanel/components/miniMap";

    export default {
        name: "index",
        components: {
            Toolbar,
            Tree,
            DetailPanel,
            MiniMap,
        },
    }
</script>

<style scoped>
    .editor {
        position: relative;
        width: 100%;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }

    .bottom-container {
        position: relative;
    }
</style>