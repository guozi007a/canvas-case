$(function ($) {
    /** @type {HTMLCanvasElement} */
    
    // 搜索
    $('.search').click(function () {
        const val = $('.inp').val()
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
})