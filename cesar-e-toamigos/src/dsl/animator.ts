import { AnimType, KeyframeObject, ShapeObject, ShapeType } from "./language";

class Animator {
  public ctx;

  constructor(public shapes: Array<Shape>, public animations: Map<string, Keyframe>, public canvas) {
    this.ctx = canvas.getContext('2d');
  }

  animate(timestamp) {
    const now = timestamp || new Date().getTime();

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();
    this.shapes.forEach((shape) => {
      shape.draw(this.ctx);
      shape.update(now, this.animations);
    });
    this.ctx.restore();

    window.requestAnimationFrame((timestamp) => this.animate(timestamp));
  }
}

abstract class Shape implements ShapeObject {
  id: string;
  type: ShapeType;
  color: string;
  position: { x: number; y: number };
  size: number;
  animation: string[];

  // animations
  startTime: number = 0;
  activeKeyframe: number = 0;
  scale: number;
  scale0: number;
  color0: string;
  position0: { x: number; y: number };


  constructor(shape: ShapeObject) {
    this.id = shape.id;
    this.type = shape.type;
    this.color = shape.color;
    this.position = shape.position;
    this.size = shape.size;
    this.animation = shape.animation;

    this.scale = 1;
    this.scale0 = this.scale;
    this.position0 = { ...shape.position };
    this.startTime = 0;
    this.activeKeyframe = 0;
    this.color0 = shape.color;
  }

  public abstract draw(ctx);

  public update(now, animations: Map<String, Keyframe>) {
    const currentAnimation = animations.get(this.animation[this.activeKeyframe])
    let runtime = now - this.startTime;
    let progress = runtime / (currentAnimation.time * 1000);
    progress = Math.min(progress, 1);

    this.position.x = this.position0.x + (currentAnimation.position.x - this.position0.x) * progress;
    this.position.y = this.position0.y + (currentAnimation.position.y - this.position0.y) * progress;
    this.scale = this.scale0 + (this.scale0 * currentAnimation.scale - this.scale0) * progress;

    const ah = parseInt(this.color0.replace(/#/g, ''), 16),
      ar = ah >> 16, ag = (ah >> 8) & 0xff, ab = ah & 0xff,
      bh = parseInt(currentAnimation.color.replace(/#/g, ''), 16),
      br = bh >> 16, bg = (bh >> 8) & 0xff, bb = bh & 0xff,
      rr = ar + progress * (br - ar),
      rg = ag + progress * (bg - ag),
      rb = ab + progress * (bb - ab);

    this.color = '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);

    if (this.activeKeyframe === this.animation.length - 1) {
      return;
    }

    if (progress >= 1) {
      this.position0.x = this.position.x;
      this.position0.y = this.position.y;
      this.scale0 = this.scale;
      this.color0 = this.color;

      if (this.activeKeyframe < this.animation.length - 1) {
        this.startTime = now;
        this.activeKeyframe++;
      }
    }
  }
}

class Circle extends Shape {
  private radius: number;

  constructor(shape: ShapeObject) {
    super(shape);
    this.radius = shape.size / 2;
  }

  public draw(ctx) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.scale(this.scale, this.scale);
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

class Square extends Shape {
  private side: number;

  constructor(shape: ShapeObject) {
    super(shape);
    this.side = shape.size;
  }

  public draw(ctx) {
    ctx.save();
    ctx.translate(this.position.x - this.side / 2, this.position.y - this.side / 2);
    ctx.scale(this.scale, this.scale);
    ctx.beginPath();
    ctx.rect(0, 0, this.side, this.side);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

class Keyframe implements KeyframeObject {
  id: string;
  type: AnimType;
  color: string;
  scale: number;
  position: { x: number; y: number };
  time: number;

  constructor(keyframe: KeyframeObject) {
    this.id = keyframe.id;
    this.type = keyframe.type;
    this.color = keyframe.color;
    this.scale = keyframe.scale;
    this.position = keyframe.position;
    this.time = keyframe.time;
  }
}

export { Animator, Shape, Keyframe, Circle, Square };
