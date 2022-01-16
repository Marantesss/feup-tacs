import { transpiler } from "./analyzer";
import { AnimType, KeyframeObject, ShapeObject, ShapeType } from "./language";

class Animator {
  constructor(public shapes, public animations: Map<string, Keyframe>, public ctx) {}

  animate(timestamp) {
    const now = timestamp || new Date().getTime();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.shapes.forEach((shape) => {
      shape.draw(this.ctx);
      shape.update(now, this.animations);
    });

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
  color0: string;
  position0: { x: number; y: number };


  constructor(shape: ShapeObject) {
    this.id = shape.id;
    this.type = shape.type;
    this.color = shape.color;
    this.position = shape.position;
    this.size = shape.size;
    this.animation = shape.animation;

    this.position0 = shape.position;
    this.startTime = 0;
    this.activeKeyframe = 0;
    this.color0 = shape.color;
  }

  public abstract draw(ctx);

  public update(now, animations: Map<String, Keyframe>) {
    const currentAnimation = animations.get(this.animation[this.activeKeyframe])
    let runtime = now - this.startTime;
    let progress = runtime / currentAnimation.time;
    progress = Math.min(progress, 1);

    this.position.x = this.position0.x + (currentAnimation.position.x - this.position0.x) * progress;
    this.position.y = this.position0.y + (currentAnimation.position.y - this.position0.y) * progress;
    this.color = this.color0;

    if (progress >= 1) {
      this.position0.x = this.position.x;
      this.position0.y = this.position.y;
      this.color0 = this.color;

      if (this.activeKeyframe < this.animation.length - 1) {
        this.startTime = now;
        this.activeKeyframe++;
      }
    }

    return progress;
  }
}

class Circle extends Shape {
  private radius: number;
  private radius0: number;

  constructor(shape: ShapeObject) {
    super(shape);
    this.radius = shape.size / 2;
    this.radius0 = shape.size / 2;
  }

  public draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  public update(now, animations: Map<String, Keyframe>): number {
    const progress = super.update(now, animations);
    // this.radius = this.radius0 + (this.radius0 * this.keyframes[this.activeKeyframe].scale - this.radius0) * progress;

    // if (progress >= 1) {
    //     this.radius0 = this.radius;
    // }
    return progress
  }
}

class Square extends Shape {
  private side: number;
  private side0: number;

  constructor(shape: ShapeObject) {
    super(shape);
    this.side = shape.size;
    this.side0 = shape.size;
  }

  // TODO: center is not x and y
  public draw(ctx) {
    ctx.beginPath();
    ctx.rect(this.position.x, this.position.y, this.side, this.side);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  public update(now, animations: Map<String, Keyframe>): number {
    const progress = super.update(now, animations);
    // this.side = this.side0 + (this.side0 * this.keyframes[this.activeKeyframe].scale - this.side0) * progress;

    // if (progress >= 1) {
    //     this.side0 = this.side;
    // }
    return progress
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

const teste = `\
Shape:
id: ola
type: circle
color: red
position:[0,0]
size: 20px
animation: [1]

Shape:
id: quadrado1
type: square
color: purple
position:[1,2]
size: 132px
animation: [   1 ,     2     ]

Keyframe:
id: 1
type: slerp
color: red
scale: 1
position: [0,1]
time: 2s

Keyframe:
id: 2
type: lerp
color: green
scale: 2
position: [5,2]
time: 5s
`;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const animator = new Animator(transpiler.shapes, transpiler.keyframes, ctx);

window.requestAnimationFrame(function (timestamp) {
  animator.shapes.forEach(
    (shape) => (shape.startTime = timestamp || new Date().getTime())
  );
  animator.animate(timestamp);
});

export { Animator, Shape, Keyframe, Circle, Square };
