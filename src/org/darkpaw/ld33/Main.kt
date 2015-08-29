package org.darkpaw.ld33

import kotlin.browser.document
import kotlin.browser.window
import jquery.*
import org.w3c.dom.HTMLCanvasElement
import org.w3c.dom.CanvasRenderingContext2D
import kotlin.test.assertNotNull

val canvas = initalizeCanvas()

fun initalizeCanvas(): HTMLCanvasElement {
    //val canvas = document.createElement("canvas") as HTMLCanvasElement
    val canvas = document.getElementById("main_canvas") as HTMLCanvasElement
    //canvas.width  = window.innerWidth.toInt();
    //canvas.height = window.innerHeight.toInt();

    //val context = canvas.getContext("2d") as CanvasRenderingContext2D
    //document.body!!.appendChild(canvas)
    return canvas
}

fun v(x: Double, y: Double) = Vector(x, y)

fun main(vararg args: String) {

    println("Startup!")
    try {
        document.getElementById("title")!!.innerHTML = "Kotlin Javascript and HTML5 Canvas Test"
    }catch(e : NullPointerException){
        println("Whoops, the HTML is missing the title element?")
    }

    jq {
        val context = canvas.getContext("2d") as CanvasRenderingContext2D
        val world = GameWorld(context)
        CanvasEvents(canvas, world)

        world.run()
    }

}