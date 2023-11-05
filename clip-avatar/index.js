$(function ($) {
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    // 画布尺寸
    const cs = 400
    canvas.width = canvas.height = cs
    // 上传的图片
    let img = null
    // 裁剪的圆形半径
    const cr = 120
    // 拖拽鼠标开始位置
    let sx = sy = 0
    // 拖拽鼠标结束位置
    let ex = ey = 0

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

            img = new Image()
            img.src = this.result

            preClip()
        }
    })

    // 将上传的图片，放到画布上，准备裁剪
    const preClip = () => {
        const mw = Math.floor(Math.min(cs, img.width))
        const mh = Math.floor(Math.min(cs, img.height))
        // 画图片
        ctx.drawImage(img, 0, 0, mw, mh, 0, 0, mw, mh)
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
        ctx.drawImage(
            img,
            Math.floor((cs - cr * 2) / 2),
            Math.floor((cs - cr * 2) / 2),
            cr * 2,
            cr * 2,
            Math.floor((cs - cr * 2) / 2),
            Math.floor((cs - cr * 2) / 2),
            cr * 2,
            cr * 2,
        )
        ctx.restore()

        $('#canvas').css('cursor', 'move')
        $('.preAvatar').width(cr * 2).height(cr * 2)
    }

    // 拖拽
    $('#canvas').mousedown(function (e) {
        console.log(`(${e.offsetX}, ${e.offsetY})`)
        sx = Math.floor(e.offsetX)
        sy = Math.floor(e.offsetY)

        $(this).mousemove(function (e) {
            ex = Math.min(Math.floor(e.offsetX), cs)
            ey = Math.min(Math.floor(e.offsetY), cs)
        })
    })

    $('#canvas').mouseup(function (e) {
        ex = Math.min(Math.floor(e.offsetX), cs)
        ey = Math.min(Math.floor(e.offsetY), cs)
    })
})