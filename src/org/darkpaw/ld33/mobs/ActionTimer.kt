package org.darkpaw.ld33.mobs

import org.darkpaw.ld33.Vector


class ActionTimer(){

    var timer_frames : Double = 0.0
    var expired : Boolean = false

    fun tick(){
        if(timer_frames < 0.0) expired = true
        timer_frames -= 1
    }

    fun set(duration : Double){
        timer_frames = duration
        expired = false
    }

//
//
//    fun move(){
//        if(reload_timer > 0.0){
//            reloading = true
//            reload_timer -= 1.0
//        }else{
//            reloading = false
//        }
//
//
//    }
//
//    fun fire() {
//        reload_timer = game_world.target_fps * 1.5
//        reloading = true
//    }


}
