class Node extends Object {
    constructor(params) {
        super()
        this.id = params.id;
        this.label = params.label;
        this.size = [170, 34];
        this.parent = params.parent;    // 所属组
        this.index = params.index;      // 渲染层级
        for (let key in params) {
            this[key] = params[key] || 0;
        }
    }
}

export default Node;