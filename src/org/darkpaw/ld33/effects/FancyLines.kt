package org.darkpaw.ld33.effects
import org.w3c.dom.HTMLCanvasElement
import org.w3c.dom.CanvasRenderingContext2D

import kotlin.browser.document
import kotlin.browser.window
import jquery.*
import org.darkpaw.ld33.canvas

class FancyLines(context : CanvasRenderingContext2D) {
    val context = context //  canvas.getContext("2d") as CanvasRenderingContext2D
    val height = canvas.height
    val width = canvas.width
    var x = width * Math.random()
    var y = height * Math.random()
    var hue = 0;

    fun line() {
        context.save();

        context.beginPath();

        context.lineWidth = 50.0 * Math.random();
        context.moveTo(x, y);

        x = width * Math.random();
        y = height * Math.random();

        context.bezierCurveTo(width * Math.random(), height * Math.random(),
                width * Math.random(), height * Math.random(), x, y);

        hue += (Math.random() * 10).toInt();

        context.strokeStyle = "hsl($hue, 50%, 50%)";
        context.shadowColor = "white";
        context.shadowBlur = 10.0;

        context.stroke();
        context.restore();
    }

    fun blank() {
//        context.fillStyle = "rgba(255,255,1,0.1)";
        context.fillStyle = "rgba(0,0,0,0.05)";
        context.fillRect(0.0, 0.0, width.toDouble(), height.toDouble());
    }

    fun run() {
        window.setInterval({ line() }, 40);
        window.setInterval({ blank() }, 100);
    }
}
