import $ from 'jquery'
import "./util"

// Root elements for head nodes
const NODES_ROOT = $(document.body)
//     <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="500px">
//     </svg>
// `).appendTo(document.body)

/** A single node("block") in the project graph("scripts") */
// Model
export default class Node {
    constructor(name, graph) {
        this.name = name
        this.graph = graph
        this._next = null
        this._prev = null

        this.ui = new Node.UI(this)
    }

    get next() { return this._next }
    get prev() { return this._prev }
    set next(node) {
        // Case I: Clearing next node
        if (node === null) {
            if ((node = this.next) !== null) {
                this._next = null
                node._prev = null
                // View
                this.ui.unsnap(node)
            }
            return
        }
        // Case II: Slot in between two nodes
        if (this.next !== null) {
            node.leaf.next = this.next
        }
        // Case III: Fallthrough
        this._next = node
        node._prev = this
        this.ui.snap(node)
    }

    get leaf() {
        if (this.next === null) {
            return this
        }
        return this.next.leaf
    }
}

// View/Controller
Node.UI = class {
    constructor(node) {
        this.model = node
        this.pos = { x: 0, y: 0 }
        // this.div = $(document.createElementNS("http://www.w3.org/2000/svg", "g")).attr({
        //     'class': 'node'
        // })
        this.div = $(`
            <div class="node-container">
                <img class="node-tail" src="./tail.svg" height="100"/>
                <div class="node-content">
                    multiply
                    <div class="node-preview"></div>
                    <div class="node-input">
                        <input type="text" value="1.0">
                    </div>
                </div>
                <img class="node-head" src="./head.svg" height="100"/>
            </div>
        `)

        this.div.draggable(this.pos, {
            start: (_) => {
                if (this.model.prev) {
                    this.model.prev.next = null
                }
            },
            move: (_) => {
                this.model.graph.forEach(n => n.ui.blur())
                this.find()?.ui?.focus()
            },
            end: (_) => {
                this.model.graph.forEach(n => n.ui.blur())
                if (this.find()) {
                    this.find().next = this.model
                }
            },
        })
        this.div.appendTo(NODES_ROOT)

        // const bg = $(document.createElementNS("http://www.w3.org/2000/svg", "path")).attr({
        //     'stroke-width': '2',
        //     'stroke': '#000',
        //     'fill': '#fff',
        // }).appendTo(this.div)
        // $(document.createElementNS("http://www.w3.org/2000/svg", "text")).attr({
        //     'x': '40',
        //     'y': '85',
        //     'fill': '#000',
        //     'stroke-width': '0',
        // })
        //     .append("multiply really long numbers")
        //     .appendTo(this.div)
        // const w = this.div[0].getBoundingClientRect().width
        // bg.attr({
        //     'd': paths['STACK'](w + 50),
        // })
    }

    // Disconnect the specified block from me
    unsnap(node) {
        node.ui.div.appendTo(NODES_ROOT)
        node.ui.pos.x = this.pos.x + this.width
        node.ui.pos.y = this.pos.y
    }

    // Snap the specified block to me
    snap(node) {
        node.ui.div.css('translate', `${this.width - 14}px 0px`)
        this.div.append(node.ui.div)
    }

    // Is the provided node in range to be snapped?
    snappable(node) {
        const r1 = this.div[0].getBoundingClientRect()
        const r2 = node.ui.div[0].getBoundingClientRect()

        const dx = r1.left - r2.right
        const dy = Math.abs(r1.top - r2.top)

        return dy < 50 && dx > -25 && dx < 50
    }

    // Highlight this node
    focus() {
        this.div.css("filter", "drop-shadow(5px 0px 0px grey")
    }

    // Unhighlight this node
    blur() {
        this.div.css("filter", "none")
    }

    // Find a snappable node
    find() {
        return this.model.graph.find(n => this.snappable(n))
    }

    // Width of this node, to offset when snapping
    get width() {
        return this.div[0].getBoundingClientRect().width
    }
}

// Block paths as a function of width
const paths = {
    CAP: (w) => 
        `M72.5.5
        S0,0,.5,72.5
        s72,72,72,72
        h${Math.max(116, w)}
        a10,10,0,0,0,10-10
        V111.59
        a5,5,0,0,1,2.77-4.47
        l12.47-6.24
        a5,5,0,0,0,2.76-4.47
        V48.59
        a5,5,0,0,0-2.76-4.47
        l-12.47-6.24
        a5,5,0,0,1-2.77-4.47
        V10.5a10,10,0,0,0-10-10
        Z`,
    STACK: (w) =>
        `M.5,10.5
        V33.41
        a5,5,0,0,0,2.76,4.47
        l12.48,6.24
        a5,5,0,0,1,2.76,4.47
        V96.41
        a5,5,0,0,1-2.76,4.47
        L3.26,107.12
        A5,5,0,0,0,.5,111.59
        V134.5
        a10,10,0,0,0,10,10
        h${Math.max(w, 197)}
        a10,10,0,0,0,10-10
        V111.59
        a5,5,0,0,1,2.76-4.47
        l12.48-6.24
        a5,5,0,0,0,2.76-4.47
        V48.59
        a5,5,0,0,0-2.76-4.47
        l-12.48-6.24
        a5,5,0,0,1-2.76-4.47
        V10.5
        a10,10,0,0,0-10-10
        H10.5
        A10,10,0,0,0,.5,10.5
        Z`
}