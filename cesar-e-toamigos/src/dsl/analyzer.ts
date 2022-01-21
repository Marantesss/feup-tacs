import * as P from "parsimmon";
import { Shape, Keyframe, Circle, Square, Triangle } from "./animator";
import { KeyframeObject, language, ShapeObject } from "./language";

class Transpiler {
  private _language: P.Language = language;

  private _shapes: Array<Shape>;
  private _keyframes: Map<string, Keyframe>;

  public get shapes() {
    return this._shapes;
  }
  public get keyframes() {
    return this._keyframes;
  }

  constructor() {
    this._shapes = [];
    this._keyframes = new Map();
  }

  public execute(code: string): void {
    this.parse(code);
    this.analyzeSemantics();
  }

  private clear(): void {
    this._keyframes.clear();
    this._shapes = [];
  }

  private parse(code: string): void {
    this.clear();
    const output = this._language.expr.tryParse(code);
    const { shapes, keyframes } = output;

    this._shapes = shapes.map((shape: ShapeObject) => {
      switch (shape.type) {
        case "circle":
          return new Circle(shape);
        case "square":
          return new Square(shape);
        case "triangle":
          return new Triangle(shape);
        default:
          return new Square(shape);
      }
    });

    keyframes.forEach((keyframe: KeyframeObject) => {
      if (this._keyframes.has(keyframe.id)) {
        throw new Error(`Keyframe ${keyframe.id} has duplicate id`);
      }
      this._keyframes.set(keyframe.id, new Keyframe(keyframe));
    });
  }

  private analyzeSemantics(): void {
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

const transpiler = new Transpiler();

export { transpiler };
