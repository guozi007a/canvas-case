window.onload = function () {
    const getX = (t) => 6 * (12 * Math.sin(t) - 4 * Math.sin(3 * t))
    const getY = (t) => -6 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))

    const drawHeart = () => {
        const canvas = document.getElementById('canvas')
        const ctx = canvas.getContext('2d')

        let radian = 0
        let radian_add = Math.PI / 180

        ctx.beginPath()
        ctx.translate(150, 100)
        ctx.moveTo(getX(radian), getY(radian))
        while (radian <= Math.PI * 2) {
            radian += radian_add
            X = getX(radian)
            Y = getY(radian)
            ctx.lineTo(X, Y)
            ctx.strokeStyle = "red"
            ctx.fillStyle = 'red'
            ctx.fill()
            ctx.stroke()
        }
    }

    drawHeart()
}