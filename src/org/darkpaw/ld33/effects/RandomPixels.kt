package org.darkpaw.ld33.effects

import org.darkpaw.ld33.canvas
import org.w3c.dom.CanvasRenderingContext2D
import kotlin.browser.window

class RandomPixels(context : CanvasRenderingContext2D) {

    val context = context //  canvas.getContext("2d") as CanvasRenderingContext2D
    val height = canvas.height
    val width = canvas.width
    var hue = 0;

    fun pixellate() {
        context.save();

        for(i in 1..12){
            context.beginPath();
            var x = width * Math.random()
            var y = height * Math.random()
            var px_size = 12 * Math.random()
            context.lineWidth = px_size;
            context.moveTo(x, y);
            context.lineTo(x + px_size, y)
            hue += (Math.random() * 10).toInt();
            context.strokeStyle = "hsla($hue, 90%, 20%, 0.3)";
            context.shadowColor = "white";
            context.shadowBlur = 3.0;
            context.stroke();
        }
        context.restore();
    }


}
