$(function ($) {
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    // 流星
    let f = [];

    // 随机颜色 
    const oneColor = () => {
        const s = '0123456789abcdef'

        let rc = '#'

        for (let i = 0; i < 6; i++) {
            rc += s[Math.ceil(Math.random() * 15)]
        }

        return rc
    }

    /**
     * 流星雨动画
     * x, y-流星圆心
     * r 半径
     * d 每次飞行距离
     * an 飞行角度角度
     * c 流星颜色
     */
    function Flow(x, y, r, d, an, c) {
        this.x = x
        this.y = y
        this.r = r
        this.d = d
        this.an = an
        this.c = c

        this.ms = function () {
            this.x += Math.cos(this.an) * this.d
            this.y += Math.sin(this.an) * this.d
            this.r *= 0.994

            ctx.fillStyle = this.c

            ctx.beginPath()
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
            ctx.fill()
            ctx.closePath()
        }
    }

    const draw = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
        ctx.fillRect(0, 0, innerWidth, innerHeight)

        f.forEach(v => v.ms())

        window.requestAnimationFrame(draw)
    }

    const init = () => {
        canvas.width = innerWidth
        canvas.height = innerHeight

        for (let i = 0; i < 20; i++) {
            f.push(new Flow(
                Math.ceil(Math.random() * innerWidth),
                0,
                Math.ceil(Math.random() * 2) + 2,
                2,
                Math.PI / 4 * Math.ceil(Math.random() * 3),
                oneColor(),
            ))
        }

        draw()
    }

    init()
})