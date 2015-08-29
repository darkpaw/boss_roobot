package org.darkpaw.ld33.mobs

import org.darkpaw.ld33.GameWorld
import org.darkpaw.ld33.Vector
import org.darkpaw.ld33.sprites.PlayerBulletSprite
import org.darkpaw.ld33.sprites.PlayerSprite


class PlayerBullet(gw : GameWorld, val sprite : PlayerBulletSprite, fired_from : Vector, fired_at : Long) {

    val game_world = gw
    val speed = 16.0
    val fired_from_position = fired_from
    val fired_at = fired_at

    private fun current_position(frame_count : Long) : Vector{
        val travelled = (frame_count - fired_at) * speed
        val current_position = Vector(fired_from_position.x + travelled, fired_from_position.y)
        return current_position
    }

    fun draw(frame_count : Long){
        sprite.draw(current_position(frame_count))
    }

    fun move(frame_count : Long) : Boolean {

        val pos = current_position(frame_count)
        if(pos.x > 800.0){
            return false
        }
        val boss_pos = game_world.boss_mob.position
        val boss_size = game_world.boss_mob.sprite.size_on_screen
        val hit_box_TL = Vector(boss_pos.x - boss_size * 0.4, boss_pos.y - boss_size * 0.8)
        val hit_box_sz = Vector(boss_size * 0.6, boss_size * 0.75)

        if(pos.isInRect(hit_box_TL, hit_box_sz)){
            game_world.register_hit_boss()
            return false
        }

        return true
    }

}