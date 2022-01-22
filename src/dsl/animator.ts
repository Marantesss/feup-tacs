import { AnimType, KeyframeObject, ShapeObject, ShapeType } from "./language";

class Animator {
  public ctx;

  constructor(
    public shapes: Array<Shape>,
    public animations: Map<string, Keyframe>,
    public canvas
  ) {
    this.ctx = canvas.getContext("2d");
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
  scale: { x: number; y: number };
  scale0: { x: number; y: number };
  rotation: number;
  rotation0: number;
  color0: string;
  position0: { x: number; y: number };
  opacity: number;
  opacity0: number;

  constructor(shape: ShapeObject) {
    this.id = shape.id;
    this.type = shape.type;
    this.color = shape.color;
    this.position = shape.position;
    this.size = shape.size;
    this.animation = shape.animation;

    this.scale = { x: 1, y: 1 };
    this.scale0 = { ...this.scale };
    this.rotation = 0;
    this.rotation0 = this.rotation;
    this.position0 = { ...this.position };
    this.startTime = 0;
    this.activeKeyframe = 0;
    this.color0 = this.color;
    this.opacity = 100;
    this.opacity0 = this.opacity;
  }

  public abstract draw(ctx);

  public update(now, animations: Map<String, Keyframe>) {
    if (this.animation.length === 0) {
      return
    }

    const { time, type, position, scale, rotation, opacity, color } = animations.get(
      this.animation[this.activeKeyframe]
    );

    let runtime = now - this.startTime;
    let progress = time ? runtime / (time * 1000) : 1;
    progress = Math.min(progress, 1);

    if (type === "slerp") {
      progress = (Math.sin(progress * Math.PI - Math.PI / 2) + 1) / 2;
    }

    this.position = position ? {
      x:
        this.position0.x +
        (position.x - this.position0.x) * progress,
      y:
        this.position0.y +
        (position.y - this.position0.y) * progress
    } : this.position;
    this.scale = scale ? {
      x: this.scale0.x + (scale.x - this.scale0.x) * progress,
      y: this.scale0.y + (scale.y - this.scale0.y) * progress
    } : this.scale;
    this.rotation = rotation ?
      this.rotation0 + (rotation - this.rotation0) * progress : this.rotation;
    this.opacity = opacity ?
      this.opacity0 + (opacity - this.opacity0) * progress : this.opacity;


    if (color) {
      const ah = parseInt(this.color0.replace(/#/g, ""), 16),
        ar = ah >> 16,
        ag = (ah >> 8) & 0xff,
        ab = ah & 0xff,
        bh = parseInt(color.replace(/#/g, ""), 16),
        br = bh >> 16,
        bg = (bh >> 8) & 0xff,
        bb = bh & 0xff,
        rr = ar + progress * (br - ar),
        rg = ag + progress * (bg - ag),
        rb = ab + progress * (bb - ab);

      this.color =
        "#" +
        (((1 << 24) + (rr << 16) + (rg << 8) + rb) | 0).toString(16).slice(1);
    }

    if (this.activeKeyframe === this.animation.length - 1) {
      return;
    }

    if (progress >= 1) {
      this.position0.x = this.position.x;
      this.position0.y = this.position.y;
      this.scale0 = this.scale;
      this.rotation0 = this.rotation;
      this.color0 = this.color;
      this.opacity0 = this.opacity;

      if (this.activeKeyframe < this.animation.length - 1) {
        this.startTime = now;
        this.activeKeyframe++;
      }
    }
  }
}

class Circle extends Shape {
  public draw(ctx) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.scale(this.scale.x, this.scale.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = this.opacity / 100;

    ctx.beginPath();
    ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

class Square extends Shape {
  public draw(ctx) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.scale(this.scale.x, this.scale.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = this.opacity / 100;

    ctx.beginPath();
    ctx.rect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

class Triangle extends Shape {
  public draw(ctx) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.scale(this.scale.x, this.scale.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = this.opacity / 100;

    ctx.beginPath();
    ctx.moveTo(-this.size / 2, (Math.sqrt(3) / 6) * this.size);
    ctx.lineTo(0, (-Math.sqrt(3) / 3) * this.size);
    ctx.lineTo(this.size / 2, (Math.sqrt(3) / 6) * this.size);
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
  scale: { x: number; y: number };
  position: { x: number; y: number };
  time: number;
  rotation: number;
  opacity: number;

  constructor(keyframe: KeyframeObject) {
    this.id = keyframe.id;
    this.type = keyframe.type;
    this.color = keyframe.color;
    this.scale = keyframe.scale;
    this.position = keyframe.position;
    this.time = keyframe.time;
    this.rotation = keyframe.rotation;
    this.opacity = keyframe.opacity;
  }
}

export { Animator, Shape, Keyframe, Circle, Square, Triangle };
