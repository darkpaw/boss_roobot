package org.darkpaw.ld33.effects

import org.darkpaw.ld33.canvas
import org.w3c.dom.CanvasRenderingContext2D
import kotlin.browser.window

class Grid(context : CanvasRenderingContext2D) {

    val context = context //  canvas.getContext("2d") as CanvasRenderingContext2D
    val height = canvas.height
    val width = canvas.width
    var hue = 0;

    fun gridify() {
        context.save();

        for(y in 1.0..12.0){
            context.beginPath();
            context.lineWidth = 0.5;
            context.moveTo(0.0, y * 40);
            context.lineTo(width.toDouble(), y * 40)
            hue += (Math.random() * 10).toInt();
            context.strokeStyle = "hsl($hue, 50%, 50%)";
            context.stroke();
        }
        for(x in 1.0..16.0){
            context.beginPath();
            context.lineWidth = 0.5;
            context.moveTo(x * 60, 0.0);
            context.lineTo(x * 60, height.toDouble())
            hue += (Math.random() * 10).toInt();
            context.strokeStyle = "hsl($hue, 50%, 50%)";
            context.stroke();
        }
        context.restore();
    }


}
