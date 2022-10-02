import Node from "./node"

export default class NodeImage extends Node {
    uicontents() {
        return `
        <img class="node-tail" src="./cap.svg" height="100"/>
        <div class="node-content">
            <div class="node-preview"></div>
        </div>
        <img class="node-head" src="./head.svg" height="100"/>
        `
    }
}