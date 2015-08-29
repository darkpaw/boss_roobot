package org.darkpaw.ld33

import org.w3c.dom.HTMLCanvasElement
import jquery.*
import org.w3c.dom.HTMLElement

class CanvasEvents(val canvas: HTMLCanvasElement, val world : GameWorld) {

    init {
        jq(canvas).mousedown {
            val mousePos = mousePos(it)
            println("mouse down at (${mousePos.x}, ${mousePos.y})")
            world.boss_fire_click(mousePos)
        }

    }

    fun mousePos(e: MouseEvent): Vector {
        var offset = Vector()
        var element: HTMLElement? = canvas
        while (element != null) {
            val el: HTMLElement = element
            offset += Vector(el.offsetLeft, el.offsetTop)
            element = el.offsetParent as HTMLElement?
        }
        return Vector(e.pageX, e.pageY) - offset
    }



}

