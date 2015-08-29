package org.darkpaw.ld33.mobs

import org.darkpaw.ld33.GameWorld
import org.darkpaw.ld33.Vector
import org.darkpaw.ld33.sprites.RooSprite


class BossMob(gw : GameWorld, val sprite : RooSprite) {

    val game_world = gw
    var position = Vector()
    var boss_delta = Vector()
    var reload_timer = ActionTimer()
    var reloading : Boolean = false
    val cycle_time = 2400
    var HP = 0
    var cycle_angle = 0.0

    init { reset() }

    fun reset(){
        HP = 500
        position = Vector(game_world.width * 0.6, game_world.height - 175.0)
        reloading = false

    }

    fun draw(){
        val draw_position = Vector(position.x - sprite.size_on_screen / 2, position.y - sprite.size_on_screen)
        sprite.draw(draw_position)
    }

    fun move(frame_count : Long){

        val frames = frame_count.mod(cycle_time)
        val frames_degrees : Double = frames / cycle_time.toDouble() * 180.0
        cycle_angle = frames_degrees

        reload_timer.tick()
        reloading = ! reload_timer.expired

        val y = (Math.sin(frames_degrees) + 1) / 2.0 // normalised to range 0.0 .. 1.0

        val new_pos_x = game_world.width * 0.75 + y * 80.0
        val new_pos_y = game_world.height + 20.0 - y * 0.5 * game_world.height
        position = Vector(new_pos_x, new_pos_y)

    }

    fun fire(){
        reload_timer.set(game_world.target_fps * 2.4)
        reloading = true
    }

}