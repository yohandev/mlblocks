import Node from "./node"

export default class NodeLog extends Node {
    uicontents() {
        return `
        <img class="node-tail" src="./tail.svg" height="100"/>
        <div class="node-content">
            log
            <div class="node-preview"></div>
        </div>
        <img class="node-head" src="./head.svg" height="100"/>
        `
    }
}