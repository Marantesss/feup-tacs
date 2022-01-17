class Animator {
    constructor(shapes, ctx) {
        this.shapes = shapes;
        this.ctx = ctx;
    }

    animate(timestamp) {
        const now = timestamp || new Date().getTime();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.shapes.forEach(shape => {
            shape.draw(this.ctx);
            shape.update(now);
        })

        window.requestAnimationFrame((timestamp) => this.animate(timestamp));
    }
}

class Shape {
    constructor(x, y, color, keyframes) {
        this.x = x;
        this.x0 = x;
        this.y = y;
        this.y0 = y;
        this.color = color;
        this.color0 = color;
        this.keyframes = keyframes;
        this.activekf = 0;
        this.starttime = 0;
    }

    draw(ctx) {
        console.log(ctx);
    }

    update(now) {
        const runtime = now - this.starttime;
        let progress = runtime / this.keyframes[this.activekf].time;
        progress = Math.min(progress, 1);

        this.x = this.x0 + (this.keyframes[this.activekf].x - this.x0) * progress;
        this.y = this.y0 + (this.keyframes[this.activekf].y - this.y0) * progress;

        const ah = parseInt(this.color0.replace(/#/g, ''), 16),
            ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
            bh = parseInt(this.keyframes[this.activekf].color.replace(/#/g, ''), 16),
            br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
            rr = ar + progress * (br - ar),
            rg = ag + progress * (bg - ag),
            rb = ab + progress * (bb - ab);

        this.color = '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);

        if (progress >= 1) {
            this.x0 = this.x;
            this.y0 = this.y;
            this.color0 = this.color;

            if (this.activekf < this.keyframes.length - 1) {
                this.starttime = now;
                this.activekf++;
            }
        }

        return progress;
    }
}

class Circle extends Shape {
    constructor(x, y, radius, color, keyframes) {
        super(x, y, color, keyframes);
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

    update(now) {
        const progress = super.update(now);
        // this.radius = this.radius0 + (this.radius0 * this.keyframes[this.activekf].scale - this.radius0) * progress;

        // if (progress >= 1) {
        //     this.radius0 = this.radius;
        // }
    }
}

class Square extends Shape {
    constructor(x, y, side, color, keyframes) {
        super(x, y, color, keyframes);
        this.side = side;
        this.side0 = side;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.x - this.side / 2, this.y - this.side / 2, this.side, this.side);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update(now) {
        const progress = super.update(now);
        // this.side = this.side0 + (this.side0 * this.keyframes[this.activekf].scale - this.side0) * progress;

        // if (progress >= 1) {
        //     this.side0 = this.side;
        // }
    }
}

class Keyframe {
    constructor(type, color, x, y, scale, time) {
        this.type = type;
        this.color = color;
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.time = time;
    }
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const keyframe1 = new Keyframe('linear', '#00ff00', 200, 250, 2, 2000);
const keyframe2 = new Keyframe('linear', '#ffa500', 10, 150, 0.5, 3000);
const keyframe3 = new Keyframe('linear', '#000000', 250, 10, 4, 1000);
const keyframes1 = [keyframe1, keyframe2];
const keyframes2 = [keyframe2, keyframe3];

const circle = new Circle(100, 100, 25, '#ff0000', keyframes1);
const square = new Square(150, 200, 50, '#0000ff', keyframes2);
const shapes = [circle, square];

const animator = new Animator(shapes, ctx);

window.requestAnimationFrame(function (timestamp) {
    animator.shapes.forEach(shape => shape.starttime = timestamp || new Date().getTime())
    animator.animate(timestamp);
});
