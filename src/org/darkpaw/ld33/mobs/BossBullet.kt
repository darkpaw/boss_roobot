package org.darkpaw.ld33.mobs

import org.darkpaw.ld33.GameWorld
import org.darkpaw.ld33.Vector
import org.darkpaw.ld33.sprites.BulletSprite


class BossBullet(gw : GameWorld, val sprite : BulletSprite) {

    val game_world = gw
    val speed = 8.0
    var fired_from_position = Vector()
    var fired_at : Long = 0
    var visible : Boolean = false

    private fun current_position(frame_count : Long) : Vector {
        val time_travelled = (frame_count - fired_at)
        val travelled = Math.pow(time_travelled.toDouble(), 1.2) * speed
        val current_position = Vector(fired_from_position.x - travelled, fired_from_position.y)
        return current_position
    }

    fun fire(pos : Vector, frame : Long){
        visible = true
        fired_from_position = pos
        fired_at = frame
    }

    fun draw(frame_count : Long){
        if(visible) sprite.draw(current_position(frame_count))
    }

    fun move(frame_count : Long) : Boolean {

        if(!visible) return true

        val pos = current_position(frame_count)
        if (pos.x < -60.0) {
            return false
        }

        val player_pos = game_world.player.position
        val player_size  = game_world.player.sprite.size_on_screen
        val hit_box_TL = Vector(player_pos.x - player_size * 0.25, player_pos.y - player_size + sprite.size_on_screen * 0.25)
        val hit_box_sz = Vector(player_size * 0.5, player_size)

        if(pos.isInRect(hit_box_TL, hit_box_sz)){
            game_world.register_hit_player()
            return false
        }

        return true

    }

}