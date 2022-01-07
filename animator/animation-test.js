var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var raf;
var starttime;
var translation = { x: 200, y: 250, time: 2000 };

var square = {
    x: 100,
    y: 100,
    side: 25,
    color: 'red',
    draw: function () {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.side, this.side);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
};

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

function translate(timestamp, x0, y0) {
    var timestamp = timestamp || new Date().getTime();
    var runtime = timestamp - starttime;
    var progress = runtime / translation.time;
    progress = Math.min(progress, 1);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circle.draw();

    circle.x = x0 + (distX * progress);
    circle.y = y0 + (distY * progress);

    if (runtime < translation.time) {
        raf = window.requestAnimationFrame(function (timestamp) {
            translate(timestamp, x0, y0);
        });
    }
}

var distX = translation.x - circle.x
var distY = translation.y - circle.y

raf = window.requestAnimationFrame(function (timestamp) {
    starttime = timestamp || new Date().getTime()
    translate(timestamp, circle.x, circle.y)
});
