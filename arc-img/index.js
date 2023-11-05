$(function ($) {
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    const img = new Image()
    img.src = './dilireba01.jpg'

    img.onload = function () {
        // 画布和图片一一对应
        canvas.width = img.width
        canvas.height = img.height

        const cp = ctx.createPattern(img, 'no-repeat')

        ctx.fillStyle = cp
        ctx.beginPath()
        ctx.arc(200, 240, 100, 0, Math.PI * 2)
        ctx.fill()
    }
})