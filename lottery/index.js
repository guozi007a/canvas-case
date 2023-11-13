$(function ($) {
    // 总的奖品数量
    let total = 0
    // 奖品列表
    let list = []
    // 已经抽过的数字列表
    let usedNums = []
    // 要抽多少个奖品
    let awardCounts = 0

    // 显示设置奖品数量
    $('.inp').on('input', function (e) {
        const val = e.target.value.trim()
        const str = val.replace(/;|；/g, '__')
        list = str.split('__').filter(Boolean)

        $('.count span').text(list.length)
    })

    // 抽奖
    $('.lottery').click(function () {
        total = $('.total').val()
        awardCounts = $('.select').val()

        if (!total) {
            toast('请输入奖品总数！')
            return
        }
        if (!list.length) {
            toast('奖品列表不能为空~')
            return
        }
        if (!awardCounts) {
            toast('请选择要抽取的奖品数量！')
            return
        }
        if (list.length != total) {
            toast('奖品总数不匹配！')
            return
        }
        $('.list').empty()
        // 如果奖品列表数少于要抽取的奖品数，就将全部的奖品列表都当作奖品
        if (list.length <= awardCounts) {
            for (let i = 0; i < list.length; i++) {
                $(`<li>${list[i]}</li>`).appendTo($('.list'))
            }
            return
        }
        usedNums = []
        while (usedNums.length <= awardCounts - 1) {
            // 随机数
            const ran = Math.floor(Math.random() * list.length)
            if (usedNums.includes(ran)) continue
            $(`<li>${list[ran]}</li>`).appendTo($('.list'))

            usedNums.push(ran)
        }
    })

    const init = () => {
        $('.count span').text('0')
    }

    init()
})