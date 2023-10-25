$(function ($) {
    const canvas = $('#canvas')[0]
    const ctx = canvas.getContext('2d')

    const clock = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.save()
        ctx.strokeStyle = '#325FA2'
        ctx.lineWidth = 5
        
        ctx.beginPath()
        ctx.arc(0, 0, 120, 0, Math.PI * 2)
        ctx.stroke()
        
        ctx.restore()

    }

    clock()
})