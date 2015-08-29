package org.darkpaw.ld33

import org.w3c.dom.CanvasRenderingContext2D
import kotlin.browser.window

open class PixelSprite(context : CanvasRenderingContext2D, size : Int, px_spacing : Double) {

    val size = size
    val context = context
    protected val pixels : IntArray = IntArray(size*size*3)
    val pxsize = px_spacing * 0.8
    val px_spacing = px_spacing

    val size_on_screen: Double
        get() = size * px_spacing

    fun draw(v : Vector) {

        val p = Pixel(context)

        for(x in 0..size-1){
            for(y in 0..size-1){
                val pix_idx = (y * 32 + x) * 4
                val canvas_x = x * px_spacing + v.x
                val canvas_y = y * px_spacing + v.y
                val colour = RGBA(pixels.get(pix_idx), pixels.get(pix_idx+1), pixels.get(pix_idx+2), pixels.get(pix_idx+3))
                //val colour = RGBA(pixels.get(pix_idx), pixels.get(pix_idx+1), pixels.get(pix_idx+2), 255)
                if(colour.A != 0) {
                    p.pixel(canvas_x, canvas_y, colour, pxsize)
                }
            }
        }

    }

    fun randomise(){
        for(i in 0..(size*size*4-1)){
            pixels.set(i, (255 * Math.random()).toInt())
        }
    }

    fun clear_to_alpha(alpha : Int){
        for(i in 0..(size*size*4-1)){
            if(i.mod(4) == 0){
                pixels.set(i, alpha)
            }else{
                pixels.set(i, 0)
            }
        }
    }

    fun setpx(pxidx : Int, colour : RGBA){
        pixels.set(pxidx, colour.R)
        pixels.set(pxidx + 1, colour.G)
        pixels.set(pxidx + 2, colour.B)
        pixels.set(pxidx + 3, colour.A)
    }


}
