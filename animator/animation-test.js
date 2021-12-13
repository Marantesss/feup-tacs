var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var raf;
var translation = { x: 200, y: 250 };

var circle = {
    x: 100,
    y: 100,
    vx: 0,
    vy: 0,
    radius: 25,
    color: 'red',
    draw: function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
};

function translate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circle.draw();
    if (circle.x != translation.x)
        circle.x += circle.vx;
    if (circle.y != translation.y)
        circle.y += circle.vy;
    raf = window.requestAnimationFrame(translate);
}

circle.vx = (translation.x - circle.x) / 100
circle.vy = (translation.y - circle.y) / 100

raf = window.requestAnimationFrame(translate);
