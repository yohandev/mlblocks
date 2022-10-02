import Node from "./node"

export default class NodeMultiply extends Node {
    constructor(node, graph) {
        super(node, graph)
        this.ui.div.find('input')[0].oninput = () => this.refresh()
    }
    
    uicontents() {
        return `
        <img class="node-tail" src="./tail.svg" height="100"/>
        <div class="node-content">
            multiply
            <div class="node-preview">
                <canvas width="28" height="28" />
            </div>
            <div class="node-input">
                <input type="text" value="1.0">
            </div>
        </div>
        <img class="node-head" src="./head.svg" height="100"/>
        `
    }

    refresh() {
        if (this.prev) {
            let mult = this.ui.div.find('input')[0].value

            console.log(mult)
            this.ui.img.drawImage(this.prev.ui.img.canvas, 0, 0)
            let buf = this.ui.img.getImageData(0, 0, 28, 28)
            for (let i = 0; i < buf.data.length; i += 4) {
                buf.data[i + 0] *= +mult
                buf.data[i + 1] *= +mult
                buf.data[i + 2] *= +mult
            }
            this.ui.img.putImageData(buf, 0, 0)
        } else {
            super.refresh()
        }
        this.next?.refresh()
    }
}