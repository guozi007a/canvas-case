$(function ($) {
    /** @type {HTMLCanvasElement} */
    // 是否抓取(按下)了擦除滑块
    let isClearing = false
    // 按下滑块的初始位置
    let clearX = 0
    
    // 搜索
    $('.search').click(function () {
        const val = $('.inp').val().trim()
        if (!val) {
            toast('请先输入一个汉字哦~')
            return
        }
        if (val.length > 1) {
            toast('每次只能搜索一个汉字哦~')
            return
        }
        const reg = /[0-9a-zA-Z`~!@#$%^&\*()（）：；‘’“”:;'"{}\[\]\?,，。\.\+-\/→←\\、]/
        if (reg.test(val)) {
            toast('只支持搜索汉字哦~')
            return
        }
        const url = ht[val]
        if (!url) {
            toast('很遗憾，暂无匹配动态笔画~')
            $('.word_gif').hide()
            $('.temp').show().text(val)
            return
        }
        $('.temp').hide()
        $('.word_gif').show().attr('src', url)
    })

    // 按下擦除滑块 激活拖拽
    $('.clear').mousedown(function (e) {
        isClearing = true
        clearX = e.offsetX
    })
    // 移动擦除滑块
    $('.clear').mousemove(function (e) {
        if (isClearing) {
            const x = e.offsetX
            const le = $(this).position().left
            const p = le + x - clearX
            const w = $('.bar1').width() + x - clearX
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
})