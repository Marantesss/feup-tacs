import { Keyframe, Shape } from "./animator";

class Generator {
  private generateShape(shape: Shape): string {
    return `
      {
        id: '${shape.id}',
        type: '${shape.type}',
        color: '${shape.color}',
        position: { x: ${shape.position.x}, y: ${shape.position.y} },
        size: ${shape.size},
        animation: [${shape.animation.map(a => `'${a}'`)}],
        startTime: 0,
        activeKeyframe: 0,
        scale: { x: ${shape.scale.x}, y: ${shape.scale.y} },
        scale0: { x: ${shape.scale0.x}, y: ${shape.scale0.y} },
        rotation: ${shape.rotation},
        rotation0: ${shape.rotation0},
        color0: '${shape.color0}',
        position0: { x: ${shape.position0.x}, y: ${shape.position0.y} },
        opacity: ${shape.opacity},
        opacity0: ${shape.opacity0}
      }`.replace(/\s/g, "");
  }

  private generateKeyframes(keyframe: Keyframe): string {
    return `
      {
        id: '${keyframe.id}',
        type: '${keyframe.type}',
        color: '${keyframe.color}',
        position: { x: ${keyframe.position?.x}, y: ${keyframe.position?.y} },
        scale: { x: ${keyframe.scale?.x}, y: ${keyframe.scale?.y} },
        rotation: ${keyframe.rotation},
        opacity: ${keyframe.opacity},
        time: ${keyframe.time}
      }`.replace(/\s/g, "");
  }

  public generate(shapes: Array<Shape>, keyframes: Map<string, Keyframe>): string {
    return `\
const shapes = [
  ${shapes.map(shape => this.generateShape(shape)).join(',\n  ')}
];
const keyframes = new Map();
${Array.from(keyframes).map(([key, value]) => `keyframes.set('${key}', ${this.generateKeyframes(value)});`).join('\n')}

const animator = (canvasId) => {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');

  const obj = {};

  obj.animate = function(timestamp) {
    const now = timestamp || new Date().getTime();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    shapes.forEach((shape) => {
      switch (shape.type) {
        case "circle":
          drawCircle(shape);
          break;
        case "square":
          drawSquare(shape);
          break;
          case "triangle":
          drawTriangle(shape);
          break;
        default:
          break;
      }
      update(now);
    });
    ctx.restore();

    window.requestAnimationFrame((timestamp) => this.animate(timestamp));
  }

  const update = (now) => {
    shapes.forEach(shape => {
      if (shape.animation.length === 0) {
        return
      }

      const { time, type, position: {x, y}, scale, rotation, opacity, color } = keyframes.get(shape.animation[shape.activeKeyframe])
      let runtime = now - shape.startTime;
      let progress = time ? runtime / (time * 1000) : 1;
      progress = Math.min(progress, 1);

      if (type === "slerp") {
        progress = (Math.sin(progress * Math.PI - Math.PI / 2) + 1) / 2;
      }

      shape.position = x && y ? {
        x: shape.position0.x + (x - shape.position0.x) * progress,
        y: shape.position0.y + (y - shape.position0.y) * progress
      } : shape.position;
      shape.scale = scale ? {
        x: shape.scale0.x + (scale.x - shape.scale0.x) * progress,
        y: shape.scale0.y + (scale.y - shape.scale0.y) * progress
      } : shape.scale;
      shape.rotation = rotation ? shape.rotation0 + (rotation - shape.rotation0) * progress : shape.rotation;
      shape.opacity = opacity ? shape.opacity0 + (opacity - shape.opacity0) * progress : shape.opacity;

      if (color && color !== "undefined") {
        const ah = parseInt(shape.color0.replace(/#/g, ''), 16),
          ar = ah >> 16, ag = (ah >> 8) & 0xff, ab = ah & 0xff,
          bh = parseInt(color.replace(/#/g, ''), 16),
          br = bh >> 16, bg = (bh >> 8) & 0xff, bb = bh & 0xff,
          rr = ar + progress * (br - ar),
          rg = ag + progress * (bg - ag),
          rb = ab + progress * (bb - ab);

        shape.color = '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
      }

      if (shape.activeKeyframe === shape.animation.length - 1) {
        return;
      }

      if (progress >= 1) {
        shape.position0.x = shape.position.x;
        shape.position0.y = shape.position.y;
        shape.scale0.x = shape.scale.x;
        shape.scale0.y = shape.scale.y;
        shape.rotation0 = shape.rotation;
        shape.color0 = shape.color;
        shape.opacity0 = shape.opacity;

        if (shape.activeKeyframe < shape.animation.length - 1) {
          shape.startTime = now;
          shape.activeKeyframe++;
        }
      }
    })
  }

  const drawTriangle = (triangle) => {
    ctx.save();
    ctx.translate(triangle.position.x, triangle.position.y);
    ctx.scale(triangle.scale.x, triangle.scale.y);
    ctx.rotate(triangle.rotation * Math.PI / 180);
    ctx.globalAlpha = triangle.opacity / 100;

    ctx.beginPath();
    ctx.moveTo(-triangle.size / 2, Math.sqrt(3) / 6 * triangle.size);
    ctx.lineTo(0, -Math.sqrt(3) / 3 * triangle.size);
    ctx.lineTo(triangle.size / 2, Math.sqrt(3) / 6 * triangle.size);
    ctx.closePath();
    ctx.fillStyle = triangle.color;
    ctx.fill();
    ctx.restore();
  }

  const drawCircle = (circle) => {
    ctx.save();
    ctx.translate(circle.position.x, circle.position.y);
    ctx.scale(circle.scale.x, circle.scale.y);
    ctx.rotate(circle.rotation * Math.PI / 180);
    ctx.globalAlpha = circle.opacity / 100;

    ctx.beginPath();
    ctx.arc(0, 0, circle.size / 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = circle.color;
    ctx.fill();
    ctx.restore();
  }

  const drawSquare = (square) => {
    ctx.save();
    ctx.translate(square.position.x, square.position.y);
    ctx.scale(square.scale.x, square.scale.y);
    ctx.rotate(square.rotation * Math.PI / 180);
    ctx.globalAlpha = square.opacity / 100;

    ctx.beginPath();
    ctx.rect(-square.size / 2, -square.size / 2, square.size, square.size);
    ctx.closePath();
    ctx.fillStyle = square.color;
    ctx.fill();
    ctx.restore();
  }

  return obj;
}

const myAnimator = animator('canvas');
window.requestAnimationFrame((timestamp) => myAnimator.animate(timestamp));
`
  }
}

const generator = new Generator()

export { generator }
