package org.darkpaw.ld33

import org.w3c.dom.CanvasRenderingContext2D
import kotlin.browser.window

class Pixel(context : CanvasRenderingContext2D) {

    val context = context //  canvas.getContext("2d") as CanvasRenderingContext2D
    val height = canvas.height
    val width = canvas.width
    var hue = 0;

    fun pixel(x : Double, y : Double, colour: RGBA, pxsize : Double) {
        context.save();
        context.beginPath();
        context.lineWidth = pxsize;
        context.moveTo(x, y);
        context.lineTo(x+pxsize, y)
        //context.globalAlpha = 0.5 + Math.random() * 0.25
        context.strokeStyle = "RGB(${colour.R}, ${colour.G}, ${colour.B})";
        context.shadowColor = "black";
        context.shadowBlur = 3.0;
        context.shadowOffsetX = 1.0
        context.shadowOffsetY = 1.0
        context.stroke();
        context.restore();
    }


}
