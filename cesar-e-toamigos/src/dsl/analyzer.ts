import * as P from "parsimmon";
import { Shape, Keyframe, Circle, Square } from "./animator";
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
      this.parse(code)
      this.analyzeSemantics()
  }

  private parse(code: string): void {
    const output = this._language.expr.tryParse(code);
    const { shapes, keyframes } = output;

    this._shapes = shapes.map((shape: ShapeObject) =>
      shape.type === "circle" ? new Circle(shape) : new Square(shape)
    );

    keyframes.forEach((keyframe: KeyframeObject) => {
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

export { transpiler }
