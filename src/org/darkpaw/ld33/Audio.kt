package org.darkpaw.ld33

import jquery.jq
import org.w3c.dom.HTMLElement
import org.w3c.dom.HTMLAudioElement
import java.util.*
import kotlin.browser.window

import org.w3c.xhr.XMLHttpRequest

class Audio(val world : GameWorld) {

    val sounds = HashMap<String, HTMLAudioElement>()

    init {

    }

    fun loadSample(name : String, path: String): HTMLAudioElement {
        val sound = window.document.createElement("audio") as HTMLAudioElement
        sound.src = path
        sound.loop = false
        sounds.set(name, sound)
        return sound
    }

    fun play(name : String){
        val sound = sounds.get(name) as HTMLAudioElement
        //sound.pause()
        //sound.play()

        println("audio is muted - ${name}")

    }



}

