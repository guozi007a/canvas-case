$(function ($) {
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    // 保存路径
    let path = null

    /**
     * 绘制运动路径
     * x, y 点位的起始坐标
     * r 运动半径
     * s 初始弧度
     * ds 每次运动的弧度
     * c 颜色
     */
    function Trailing(x, y, r, s, ds, c) {
        this.x = x
        this.y = y
        this.r = r
        this.s = s
        this.ds = ds
        this.c = c

        this.tra = function () {
            const rp = {
                x: this.x,
                y: this.y,
            }

            this.s += this.ds

            this.x = innerWidth / 2 + Math.cos(this.s) * this.r
            this.y = innerHeight / 2 + Math.sin(this.s) * this.r

            ctx.strokeStyle = this.c

            ctx.beginPath()
            ctx.moveTo(rp.x, rp.y)
            ctx.lineTo(this.x, this.y)
            ctx.stroke()
            ctx.closePath()
        }
    }

    const draw = () => { 
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
        ctx.fillRect(0, 0, innerWidth, innerHeight)

        path.tra()

        window.requestAnimationFrame(draw)
    }

    const init = () => {
        // 画布尺寸
        canvas.width = innerWidth
        canvas.height = innerHeight

        ctx.lineWidth = 4
        // ctx.globalAlpha = 0.05

        path = new Trailing(
            innerWidth / 2,
            innerHeight / 2,
            200,
            0,
            Math.PI / 300,
            'pink'
        )

        draw()
    }

    init()
})