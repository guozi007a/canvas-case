$(function ($) {
    /** @type {HTMLCanvasElement} */
    const canvas = $('#canvas')[0]
    const ctx = canvas.getContext('2d')

    canvas.width = canvas.height = 500

    ctx.translate(100, 100)
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.rotate(Math.PI / 6)
    ctx.lineTo(0, -20)
    ctx.stroke()
})