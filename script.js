const width = 500
const height = 500
const radius = 200
const center = { x: 250, y: 250 }
const velmax = 90
const velmin = 1
const acc = -1
const jerk = -0.001
var offset = 0

const canvas = document.querySelector('#dpy')
const textarea = document.querySelector('#inp')
const spinbtn = document.querySelector('#spinbtn')
const ctx = canvas.getContext('2d')
spinbtn.addEventListener('click', () => spin())
textarea.addEventListener('input', () => parseInput(textarea.value))

let items = []

const sleep = ms => new Promise(r => setTimeout(r, ms));

const parseInput = value => {
    items = value.split('\n').filter(item => item != '')
    draw()
    console.log(items)
}

const hexfromstr = str => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash += str.charCodeAt(i) + ((hash << 5) - hash)
    }
    return '#' + (hash & 0xFFFFFF).toString(16).toUpperCase()
}

const torad = deg => {
    return deg * Math.PI / 180
}

const drawsector = (item, i, n) => {
    let angle = 360 / n
    let cangle = offset + angle * i
    ctx.save()
    ctx.fillStyle = hexfromstr(item)
    ctx.beginPath()
    ctx.moveTo(center.x, center.y)
    ctx.arc(center.x, center.y, radius, torad(cangle), torad(cangle + angle))
    ctx.lineTo(center.x, center.y)
    ctx.fill()
    // TEXT
    ctx.translate(center.x, center.y)
    ctx.rotate(torad(cangle) + torad(angle)/2 + torad(180))
    ctx.textAlign = "right"
    ctx.fillStyle = "#fff"
    ctx.font = "bold 30px sans-serif"
    ctx.fillText(item, -20, 10)
    ctx.restore()
}

const draw = () => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath()
    for (let i = 0; i < items.length; i++) {
        drawsector(items[i], i, items.length)
    }
    ctx.stroke()
}

const spin = async () => {
    var vel = velmax
    var nacc = acc
    for (; ;) {
        offset += vel
        offset %= 360
        if (vel > velmin) {
            vel += acc
        }
        if (nacc < 0) {
            nacc -= jerk
        } else {
            nacc = 0
        }
        draw()
        await sleep(50)
    }
}
