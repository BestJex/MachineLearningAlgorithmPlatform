// import projectApi from "@/api/project";

const state = {
    maxId: 0,
    allowSave: true,
    isRunning: false,
    selectedNodeId: null,
}

const mutations = {
    SetMaxId: (state, maxId) => {
        state.maxId = maxId;
    },
    SetAllowSave: (state, allowSave) => {
        state.allowSave = allowSave;
    },
    SetIsRunning: (state, isRunning) => {
        state.isRunning = isRunning;
    },
    SetSelectedNodeId: (state, selectedNodeId) => {
        state.selectedNodeId = selectedNodeId;
    },
}

const actions = {
    uniqueId({ commit }) {
        return new Promise(resolve => {
            commit('SetMaxId', state.maxId + 1)
            resolve(state.maxId + 1)
        });
    },
}

export default {
    state,
    actions,
    mutations,
    namespaced: true,
}