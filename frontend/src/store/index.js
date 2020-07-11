import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const getters = {
    token: state => state.user.token,
    username: state => state.user.username,

    isRunning: state => state.project.isRunning,
    isAllowSave: state => state.project.allowSave,
    selectedNodeId: state => state.project.selectedNodeId,
};

const modulesFiles = require.context('./modules', true, /\.js$/);
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
    const value = modulesFiles(modulePath);
    modules[moduleName] = value.default;
    return modules;
}, {});

const store = new Vuex.Store({
    modules,
    getters,
});

export default store