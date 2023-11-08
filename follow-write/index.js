$(function ($) {
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    // 是否抓取(按下)了擦除滑块，或者是否可以拖拽滑块
    let isClearing = false
    // 按下滑块的初始位置
    let clearX = 0
    // 设备像素比
    const dpr = window.devicePixelRatio
    // 是否在写字或者是否可以写字
    let isWriting = false
    // 画布的尺寸
    let cs = 0
    // 每次开始写字的起点
    let wx = wy = 0

    // 搜索方法
    const search = () => {
        const val = $('.inp').val().trim()
        if (!val) {
            toast('请先输入一个汉字哦~')
            $('.inp').focus()
            return
        }
        if (val.length > 1) {
            toast('每次只能搜索一个汉字哦~')
            $('.inp').focus()
            return
        }
        const reg = /[0-9a-zA-Z`~!@#$%^&\*()（）：；‘’“”:;'"{}\[\]\?,，。\.\+-\/→←\\、]/
        if (reg.test(val)) {
            toast('只支持搜索汉字哦~')
            $('.inp').focus()
            return
        }
        const url = ht[val]
        // 搜索符合条件后，失去焦点
        $('.inp').blur()
        if (!url) {
            toast('很遗憾，暂无匹配动态笔画~')
            $('.word_gif').hide()
            $('.temp').show().text(val)
            return
        }
        toast('已匹配动态笔画啦！')
        $('.temp').hide()
        $('.word_gif').show().attr('src', url)
    }

    // 搜索
    $('.search').click(search)

    // 当输入框获取焦点时，按下enter键，可以完成搜索
    $(window).keydown(function (e) {
        e.key == 'Enter' && $('.inp').is(':focus') && search()
    })

    // 按下擦除滑块 激活拖拽
    $('.clear').mousedown(function (e) {
        isClearing = true
        clearX = e.pageX
    })
    // 移动擦除滑块
    $('.clear').mousemove(function (e) {
        if (isClearing) {
            const x = e.pageX
            const le = $(this).position().left
            const p = le + x - clearX
            const w = $('.bar1').width() + x - clearX
            clear(le, p)
            if (p > 300) {
                $(this).css('left', '300px')
                $('.bar1').width(330)
                return
            }
            if (p < 0) {
                $(this).css('left', '0px')
                $('.bar1').width(30)
                return
            }
            $(this).css('left', `${p}px`)
            $('.bar1').width(w)

            // 实时更新起始位置，确保滑块的位置也是实时更新的
            clearX = x
        }
    })
    // 松开擦除滑块
    $('.clear').mouseup(function () {
        isClearing = false
    })
    // 鼠标移出轨道时，就失活了
    $('.track').mouseleave(function () {
        isClearing = false
    })

    // 开始写字
    $(canvas).mousedown(function (e) {
        isWriting = true
        // 鼠标按下的位置作为起点
        wx = e.offsetX
        wy = e.offsetY
        // 每次开始写字，都是绘制一条新的路径
        ctx.beginPath()
    })

    // 写字
    $(canvas).mousemove(function (e) {
        if (isWriting) {
            const x = e.offsetX
            const y = e.offsetY
            // 画线
            ctx.moveTo(wx, wy)
            ctx.lineTo(x, y)
            ctx.stroke()
            // 上次移动到的点作为下次开始画线的起点，让点和点相连，形成线
            wx = x
            wy = y
        }
    })

    // 停止写字
    $(canvas).mouseup(function () {
        isWriting = false
    })
    $(canvas).mouseleave(function () {
        isWriting = false
    })

    // 擦除 会有向左和向右移动擦除滑块的情况
    // sl--擦除线的起始位置
    // el--擦除线移动的结束位置
    const clear = (sl, el) => {
        ctx.clearRect(Math.min(sl, el), 0, Math.floor(Math.abs(el - sl)), cs)
    }

    // 盖章分享
    const share = () => {
        // 创建一个临时的画布，用于画分享图
        const $canvas = document.createElement('canvas')
        const $ctx = $canvas.getContext('2d')

        $canvas.width = $canvas.height = cs

        // 先把田字格画进去
        const $tzg = new Image()
        $tzg.src = './tzg-green.svg'

        $tzg.onload = function () {
            $ctx.drawImage($tzg, 0, 0, cs, cs)
            // 再画刚写的字
            $ctx.drawImage(canvas, 0, 0, cs, cs)
            // 最后把印章盖上去
            const $img = new Image()
            $img.src = './seal.png'

            $img.onload = function () {
                $ctx.drawImage($img, 0, 0, 100, 100, 180, 180, 100, 100)
                const $url = $canvas.toDataURL()
                $('.work').attr('src', $url)
                $('.dialog').show()
                // 完成全图绘图后，销毁临时元素
                $($canvas).remove()
                $($tzg).remove()
                $($img).remove()
            }
        }
    }

    $('.share').click(share)

    $('.mask').click(function () {
        $('.dialog').hide()
        $('.work').attr('src', '')
    })

    const init = () => {
        $('#canvas').width(300).height(300)
        cs = canvas.width = canvas.height = Math.floor(300 * dpr)
        ctx.clearRect(0, 0, cs, cs)
        ctx.save()
        ctx.scale(dpr, dpr)

        ctx.strokeStyle = '#333'
        ctx.lineWidth = 10
        ctx.lineCap = 'round'
    }

    init()
})