import eventBus from "@/utils/eventBus"
import store from '@/store'
export default {
    getDefaultCfg() {
        return {
            keydown: false,
            backKeyCode: 8, // 试图删除一个节点
            deleteKeyCode: 46,
            shiftKeyCode: 16,
            _a: 65,
            _s: 83,
            _y: 89,
            _z: 90
        }
    },
    getEvents() {
        return {
            keyup: 'onKeyUp',
            keydown: 'onKeyDown'
        }
    },

    onKeyDown(e) {
        this.keydown = true
        const code = e.keyCode || e.which
        if (!code)
            return

        if (store.state.app.is_running)
            return
        switch (code) {
            case this.deleteKeyCode:
            case this.backKeyCode:
                if (store.getters.isFocusCanvas) {
                    eventBus.$emit('deleteItem')
                } 
                    
                break
            case this._a:
                if (e.ctrlKey)
                    eventBus.$emit('selectAll')
                break
            case this._s:
                if (e.ctrlKey) {
                    e.preventDefault()
                    eventBus.$emit('save')
                }
                break
            case this._y:
                if (e.ctrlKey)
                    eventBus.$emit('redo')
                break
            case this._z:
                if (e.ctrlKey)
                    eventBus.$emit('undo')
                break
        }
    },
    onKeyUp() {
        this.keydown = false
        if (!store.state.app.is_running)
            store.commit('app/SET_ALLOWSAVE', true)
    }
}
