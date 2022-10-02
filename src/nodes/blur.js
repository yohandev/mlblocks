import Node from "./node"

export default class NodeBlur extends Node {
    uicontents() {
        return `
        <img class="node-tail" src="./tail.svg" height="100"/>
        <div class="node-content">
            blur&nbsp;&nbsp;
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
            this.ui.img.drawImage(this.prev.ui.img.canvas, 0, 0)
            this.ui.img.filter = `blur(10.0px)`
        } else {
            super.refresh()
        }
        this.next?.refresh()
    }
}