(function (window) {
    const toast = (text, delay = 1500) => {
        let wrap = $('.__toast')

        if (!wrap.length) {
            wrap = $('<div />')
                .addClass('__toast')
                .css({
                    position: 'fixed',
                    'z-index': 99,
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100vh',
                    display: 'flex',
                    'flex-direction': 'column',
                    'justify-content': 'center',
                    'align-items': 'center',
                    'gap': '6px',
                    'pointer-events': 'none',
                })
                .insertBefore($('script')[0])
        }

        const p = $('<p />')
            .addClass('__text')
            .text(text)
            .css({
                'box-sizing': 'border-box',
                'padding': '4px 10px 6px',
                'font-size': '14px',
                color: '#fff',
                'background-color': 'rgba(0, 0, 0, .5)',
                'word-break': 'break-all',
                'border-radius': '6px',
            })
            .appendTo(wrap)

        p
            .delay(delay)
            .animate({
                'margin-top': '-10px'
            }, 300)
            .fadeOut(300, function () {
                p.remove()
                if ($('.__text').length == 0) {
                    wrap.remove()
                }
            })
    }

    window.toast = toast
})(window)