$(function ($) {
    const canvas = $('#canvas')[0]
    const ctx = canvas.getContext('2d')

    const sun = new Image()
    const earth = new Image()
    const moon = new Image()

    // 日地月图片
    sun.src = './sun.png'
    earth.src = './earth.png'
    moon.src = './moon.png'

    /**
     * 统一说明，该示例的核心设计之一，就是把日地月都移动到画布中心点再进行处理，可以大大简化整个模型
     */
    const draw = () => {
        // 图形回合模式--先画的在上面
        ctx.globalCompositeOperation = 'destination-over'
        // 每次调用都清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const time = new Date()
        // 填充地球阴影部分的颜色
        ctx.fillStyle = "rgba(0,0,0,0.4)"
        ctx.save()
        // 把画布移动到中心位置
        ctx.translate(200, 200)

        // Earth
        ctx.rotate(((2 * Math.PI) / 60) * time.getSeconds() +
            ((2 * Math.PI) / 60000) * time.getMilliseconds())
        // 地球是画在中心位置的，往又移动160，作为日地距离
        ctx.translate(160, 0)
        // 地球的阴影部分，体现出地球遮挡太阳光的效果
        ctx.fillRect(0, -12, 50, 24)
        // 绘制地球图片，图片的初始中心位于画布的中心位置
        ctx.drawImage(earth, -12, -12)

        // Moon
        // 状态的管理是该案例的核心应用之一。
        // 月球的状态是建立在地球状态的基础上的，这样可以确保日地同步运行
        ctx.save()
        ctx.rotate(
            ((2 * Math.PI) / 6) * time.getSeconds() +
            ((2 * Math.PI) / 6000) * time.getMilliseconds(),
        )
        ctx.translate(0, 28.5)
        ctx.drawImage(moon, -3.5, -3.5)
        ctx.restore()

        // Sun
        // 太阳不需要运动，所以这里就清除之前保存的状态
        ctx.restore()
        ctx.save()
        // 太阳图片太小，不能铺满画布，所以这里把太阳图片移动到画布中间
        ctx.translate(100, 100)
        ctx.drawImage(sun, 0, 0, 200, 200)
        ctx.restore()

        ctx.save()
        // 太阳图片太小，无法覆盖整个画布，所以此处给画布加一个背景色
        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.restore()

        window.requestAnimationFrame(draw)
    }

    draw()
})