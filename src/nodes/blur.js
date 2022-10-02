import Node from "./node"

export default class NodeBlur extends Node {
    uicontents() {
        return `
        <img class="node-tail" src="./tail.svg" height="100"/>
        <div class="node-content">
            blur&nbsp;&nbsp;
            <div class="node-preview"></div>
            <div class="node-input">
                <input type="text" value="1.0">
            </div>
        </div>
        <img class="node-head" src="./head.svg" height="100"/>
        `
    }
}