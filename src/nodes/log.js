import Node from "./node"

export default class NodeLog extends Node {
    uicontents() {
        return `
        <img class="node-tail" src="./tail.svg" height="100"/>
        <div class="node-content">
            log
            <div class="node-preview">
                <canvas width="28" height="28" />
            </div>
        </div>
        <img class="node-head" src="./head.svg" height="100"/>
        `
    }

    refresh() {
        if (this.prev) {
            this.ui.img.drawImage(this.prev.ui.img.canvas, 0, 0)
            let buf = this.ui.img.getImageData(0, 0, 28, 28)
            for (let i = 0; i < buf.data.length; i += 4) {
                buf.data[i + 0] = Math.log(buf.data[i + 0])
                buf.data[i + 1] = Math.log(buf.data[i + 1])
                buf.data[i + 2] = Math.log(buf.data[i + 2])
            }
            this.ui.img.putImageData(buf, 0, 0)
        } else {
            super.refresh()
        }
        this.next?.refresh()
    }
}