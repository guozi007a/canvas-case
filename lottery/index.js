$(function ($) {
    // 奖品列表
    let list = []
    // 已经抽过的数字列表
    let usedNums = []
    // 要抽多少个奖品
    let awardCounts = 7

    // 显示设置奖品数量
    $('.inp').on('input', function (e) {
        const val = e.target.value.trim()
        const str = val.replace(/;|；/g, '__')
        list = str.split('__').filter(Boolean)

        $('.count span').text(list.length)
    })

    // 抽奖
    $('.lottery').click(function () {
        if (!list.length) {
            toast('奖品列表不能为空~')
            return
        }
        $('.list').empty()
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