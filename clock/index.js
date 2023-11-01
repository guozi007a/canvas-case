$(function ($) {
    /** @type {HTMLCanvasElement} */
    const canvas = $('#canvas')[0]
    const ctx = canvas.getContext('2d')

    // 画布的宽高
    const cs = 160
    canvas.width = canvas.height = cs
    // 当前时分秒
    const now = new Date()
    const cuh = now.getHours() >= 12 ? (now.getHours() - 12) : now.getHours()
    const cum = now.getMinutes()
    const cus = now.getSeconds()

    ctx.fillStyle = 'pink'
    ctx.fillRect(55, 55, 50, 50)

    ctx.fillStyle = 'blue'
    ctx.rotate(Math.PI / 6)
    ctx.fillRect(55, 55, 50, 50)
})