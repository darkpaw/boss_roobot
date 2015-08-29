package org.darkpaw.ld33

import org.darkpaw.ld33.effects.Grid
import org.darkpaw.ld33.effects.RandomPixels
import org.darkpaw.ld33.mobs.BossBullet
import org.darkpaw.ld33.mobs.BossMob
import org.darkpaw.ld33.mobs.PlayerBullet
import org.darkpaw.ld33.mobs.PlayerMob
import org.darkpaw.ld33.sprites.BulletSprite
import org.darkpaw.ld33.sprites.PlayerBulletSprite
import org.darkpaw.ld33.sprites.PlayerSprite
import org.darkpaw.ld33.sprites.RooSprite
import org.w3c.dom.CanvasRenderingContext2D
import org.w3c.dom.HTMLImageElement
import java.util.*
import kotlin.browser.window

class GameWorld(context : CanvasRenderingContext2D ) {

    val context = context
    val height = canvas.height
    val width = canvas.width
    val image_data = HashMap<kotlin.String, HTMLImageElement>()
    val audio = Audio(this)

    val background_pixels = RandomPixels(context)
    val grid_effect = Grid(context)

    val boss_mob = BossMob(this, RooSprite(context))
    val player : PlayerMob

    //val bullet_sprite = BulletSprite(context)
    val boss_bullet = BossBullet(this, BulletSprite(context))
    val player_bullet_sprite = PlayerBulletSprite(context)
    val player_bullets = arrayListOf<PlayerBullet>()

    var splash_screen = false
    //var bullet_visible = false
    var bullet_pos = Vector(0.0, 0.0)
    var bullet_delta = Vector(-7.0, 0.0)
    val target_fps = 20

    var frame_count : Long = 0
    var game_over = false

    init {
        image_data.set("background", getImage("img/background.003.png"))
        audio.loadSample("boss_shoot", "snd/boss_shoot.002.ogg")
        audio.loadSample("player_shoot", "snd/player_shoot.ogg")
        player = PlayerMob(this, PlayerSprite(context))
        player.lives = 5
    }

    private fun game_over() : Boolean {
        if(boss_mob.HP < 1 ) return true
        if(player.lives < 1 ) return true
        return false
    }

    fun boss_fire_click(v : Vector){

        if(game_over()) {
            player.reset()
            player.lives = 5
            boss_mob.reset()
            frame_count = 0
        }

        if(!boss_mob.reloading) {
            audio.play("boss_shoot")
            boss_mob.fire()
            val boss_size_px = boss_mob.sprite.size_on_screen
            bullet_pos = Vector(boss_mob.position.x - boss_size_px * 0.90, boss_mob.position.y - boss_size_px * 0.75)
            boss_bullet.fire(bullet_pos, frame_count)
        }

    }

    fun register_hit_boss(){
        println("Ouch!")
        boss_mob.HP -= 37
    }

    fun register_hit_player(){
        println("Good shot!")
        player.reset()
        player.lives -= 1
    }

    fun player_fire(pos : Vector){
        val b = PlayerBullet(this, player_bullet_sprite, pos, frame_count)
        player_bullets.add(b)
        audio.play("player_shoot")
    }
//
//    fun move_bullet(){
//        bullet_pos = bullet_pos.plus(bullet_delta)
//        if(bullet_pos.x < -50.0) bullet_visible = false
//    }

    fun draw_stuff(){


        frame_count++
        player.move(frame_count)
        boss_mob.move(frame_count)

        if(boss_bullet.move(frame_count) ==  false){
            boss_bullet.visible = false
        }

        //println("There are ${player_bullets.size()} bullets.")
        for(b in player_bullets) {
            val result = b.move(frame_count)
            if(result == false) player_bullets.remove(b)
        }

        context.fillStyle = "rgba(0.08,0.17,0.24,0.80)";
        context.fillRect(0.0, 0.0, width.toDouble(), height.toDouble());

        val bg_img = image_data.get("background") as HTMLImageElement
        context.drawImage(bg_img, 0.0, 0.0)


//        if(bullet_visible) {
//            bullet_sprite.draw(bullet_pos)
//            move_bullet()
//        }

        boss_bullet.draw(frame_count)
        boss_mob.draw()
        //boss_sprite.draw(boss_mob.position)

        for(b in player_bullets) {
            b.draw(frame_count)
        }

        player.draw()

        context.font = "48px LiquidCrystal"
        context.fillStyle = "silver"
        context.textBaseline = "top"
        context.fillText("${frame_count.mod(boss_mob.cycle_time)}", 40.0, 460.0)

        context.fillStyle = "aqua"
        context.fillText("${boss_mob.HP}", 640.0, 10.0)

        context.fillStyle = "light green"
        context.fillText("Lives: ${player.lives}", 40.0, 10.0)


        if(boss_mob.reloading) {
            boss_mob.sprite.show_reloading(true)
            context.font = "48px LiquidCrystal"
            context.fillStyle = "orangered"
            context.textBaseline = "top"
            context.fillText("RELOADING", 540.0, 375.0)
        }else{
            if(Math.random() < 0.2){ boss_mob.sprite.flicker_tail() }
            boss_mob.sprite.show_reloading(false)
        }

        if(game_over()) {
            context.fillStyle = "rgba(0,0,0,0.45)";
            context.fillRect(0.0, 0.0, width.toDouble(), height.toDouble());
            grid_effect.gridify()
            background_pixels.pixellate()
        }

    }

    fun run() {
        window.setInterval({ draw_stuff() }, 1000 / target_fps);
    }
}