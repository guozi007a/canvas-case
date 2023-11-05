$(function ($) {
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById('canvas')
    // 在频繁使用getImageData的情况下，设置willReadFrequently为true,大幅节省内存
    const ctx = canvas.getContext('2d', { willReadFrequently: true })

    const img = new Image()
    // 项目地址必须有域名，不然无法实现图片选择器。
    // 如果图片跨域，就加上下面这句
    // img.crossOrigin = "anonymous"
    img.src = './dilireba03.webp'

    img.onload = function () {
        canvas.width = img.width
        canvas.height = img.height

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    }

    $('#canvas').mousemove(function (e) {
        const px = e.pageX
        const py = e.pageY

        // 取1像素区域内的颜色对象
        const imageData = ctx.getImageData(px, py, 1, 1)
        const d = imageData.data
        const c = `rgba(${d[0]}, ${d[1]}, ${d[2]}, ${d[3] / 255})`
        
        $('body').css('backgroundColor', c)
    })
})