var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var raf;
var translation = { x: 200, y: 250 };

var circle = {
    x: 100,
    y: 100,
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
    circle.x += (circle.x < translation.x ? 1 : (circle.x > translation.x ? -1 : 0));
    circle.y += (circle.y < translation.y ? 1 : (circle.y > translation.y ? -1 : 0));
    raf = window.requestAnimationFrame(translate);
}

raf = window.requestAnimationFrame(translate);
