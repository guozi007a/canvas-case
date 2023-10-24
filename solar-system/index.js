$(function ($) {
    const canvas = $('#canvas')[0]
    const ctx = canvas.getContext('2d')

    const sun = new Image()
    const earth = new Image()
    const moon = new Image()

    sun.src = './sun.png'
    earth.src = './earth.png'
    moon.src = './moon.png'

    const init = () => {
        window.requestAnimationFrame(draw)
    }

    const draw = () => {
        ctx.globalCompositeOperation = 'destination-over'
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const time = new Date()

        ctx.fillStyle = "rgba(0,0,0,0.4)"
        ctx.strokeStyle = "rgba(0,153,255,0.4)"
        ctx.save()
        ctx.translate(100, 100)

        // Earth
        ctx.rotate(((2 * Math.PI) / 60) * time.getSeconds() +
        ((2 * Math.PI) / 60000) * time.getMilliseconds())
        ctx.translate(60, 0)
        ctx.fillRect(0, -12, 50, 24)
        ctx.drawImage(earth, -12, -12)

        // Moon
        ctx.save()
        ctx.rotate(
            ((2 * Math.PI) / 6) * time.getSeconds() +
            ((2 * Math.PI) / 6000) * time.getMilliseconds(),
        )
        ctx.translate(0, 28.5)
        ctx.drawImage(moon, -3.5, -3.5)
        ctx.restore()

        // Sun
        ctx.restore()
        ctx.drawImage(sun, 0, 0, canvas.width, canvas.height)

        window.requestAnimationFrame(draw)
    }

    init()
})