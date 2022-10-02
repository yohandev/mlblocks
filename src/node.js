import $ from 'jquery'
import "./util"

// Root elements for head nodes
const NODES_ROOT = $(document.body);

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
        this.div = $(`
            <div class="node">
                ${this.model.name}
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
        this.div.css("background", ['crimson', 'cornflowerblue', 'olive'].sample())
    }

    // Disconnect the specified block from me
    unsnap(node) {
        node.ui.div.appendTo(NODES_ROOT)
        node.ui.pos.x = this.pos.x + this.width
        node.ui.pos.y = this.pos.y
    }

    // Snap the specified block to me
    snap(node) {
        this.div.append(node.ui.div)
        node.ui.div.css('transform', `translate(${this.width}px, 0px)`)
    }

    // Is the provided node in range to be snapped?
    snappable(node) {
        const r1 = this.div[0].getBoundingClientRect()
        const r2 = node.ui.div[0].getBoundingClientRect()

        const dx = r1.left - r2.right
        const dy = Math.abs(r1.top - r2.top)

        return dy < 50 && dx > -5 && dx < 50
    }

    // Highlight this node
    focus() {
        this.div.css("border", "solid 1px yellow")
    }

    // Unhighlight this node
    blur() {
        this.div.css("border", "none")
    }

    // Find a snappable node
    find() {
        return this.model.graph.find(n => this.snappable(n))
    }

    // Width of this node, to offset when snapping
    get width() { return this.div.width() }
}