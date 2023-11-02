$(function ($) {
    /** @type {HTMLCanvasElement} */
    const canvas = $('#canvas')[0]
    const ctx = canvas.getContext('2d')

    const clock = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        ctx.save()

        ctx.translate(canvas.width / 2, canvas.height / 2)

        // 外壳
        ctx.save()
        ctx.strokeStyle = '#325FA2'
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.arc(0, 0, 80, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()

        // 刻度 整点的刻度线长宽数值更大
        for (let i = 0; i < 60; i++) {
            // 整点刻度
            if (i % 5 == 0) {
                ctx.save()
                ctx.lineWidth = 3
                ctx.rotate(Math.PI * 2 / 60 * i) // rotate写在绘制内容的前面，才能达到预设效果
                ctx.beginPath()
                ctx.moveTo(0, -70)
                ctx.lineTo(0, -64)
                ctx.stroke()
                ctx.restore()
            } else {
                ctx.save()
                ctx.rotate(Math.PI * 2 / 60 * i)
                ctx.beginPath()
                ctx.moveTo(0, -70)
                ctx.lineTo(0, -66)
                ctx.stroke()
                ctx.restore()
            }
        }

        // 时分秒
        const now = new Date()
        const h = now.getHours() >= 12 ? now.getHours() - 12 : now.getHours()
        const m = now.getMinutes()
        const s = now.getSeconds()

        // 时针
        ctx.save()
        ctx.lineWidth = 5
        ctx.lineCap = 'round'

        ctx.save()
        ctx.rotate(Math.PI / 6 * (h + m / 60 + s / 3600))
        ctx.beginPath()
        ctx.moveTo(0, 4)
        ctx.lineTo(0, -40)
        ctx.stroke()
        ctx.restore()

        // 分针
        ctx.lineWidth = 4
        ctx.rotate(Math.PI * 2 / 60 * (m + s / 60))
        ctx.beginPath()
        ctx.moveTo(0, 8)
        ctx.lineTo(0, -48)
        ctx.stroke()
        ctx.restore()

        // 秒针
        ctx.save()
        ctx.strokeStyle = '#D40000'
        ctx.fillStyle = '#D40000'
        ctx.lineWidth = 2
        ctx.rotate(Math.PI * 2 / 60 * s)
        ctx.beginPath()
        ctx.moveTo(0, 12)
        ctx.lineTo(0, -58)
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(0, 0, 4, 0, Math.PI * 2)
        ctx.fill()

        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(0, -42, 4, 0, Math.PI * 2)
        ctx.stroke()

        ctx.fillStyle = '#fff'
        ctx.beginPath()
        ctx.arc(0, -42, 3, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
        
        ctx.restore()

        window.requestAnimationFrame(clock)
    }

    const init = () => {
        canvas.width = 500
        canvas.height = 500

        clock()
    }

    init()
})