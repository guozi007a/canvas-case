$(function ($) {
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    // 适配手机端断点
    const point = 1080
    // 是否需要适配，即当前设备尺寸是否小于等于断点尺寸，
    // 因为该应用主要用于手机端，所以默认为true
    let isFlexible = true
    // rem
    let rem = 0
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

    // 响应式尺寸，适配不同设备尺寸。初始化和改变尺寸时调用
    const flexible = () => {
        // 检测时，也跟踪检测是否需要适配
        // 进行手机适配时，使用html的clientWidth要比window.innerWidth要更靠谱
        const ddc = document.documentElement.clientWidth
        isFlexible = ddc <= point
        if (isFlexible) {
            rem = ddc / point * 10
            console.log(rem)
            document.documentElement.style.fontSize = rem + 'px'
        }

        // 当改变设备尺寸时，要检测需要修改尺寸的元素和属性
        cs = isFlexible ? Math.floor(60 * rem) : 300
        $(canvas).width(cs).height(cs)
        canvas.width = canvas.height = Math.floor(cs * dpr)
        ctx.clearRect(0, 0, cs, cs)
        ctx.save()
        ctx.scale(dpr, dpr)

        ctx.strokeStyle = '#333'
        ctx.lineWidth = isFlexible ? Math.ceil(1.6 * rem) : 10
        ctx.lineCap = 'round'

        // 如果此时存在分享使用的临时画布，也要修改画布尺寸
    }

    flexible()

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

    const enterSearch = (e) => {
        e.key == 'Enter' && $('.inp').is(':focus') && search()
    }

    const clearStart = (e) => {
        isClearing = true
        clearX = isFlexible ? e.touches[0].pageX : e.pageX
    }

    const clearMove = (e) => {
        if (isClearing) {
            // 在手机端进行touchmove操作时，会导致页面的切换和滑动，需要阻止该默认情况
            isFlexible && e.preventDefault()
            const x = isFlexible ? e.touches[0].pageX : e.pageX
            const le = $('.clear').position().left
            const p = le + x - clearX
            const w = $('.bar1').width() + x - clearX
            clear(le, p)
            if (p > cs) {
                $('.clear').css('left', `${cs}px`)
                $('.bar1').width(cs + $('.clear').width() / 2)
                return
            }
            if (p < 0) {
                $('.clear').css('left', '0px')
                $('.bar1').width($('.clear').width() / 2)
                return
            }
            $('.clear').css('left', `${p}px`)
            $('.bar1').width(w)

            // 实时更新起始位置，确保滑块的位置也是实时更新的
            clearX = x
        }
    }

    const clearEnd = () => {
        isClearing = false
    }

    const writeStart = (e) => {
        isWriting = true
        // 鼠标按下的位置作为起点
        wx = isFlexible ? Math.floor(e.touches[0].pageX - $('.box').offset().left) : e.offsetX
        wy = isFlexible ? Math.floor(e.touches[0].pageY - $('.box').offset().top) : e.offsetY
        // 每次开始写字，都是绘制一条新的路径
        ctx.beginPath()
    }

    const writeMove = (e) => {
        if (isWriting) {
            // 在手机端进行touchmove操作时，会导致页面的切换和滑动，需要阻止该默认情况
            isFlexible && e.preventDefault()
            const x = isFlexible ? Math.floor(e.touches[0].pageX - $('.box').offset().left) : e.offsetX
            const y = isFlexible ? Math.floor(e.touches[0].pageY - $('.box').offset().top) : e.offsetY
            // 画线
            ctx.moveTo(wx, wy)
            ctx.lineTo(x, y)
            ctx.stroke()
            // 上次移动到的点作为下次开始画线的起点，让点和点相连，形成线
            wx = x
            wy = y
        }
    }

    const writeEnd = () => {
        isWriting = false
    }

    // 擦除 会有向左和向右移动擦除滑块的情况
    // sl--擦除线的起始位置
    // el--擦除线移动的结束位置
    const clear = (sl, el) => {
        // 这里需要注意的是，当适配手机时，擦除的宽度用Math.ceil来处理，不能使用Math.floor，
        // 这样可以避免因为精度问题导致的雪花效果，即中间有擦不干净的间隔斑点。
        ctx.clearRect(Math.min(sl, el), 0, Math.ceil(Math.abs(el - sl)), cs)
    }

    // 盖章分享
    const share = () => {
        // 创建一个临时的画布，用于画分享图
        const $canvas = document.createElement('canvas')
        $canvas.setAttribute('id', '__canvas')
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
                // 100*100的印章在图片上要显示的尺寸
                const rss = isFlexible ? Math.ceil(20 * rem) : 100
                $ctx.drawImage($img, 0, 0, 100, 100, cs - rss - 20, cs - rss - 20, rss, rss)
                const $url = $canvas.toDataURL()
                $('.work').attr('src', $url)
                $('.dialog').show()
                // 完成全图绘图后，清空原来的画布，以免影响图片效果。
                // 同时销毁临时元素，释放占用的内存
                ctx.clearRect(0, 0, cs, cs)
                $($canvas).remove()
                $($tzg).remove()
                $($img).remove()
            }
        }
    }

    const dialogVisible = () => {
        $('.dialog').hide()
        $('.work').attr('src', '')
    }

    // 搜索
    $('.search').click(search)
    // 当输入框获取焦点时，按下enter键，可以完成搜索
    $(window).keydown(enterSearch)
    // 按下擦除滑块 激活拖拽
    $('.clear').mousedown(clearStart)
    $('.clear').on('touchstart', clearStart)
    // 移动擦除滑块
    $('.clear').mousemove(clearMove)
    // 手机端默认passive为true,此时是不能通过e.preventDefault()阻止页面滑动或切换等默认行为的
    // 所以这里需要传参设置为false，以开启阻止默认行为
    $('.clear').on('touchmove', { passive: false }, clearMove)
    // 松开擦除滑块
    $('.clear').mouseup(clearEnd)
    $('.clear').on('touchend', clearEnd)
    // 鼠标移出轨道时，就失活了
    $('.track').mouseleave(clearEnd)
    // 开始写字
    $(canvas).mousedown(writeStart)
    $(canvas).on('touchstart', writeStart)
    // 写字
    $(canvas).mousemove(writeMove)
    $(canvas).on('touchmove', { passive: false }, writeMove)
    // 停止写字
    $(canvas).mouseup(writeEnd)
    $(canvas).mouseleave(writeEnd)
    $(canvas).on('touchend', writeEnd)
    $('.share span').click(share)
    $('.mask').click(dialogVisible)
    // 适配手机端
    window.addEventListener('resize', flexible)
})