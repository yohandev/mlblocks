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
                <div class="node-container">
                    <div class="node-contents">
                        <h1>my name is: ${this.model.name}. hello!</h1>
                    </div>
                </div>
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
        this.div.css("fill", ['crimson', 'cornflowerblue', 'olive'].sample())

        const width = this.div.find('.node-contents')[0].scrollWidth
        console.log(width)
        const height = this.div[0].getBoundingClientRect().height
        this.div.find('.node-container').append($(`
            <svg xmlns="http://www.w3.org/2000/svg" height="100px" viewBox="0 0 ${width + 150 + 39} 145">
                <path d="${paths['STACK'](width + 150)}" stroke-width="3"/>
            </svg>
        `))
        this.div.css({
            width: width + 30
        })
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
        this.div.css("stroke", "yellow")
    }

    // Unhighlight this node
    blur() {
        this.div.css("stroke", "none")
    }

    // Find a snappable node
    find() {
        return this.model.graph.find(n => this.snappable(n))
    }

    // Width of this node, to offset when snapping
    get width() { return this.div.width() }
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