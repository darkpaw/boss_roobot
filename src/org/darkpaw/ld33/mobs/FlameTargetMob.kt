package org.darkpaw.ld33.mobs

import org.darkpaw.ld33.GameWorld
import org.darkpaw.ld33.Vector
import org.w3c.dom.HTMLImageElement


class FlameTargetMob(gw : GameWorld, val target_image : HTMLImageElement) {

    val game_world = gw
    var position = Vector()
    val target_timer = ActionTimer()
    var visible: Boolean = false

    fun activate(v : Vector){
        position = v
        visible = true
        target_timer.set(45.0)
    }

    fun move() {
        target_timer.tick()
        if(target_timer.expired){
            visible = false
        }
    }

    fun draw(){
        if(visible) {
            game_world.context.drawImage(target_image, position.x - 64.0, position.y - 64.0)
        }
    }

}