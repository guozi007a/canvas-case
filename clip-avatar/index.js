$(function ($) {
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    // 画布尺寸
    const cs = 400
    canvas.width = canvas.height = cs
    // 裁剪的圆形半径
    const cr = 120
    // 拖拽鼠标开始位置
    let sx = sy = 0
    // 拖拽鼠标结束位置
    let ex = ey = 0
    // 开始拖拽时，图片的位置
    let il = it = 0
    // 是否可拖拽
    let isDragable = false
    // 未上传图片时，将src置空，不然获取到的src仍然是有值的
    $('.boxImg').attr('src', null)
    // 图片缩放比例，每次缩小为之前大小的0.95倍，放大为1.05倍
    let rate = 0.05

    // 上传图片
    $('.upload').click(function () {
        $('.upfile').click()
    })

    // 获取上传的图片
    $('.upfile').change(function (e) {
        // 上传的图片保存在原生的input的files属性中
        // console.log(e.target.files)
        // console.log($(this)[0].files)
        const files = e.target.files
        const file = files[0]
        
        // 将上传的图片，转换为图片地址，用于显示图片和操作
        const fr = new FileReader()
        file && fr.readAsDataURL(file)
        fr.onload = function () {
            $('.enlarge, .shrink, .preImg, .confirm').show()
            $('.boxImg').attr('src', this.result)

            preClip()

            sx = sy = ex = ey = il = it = 0
        }
    })

    // 上传图片后，画布加上遮罩
    const preClip = () => {
        // 加灰色遮罩
        ctx.save()
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
        ctx.fillRect(0, 0, cs, cs)
        ctx.restore()

        // 圆形部分显示原来的透明度
        ctx.save()
        ctx.beginPath()
        ctx.arc(cs / 2, cs / 2, cr, 0, Math.PI * 2)
        ctx.clip()
        ctx.clearRect( // 把圆形区域内的灰色遮罩清除
            Math.floor((cs - cr * 2) / 2),
            Math.floor((cs - cr * 2) / 2),
            cr * 2,
            cr * 2,
        )
        ctx.restore() // 一定要恢复到原来状态

        $('#canvas').css('cursor', 'move')
    }

    // 拖拽
    $('.box').mousedown(function (e) {
        if ($('.boxImg')[0].src) {
            sx = e.offsetX
            sy = e.offsetY
            il = $('.boxImg').position().left
            it = $('.boxImg').position().top
            isDragable = true
        }
    })

    $('.box').mousemove(function (e) {
        if (isDragable) {
            ex = e.offsetX
            ey = e.offsetY

            $('.boxImg').css({
                left: il + ex - sx,
                top: it + ey - sy,
            })
        }
    })

    // 结束拖拽
    $('.box').mouseup(function () {
        isDragable = false
    })

    // 放大
    $('.enlarge').click(function () {
        scaleImg(1)
    })

    // 缩小
    $('.shrink').click(function () {
        scaleImg(2)
    })

    // 缩放图片 1-放大 2-缩小 缩放时left和top不能变
    const scaleImg = (type) => {
        let iw = $('.boxImg').width()
        let ih = $('.boxImg').height()
        if (type == 1) {
            $('.boxImg').width(Math.floor(iw * (1 + rate)))
            $('.boxImg').height(Math.floor(ih * (1 + rate)))
        } else if (type == 2) {
            $('.boxImg').height(Math.floor(iw * (1 - rate)))
            $('.boxImg').height(Math.floor(ih * (1 - rate)))
        }
    }
})