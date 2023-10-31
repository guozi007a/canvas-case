$(function ($) {
    const canvas = $('#canvas')[0]
    const ctx = canvas.getContext('2d')

    // 画布的宽度
    const cw = canvas.width
    // 画布的高度
    const ch = canvas.height
    // 组成格子的线的横向或纵向的条数
    const count = 15
    // 格子大小，宽高都是50
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
    // 游戏是否结束，默认结束，点击开始或者下一局时，重新开始游戏
    let gameOver = true

    // mask关闭弹框
    $('.pic_mask').click(function () {
        $('.picture').hide()
    })

    // 开始游戏
    $('.start').click(function () {
        gameOver = false
        $('.dialog, .dialog1').hide()
        $('.pause, .end').show()
    })

    // 暂停游戏
    $('.pause').click(function () {
        gameOver = true
        $(this).hide()
        $('.continue').show()
    })

    // 继续游戏
    $('.continue').click(function () {
        gameOver = false
        $(this).hide()
        $('.pause').show()
    })

    // 不想玩了
    $('.end').click(function () {
        gameOver = true
        $(this).hide()
        $('.pause, .continue').hide()
        $('.dialog, .dialog1').show()
    })

    // 再玩一局，直接开局，不需要点开始游戏了
    $('.more').click(function () {
        gameOver = false
        $('.dialog, .dialog2').hide()
    })

    // 改天再约，就是恢复到初始状态
    $('.nomore').click(function () {
        gameOver = true
        $('.dialog2').hide()
        $('.dialog1').show()
    })

    // 截图保存
    $('.save').click(function () {
        $('.dialog, .dialog2').hide()

        const $ctx = $('#pic')[0].getContext('2d')
        
        $('.picture').show()
    })

    // 游戏结束的时候，即出现胜负或平局结果后
    const playEnd = () => {
        gameOver = true
        $('.dialog, .dialog2').show()
        $('.end, .pause').hide()
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
        const lineDown = list.filter(v => v.y == py)
        // 遍历当前行，查找是否有同颜色的五子连珠的情况
        for (let i = 0; i < lineDown.length; i++) {
            // 如果当前选中的五子中没有当前的落子，就跳过
            if (column < i || column > i + 4) continue
            // 验证选中的五子是否为同颜色落子
            const select = lineDown.slice(i, i + 5)
            if(!select || select.length < 5) break
            const result = select.every(v => v.down == down)
            if (!result) continue
            // 如果出现了五子连珠，就返回具体信息
            return {
                winner: down, // 胜方，1为黑子，2为白子
                successList: select, // 五子连珠是哪五个棋子
            }
        }

        // 列
        const columnDown = list.filter(v => v.x == px)
        for (let i = 0; i < columnDown.length; i++) {
            if (line < i || line > i + 4) continue
            const select = columnDown.slice(i, i + 5)
            if(!select || select.length < 5) break
            const result = select.every(v => v.down == down)
            if (!result) continue
            return {
                winner: down,
                successList: columnDown.slice(i, i + 5),
            }
        }

        // 对角线/
        const diagonalDown = []
        // 对角线起点位置 左上角和右下角刚好对称
        // 每条对角线上的点，x + y都是相等的值，
        // 在左上角，起点的y是0，终点的x是0，且x + y小于14；在右下角，起点的x是14，终点的y是14,且x + y大于14
        const beginX = line + column <= count - 1 ? line + column : count - 1
        const beginY = line + column <= count - 1 ? 0 : (line + column) - (count - 1)
        const total = line + column <= count - 1 ? line + column + 1 : count - beginY
        for (let i = 0; i < total; i++) {
            const o = list.find(v => v.x == (beginX - i) * grid && v.y == (beginY + i) * grid)
            diagonalDown.push(o)
        }
        if (diagonalDown.length < 5) return null
        for (let i = 0; i < diagonalDown.length; i++) {
            const item = diagonalDown[i]
            if (line < item.y / grid || line > item.y / grid + 4) continue
            const select = diagonalDown.slice(i, i + 5)
            if(!select || select.length < 5) break
            const result = select.every(v => v.down == down)
            if (!result) continue
            return {
                winner: down,
                successList: diagonalDown.slice(i, i + 5),
            }
        }

        // 反对角线\
        const diagonalRelativeDown = []
        // 对角线起点位置 左下角和右上角刚好对称
        // 左下角区域line > column，右上角区域line < column
        const startX = line >= column ? 0 : column - line
        const startY = line >= column ? line - column : 0
        for (let i = 0; i < count - (Math.max(startX, startY)); i++) {
            const o = list.find(v => v.x == (startX + i) * grid && v.y == (startY + i) * grid)
            diagonalRelativeDown.push(o)
        }
        if (diagonalRelativeDown.length < 5) return null
        for (let i = 0; i < diagonalRelativeDown.length; i++) {
            const item = diagonalRelativeDown[i]
            if (line < item.y / grid || line > item.y / grid + 4) continue
            const select = diagonalRelativeDown.slice(i, i + 5)
            if(!select || select.length < 5) break
            const result = select.every(v => v.down == down)
            if (!result) continue
            return {
                winner: down,
                successList: diagonalRelativeDown.slice(i, i + 5),
            }
        }

        // 如果棋盘已经落满棋子，但是都未取得胜利，则比赛平局
        const isAllDown = list.every(v => v.down)
        if (isAllDown) {
            return {
                winner: null,
                successList: null,
            }
        }

        // 如果黑白双方都没获胜且没平局，就返回空
        return null
    }

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
        if (gameOver) return

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
            // 使用圆环渐变色，增加棋子的立体感和光泽感
            const gradient = ctx.createRadialGradient(positionX - size / 2, positionY - size / 2, 0, positionX - size / 2, positionY - size / 2, size * 1.5)
            gradient.addColorStop(0, isBlack ? '#ccc' : '#c9c9c9')
            gradient.addColorStop(1, isBlack ? '#000' : '#fff')
            ctx.fillStyle = gradient
            ctx.moveTo(positionX, positionY)
            ctx.arc(positionX, positionY, size, 0, Math.PI * 2)
            ctx.fill()
            // 更新落子情况
            downList = downList.map(v => v.x == positionX && v.y == positionY ? { ...v, down: isBlack ? 1 : 2 } : v)
            // 检查游戏是否结束，即是否有人胜出或失败或平局，如果有，就返回结果
            const result = checkGameResult(positionX, positionY, downList, isBlack)
            if (result) {
                gameOver = true
                console.log(result)
                // 如果分出了胜负，非平局
                if (result.winner) {
                    // 把胜利的五子连珠高亮
                    result.successList.forEach(v => {
                        ctx.beginPath()
                        const gradient = ctx.createRadialGradient(v.x - size / 2, v.y - size / 2, 0, v.x - size / 2, v.y - size / 2, size * 1.5)
                        gradient.addColorStop(0, '#f5f5f5')
                        gradient.addColorStop(1, '#c84a5f')
                        ctx.fillStyle = gradient
                        ctx.arc(v.x, v.y, size, 0, Math.PI * 2)
                        ctx.fill()
                    })
                } else {
                    // 平局
                }
                playEnd()
                return
            }
            // 下一次落子的颜色跟当前颜色相反
            isBlack = !isBlack
        }
    })

    const init = () => {
        // 显示开始游戏弹框
        $('.dialog, .dialog1').show()
    }

    init()
})