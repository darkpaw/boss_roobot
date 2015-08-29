package org.darkpaw.ld33

import org.w3c.dom.HTMLImageElement
import kotlin.browser.window


fun getImage(path: String): HTMLImageElement {
    val image = window.document.createElement("img") as HTMLImageElement
    image.src = path
    return image
}

