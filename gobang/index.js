$(function ($) {
    const canvas = $('#canvas')[0]
    const ctx = canvas.getContext('2d')

    const draw = () => {
        // 画布的宽度
        const cw = canvas.width
        // 画布的高度
        const ch = canvas.height
        // 组成格子的线的横向或纵向的条数
        const count = 15
        // 格子大小，宽高都是40
        const grid = 50
        // 最外面的线距离画布的边的距离
        const margin = (canvas.width - (count - 1) * grid) / 2
        // 棋盘颜色
        const bgc = '#F0C092'

        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // 画棋盘背景色
        ctx.fillStyle = bgc
        ctx.fillRect(0, 0, cw, ch)

        // 整体移动画布内容
        ctx.translate(margin, margin)
        ctx.fillStyle = '#000'

        // 画格子线条
        ctx.beginPath()
        for (let i = 0; i < count; i++) {
            ctx.moveTo(0, i * grid)
            ctx.lineTo(grid * (count - 1), i * grid)
            ctx.moveTo(i * grid, 0)
            ctx.lineTo(i * grid, grid * (count - 1))
        }
        ctx.stroke()

        // 棋盘上的5个黑点
        ctx.beginPath()
        ctx.arc((count - 1) / 2 * grid, (count - 1) / 2 * grid, 10, 0, Math.PI * 2)
        ctx.moveTo(3 * grid, 3 * grid)
        ctx.arc(3 * grid, 3 * grid, 10, 0, Math.PI * 2)
        ctx.moveTo(11 * grid, 3 * grid)
        ctx.arc(11 * grid, 3 * grid, 10, 0, Math.PI * 2)
        ctx.moveTo(11 * grid, 11 * grid)
        ctx.arc(11 * grid, 11 * grid, 10, 0, Math.PI * 2)
        ctx.moveTo(3 * grid, 11 * grid)
        ctx.arc(3 * grid, 11 * grid, 10, 0, Math.PI * 2)
        ctx.stroke()
        ctx.fill()
    }

    draw()
})