class Animator {
    constructor(shapes, ctx) {
        this.shapes = shapes;
        this.ctx = ctx;
    }

    animate(timestamp) {
        const now = timestamp || new Date().getTime();
        const runtime = now - starttime;
        let progress = runtime / translation.time;
        progress = Math.min(progress, 1);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.shapes.forEach(shape => {
            shape.draw(this.ctx);
            shape.update(progress);
        })

        if (runtime < translation.time) {
            raf = window.requestAnimationFrame((timestamp) => this.animate(timestamp));
        }
    }
}

class Shape {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.x0 = x;
        this.y0 = y;
        this.color = color;
        this.color0 = color;
    }

    draw(ctx) {
        console.log(ctx);
    }

    update(progress) {
        this.x = this.x0 + (translation.x - this.x0) * progress;
        this.y = this.y0 + (translation.y - this.y0) * progress;
        this.color = this.color0;
    }
}

class Circle extends Shape {
    constructor(x, y, radius, color) {
        super(x, y, color);
        this.radius = radius;
        this.radius0 = radius;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update(progress) {
        super.update(progress);
        this.radius = this.radius0;
    }
}

class Square extends Shape {
    constructor(x, y, side, color) {
        super(x, y, color)
        this.side = side;
        this.side0 = side;
    }

    // TODO: center is not x and y
    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.side, this.side);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update(progress) {
        super.update(progress);
        this.side = this.side0 + 0 * progress;
    }
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let raf;
let starttime;

const translation = { x: 200, y: 250, time: 2000 };
const circle = new Circle(100, 100, 25, 'red');
const square = new Square(150, 200, 50, 'blue');

const shapes = [circle, square];

const animator = new Animator(shapes, ctx);

raf = window.requestAnimationFrame(function (timestamp) {
    starttime = timestamp || new Date().getTime()
    animator.animate(timestamp);
});
