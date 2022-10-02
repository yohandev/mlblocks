import $ from 'jquery'
import interact from "interactjs"

$.fn.draggable = function(pos, handlers=null) {
    interact(this[0]).draggable({
        listeners: {
            move(e) {
                pos.x += e.dx
                pos.y += e.dy
                $(e.target).css('translate', `${pos.x}px ${pos.y}px`)
                
                handlers?.move?.(e)
            },
            start(e) { handlers?.start?.(e) },
            end(e) { handlers?.end?.(e) },
        },
    })
    return this
}

Array.prototype.sample = function() {
    return this[Math.floor(Math.random() * this.length)]
}