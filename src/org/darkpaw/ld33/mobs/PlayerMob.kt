package org.darkpaw.ld33.mobs


import org.darkpaw.ld33.GameWorld
import org.darkpaw.ld33.Vector
import org.darkpaw.ld33.map.Waypoint
import org.darkpaw.ld33.sprites.PlayerSprite
import java.util.*


class PlayerMob(gw : GameWorld, val sprite : PlayerSprite) {

    val game_world = gw
    var position = Vector()
    val move_timer = ActionTimer()

    val waypoints = HashMap<String, Waypoint>()
    val waypoint_names = arrayListOf<String>()
    var current_waypoint : Waypoint

    var move_delta = Vector()
    val mv_speed = 4.5
    var between_waypoints = false
    val stop_time = 12.0
    val stop_for_firing_time = 42.0

    var lives = 0

    init {
        init_waypoints()
        current_waypoint = waypoints.get("top_far") as Waypoint
        reset()
    }

    fun reset(){
        current_waypoint = waypoints.get("top_far") as Waypoint
        position = current_waypoint.position
        move_timer.set(stop_time)
    }

    fun draw(){
        sprite.draw(position)
    }

    fun move(frame_count : Long){

        if(between_waypoints){

            position = position.plus(move_delta)

            val wp = current_waypoint.position
            if(position.isInRect(Vector(wp.x - 5.0, wp.y - 5.0), Vector(10.0, 10.0))) {
                position = wp
                move_delta = Vector()
                between_waypoints = false
                move_timer.set(stop_time)
            }

        } else {
            move_timer.tick()
            if (move_timer.expired) {
                if(Math.random() < 0.5) {
                    decide_randomly()
                    //decide_move()
                }else{
                    decide_move()
                }
                move_timer.set(stop_time)
            }
        }

    }

    fun goto(waypoint_name : String){
        println("Goto ${waypoint_name}")
        between_waypoints = true
        val waypoint = waypoints.get(waypoint_name) as Waypoint
        var delta_x = 0.0
        var delta_y = 0.0
        if(waypoint.position.x > current_waypoint.position.x) delta_x = mv_speed
        if(waypoint.position.x < current_waypoint.position.x) delta_x = -mv_speed
        if(waypoint.position.y > current_waypoint.position.y) delta_y = mv_speed
        if(waypoint.position.y < current_waypoint.position.y) delta_y = -mv_speed
        move_delta = Vector(delta_x, delta_y)
        current_waypoint = waypoint
        //position = waypoint.position
    }

    fun decide_randomly(){
        if(Math.random() < 0.66) {
            fire()
        }else{
            val idx = (Math.random() * current_waypoint.accessible.size()).toInt()
            val new_waypoint_name = current_waypoint.accessible.get(idx)
            goto(new_waypoint_name)
        }
    }

    fun decide_move(){

        val ct = game_world.boss_mob.cycle_angle
        println("Decide move at ct ${ct}, current WP |${current_waypoint.name}|")

        var action = "none"
        when(current_waypoint.name){

            "top_far" -> {
                if(ct < 100) action = "top_close"
                else action = "fire"
            }

            "top_close" -> {
                if(ct < 130) action = "middle_far"
                else action = "fire"
            }

            "middle_far" -> {
                if (ct < 50) action = "bottom_far"
                else if (ct < 130) action = "middle_mid"
                else if (ct < 160) action = "fire"
                else action = "top_close"
            }

            "middle_mid" -> {
                if (ct < 90) action = "middle_far"
                else if(ct >= 90 && ct < 120) action = "middle_close"
                else if(ct >= 120) action = "fire"
                else action = "fire"
            }

            "middle_close" -> {
                if (ct > 70) action = "middle_mid"
                else action = "fire"
            }

            "bottom_far" -> {
                if (ct < 50) action = "middle_far"
                else if (ct < 150) action = "bottom_mid"
                else action = "fire"
            }

            "bottom_mid" -> {
                if (ct > 90) action = "bottom_far"
                else if (ct > 150) action = "bottom_close"
                else action = "fire"
            }

            "bottom_close" -> {
                if (ct > 60) action = "bottom_mid"
                else action = "fire"
            }

        }

        if(action == "none") return
        else if(action == "fire") fire()
        else goto(action)

    }

    fun fire(){
        move_timer.set(stop_for_firing_time)
        println("Player fires!!")
        val gun_position = Vector(position.x + sprite.size * 0.33, position.y - sprite.size * 0.6)
        game_world.player_fire(gun_position)
    }

    fun add_waypoint(name : String, position : Vector) : Waypoint{

        waypoint_names.add(name)
        val wp = Waypoint(position, name)
        waypoints.set(name, wp)
        return wp
    }

    fun init_waypoints(){

        var wp = add_waypoint("top_far", Vector(10.0, 60.0))
        wp.accessible.add("top_close")

        wp = add_waypoint("top_close", Vector(120.0, 60.0))
        wp.accessible.add("top_far")
        wp.accessible.add("middle_far")

        wp = add_waypoint("middle_far", Vector(120.0, 180.0))
        wp.accessible.add("middle_mid")
        wp.accessible.add("top_close")
        wp.accessible.add("bottom_far")

        wp = add_waypoint("middle_mid", Vector(230.0, 180.0))
        wp.accessible.add("middle_far")
        wp.accessible.add("middle_close")

        wp = add_waypoint("middle_close", Vector(340.0, 180.0))
        wp.accessible.add("middle_mid")

        wp = add_waypoint("bottom_far", Vector(120.0, 304.0))
        wp.accessible.add("middle_far")
        wp.accessible.add("bottom_mid")

        wp = add_waypoint("bottom_mid", Vector(232.0, 304.0))
        wp.accessible.add("bottom_far")
        wp.accessible.add("bottom_close")

        wp = add_waypoint("bottom_close", Vector(345.0, 304.0))
        wp.accessible.add("bottom_mid")

    }


}