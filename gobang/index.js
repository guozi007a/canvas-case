$(function ($) {
    const canvas = $('#canvas')[0]
    const ctx = canvas.getContext('2d')

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
    // 当前落子是否是黑子，黑子先手
    let isBlack = true
    // 棋子半径
    const size = 20
    // 棋盘落子情况
    let downList = []

    // 初始化落子情况 一行一行的排列
    for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
            downList.push({
                x: j * grid,
                y: i * grid,
                down: 0, // 0表示未落子，1表示黑子，2表示落子为白子
            })
        }
    }

    // 检查游戏结果 
    const checkGameResult = (px, py, list, isBlack) => {
        // 当前落子所在的行 从0开始
        const line = py / grid
        // 当前列
        const column = px / grid
        // 当前落子的颜色转换
        const down = isBlack ? 1 : 2
        // 获取当前行落子情况
        const lineDown = list.slice(line * count, (line + 1) * count)
        // 遍历当前行，查找是否有同颜色的五子连珠的情况
        for (let i = 0; i < lineDown.length; i++) {
            // 如果当前选中的五子中没有当前的落子，就跳过
            if (column < i || column > i + 4) continue
            // 验证选中的五子是否为同颜色落子
            const result = lineDown.slice(i, i + 5).every(v => v.down == down)
            if (!result) continue
            // 如果出现了五子连珠，就返回具体信息
            return {
                winner: down, // 胜方，1为黑子，2为白子
                successList: lineDown.slice(i, i + 5), // 五子连珠是哪五个棋子
            }
        }
        // 如果黑白双方都没获胜且没平局，就返回空
        return null
    }

    const draw = () => {
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

        // 点击放置棋子
        $('#canvas').click(function (e) {
            const ox = e.offsetX
            const oy = e.offsetY
            // 棋盘外放置无效
            if (ox < margin || oy < margin || ox > (cw - margin) || oy > (ch - margin)) return
            // 计算落子坐标
            let positionX = -1
            let positionY = -1
            const minXN = Math.floor((ox - margin) / grid)
            const maxXN = Math.ceil((ox - margin) / grid)
            const minYN = Math.floor((oy - margin) / grid)
            const maxYN = Math.ceil((oy - margin) / grid)
            const diffX = (ox - margin) % grid
            const diffY = (oy - margin) % grid
            // 左
            if (diffX <= size) {
                positionX = minXN * grid
            }
            // 右
            if ((diffX + size) >= grid) {
                positionX = maxXN * grid
            }
            // 上
            if (diffY <= size) {
                positionY = minYN * grid
            }
            // 下
            if ((diffY + size) >= grid) {
                positionY = maxYN * grid
            }
            if (positionX >= 0 && positionY >= 0) {
                // 检查当前点位是否已经有棋子
                const o = downList.find(v => v.x == positionX && v.y == positionY && v.down)
                if (o) return
                // 如果还没有，就落子成功
                ctx.beginPath()
                ctx.fillStyle = isBlack ? '#000' : '#fff'
                ctx.moveTo(positionX, positionY)
                ctx.arc(positionX, positionY, size, 0, Math.PI * 2)
                ctx.fill()
                // 更新落子情况
                downList = downList.map(v => v.x == positionX && v.y == positionY ? { ...v, down: isBlack ? 1 : 2 } : v)
                // 检查游戏是否结束，即是否有人胜出或失败或平局，如果有，就返回结果
                const result = checkGameResult(positionX, positionY, downList, isBlack)
                if (result) {
                    console.log(result)
                    // 把胜利的五子连珠高亮
                    ctx.save()
                    ctx.beginPath()
                    ctx.fillStyle = 'green'
                    result.successList.forEach(v => {
                        ctx.moveTo(v.x, v.y)
                        ctx.arc(v.x, v.y, size, 0, Math.PI * 2)
                        ctx.fill()
                    })
                    ctx.restore()
                    return
                }
                // 下一次落子的颜色跟当前颜色相反
                isBlack = !isBlack
            }
        })
    }

    draw()
})