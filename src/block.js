import $ from "jquery"
import "./util"

/**
 * Internal representation of scripts...
 * Every draggable component("block") is a node. So, a script is a
 * linked list of nodes.
 * This representation doesn't care about visual shape(jigsaw, round,
 * capped, etc.) and rather uses the properties of can/cannot have a
 * preceding/next node.
 * Nodes can also have nested nodes, but nestee cannot have either
 * preceding/next nodes(ie. round blocks)
 */
export default class Node {
    constructor(env) {
        this._env = env     // Free heads
        this._next = null   // Next node
        this._prev = null   // Prev node

        this._pos = { x: 0, y: 0 }
        this._div = $(`<div class="node"></div>`)
            .draggable(this._pos, {
                start: (_) => {
                    if (this._prev) {
                        this._prev.next = null
                    }
                },
                move: (_) => {
                    env.forEach(n => n._div.css("border", "none"))
                    env.find(n => this.inRange(n))?._div?.css("border", "solid 1px red")
                },
                end: (_) => {
                    env.forEach(n => n._div.css("border", "none"))
                    
                    const n = env.find(n => this.inRange(n))
                    if (n) { n.next = this }
                }
            })
            .appendTo(document.body)
    }

    canHavePrev() { return true }
    canHaveNext() { return true }

    draw() {
    }

    // Is this node in range to be drop'ed onto the other node `n`
    inRange(n) {
        const r1 = this._div[0].getBoundingClientRect()
        const r2 = n._div[0].getBoundingClientRect()

        const dx = r1.left - r2.right
        const dy = Math.abs(r1.top - r2.top)

        return dy < 50 && dx > -5 && dx < 50
    }

    get next() { return this.next }
    set next(n) {
        if (n === null) {
            let next;
            if (next = this._next) {
                next._div.appendTo(document.body)
                next._prev = null

                next._pos.x = this._pos.x + this._div.width()
                next._pos.y = this._pos.y
            }
            this._next = null
            return
        }
        if (!this.canHaveNext() || !n.canHavePrev()) {
            throw "Cannot link these two nodes together!"
        }
        if (this._next) {
            n.next = this._next
        }
        this._next = n
        n._prev = this
        this._div.append(n._div)
        n._div.css('transform', `translate(${this._div.width()}px, 0px)`)
    }
}