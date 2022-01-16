import * as P from "parsimmon";
import { AnimType, KeyframeObject, language, ShapeObject, ShapeType } from "./language";

class Shape implements ShapeObject {
  id: string;
  type: ShapeType;
  color: string;
  position: { x: number; y: number; };
  size: number;
  animation: string[];

  constructor(shape: ShapeObject) {
    this.id = shape.id
    this.type = shape.type
    this.color = shape.color
    this.position = shape.position
    this.size = shape.size
    this.animation = shape.animation
  }

}

class Keyframe implements KeyframeObject {
  id: string;
  type: AnimType;
  color: string;
  scale: number;
  position: { x: number; y: number; };
  time: number;
  
  constructor(keyframe: KeyframeObject) {
    this.id = keyframe.id
    this.type = keyframe.type
    this.color = keyframe.color
    this.scale = keyframe.scale
    this.position = keyframe.position
    this.time = keyframe.time
  }
}

class Transpiler {
  private _language: P.Language = language;
  private _code: string;

  private _shapes: Array<Shape>;
  private _keyframes: Map<string, Keyframe>;

  public get shapes() {
    return this._shapes;
  }
  public get keyframes() {
    return this._keyframes;
  }

  constructor(code: string) {
    this._code = code

    this._shapes = []
    this._keyframes = new Map();
  }

  public parse(): void {
    const output = this._language.expr.tryParse(this._code);
    const { shapes, keyframes } = output

    shapes.forEach(shape => {
      this._shapes.push(new Shape(shape))
    });

    keyframes.forEach(keyframe => {
      this._keyframes.set(keyframe.id, new Keyframe(keyframe))
    });
  }

  public analyzeSemantics(): void {
    // ERROR: make sure that referenced animations were declared
    this._shapes.forEach((shape) =>
      shape.animation.forEach((animationId) => {
        if (!this._keyframes.has(animationId)) {
          throw new Error(
            `Animation ${animationId} referenced in shape ${shape.id} was never declared`
          );
        }
      })
    );

    // TODO WARNING: check if all animations are being used
  }
}

//TODO: identation
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

const transpiler = new Transpiler(teste);

transpiler.parse(); //?

transpiler.analyzeSemantics(); //?

transpiler.shapes; //?
transpiler.keyframes; //?
