import Node from "./node"

const IMAGE = new Image()
IMAGE.src = './assets/5.jpg'
IMAGE.onload = () => {
    IMAGE.crossOrigin = 'anonymous'
}

export default class NodeImage extends Node {
    uicontents() {
        return `
        <img class="node-tail" src="./cap.svg" height="100"/>
        <div class="node-content">
            <div class="node-preview">
                <canvas width="28" height="28" />
            </div>
        </div>
        <img class="node-head" src="./head.svg" height="100"/>
        `
    }

    refresh() {
        this.ui.img.drawImage(IMAGE, 0, 0, 28, 28)
        // this.ui.img.beginPath()
        // this.ui.img.rect(0, 0, 28, 28)
        // this.ui.img.fillStyle = "white"
        // this.ui.img.fill()
        // this.next?.refresh()
    }
}