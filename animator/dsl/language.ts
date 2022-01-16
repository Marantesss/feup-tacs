import * as P from "parsimmon";

class Expression {
  execute() {}
}

// TODO figure out whats not mandatory
interface ShapeObject {
  id: string;
  type: ShapeType;
  color: Color;
  position: { x: number; y: number };
  size: number;
  animation: Array<string>;
}

class Shape extends Expression implements ShapeObject {
  constructor(
    public id: string,
    public type: ShapeType,
    public color: Color,
    public position: { x: number; y: number },
    public size: number,
    public animation: Array<string>
  ) {
    super();
  }
}

interface KeyframeObject {
  id: string;
  type: AnimType;
  color: Color;
  scale: number;
  position: { x: number; y: number };
  time: number;
}
class Keyframe extends Expression implements KeyframeObject {
  constructor(
    public id: string,
    public type: AnimType,
    public color: Color,
    public scale: number,
    public position: { x: number; y: number },
    public time: number
  ) {
    super();
  }
}

type ShapeType = "square" | "circle";
type AnimType = "lerp" | "slerp";
type Color =
  | "red"
  | "green"
  | "blue"
  | "purple"
  | "orange"
  | "yellow"
  | "pink"
  | "white"
  | "black";

class Transpiler {
  private _language: P.Language;

  private _code: string;
  private _tokens: Array<any>;

  private _shapes: Array<Shape>;
  private _keyframes: Map<string, Keyframe>;

  public get shapes() {
    return this._shapes;
  }
  public get keyframes() {
    return this._keyframes;
  }

  constructor(code: string) {
    this._code = code;
    this._tokens = [];
    this._shapes = [];
    this._keyframes = new Map();
    this._language = P.createLanguage<{
      expr: Array<Array<any>>;

      shapeExpr: Array<any>;
      keyframeExpr: Array<any>;

      subExpr: Array<any>;

      identifier: string;
      value: string | number;
      arr: Array<string | number>;

      leftBracket: "[";
      rightBracket: "]";
      colon: ":";
    }>({
      expr: (l) =>
        P.alt(l.shapeExpr, l.keyframeExpr).sepBy(P.optWhitespace).skip(P.end),

      shapeExpr: (l) =>
        P.seq(
          P.string("Shape").skip(P.seq(l.colon, P.optWhitespace)),
          l.subExpr.sepBy(P.optWhitespace)
        ),
      keyframeExpr: (l) =>
        P.seq(
          P.string("Keyframe").skip(P.seq(l.colon, P.optWhitespace)),
          l.subExpr.sepBy(P.optWhitespace)
        ),

      subExpr: (l) =>
        P.seq(
          l.identifier.skip(l.colon.trim(P.optWhitespace)),
          P.alt(l.value, l.arr)
        ),

      identifier: () => P.regex(/^(?!Shape|Keyframe)[a-zA-z]*/), // match any word except Shape or Keyframe

      value: () =>
        P.regexp(/[a-zA-Z0-9]+/).map((value) =>
          isNaN(parseInt(value)) ? value : parseInt(value)
        ),
      arr: (l) =>
        l.leftBracket
          .trim(P.optWhitespace)
          .then(l.value.trim(P.optWhitespace).sepBy(P.string(",")))
          .skip(l.rightBracket),

      leftBracket: () => P.string("["),
      rightBracket: () => P.string("]"),
      colon: () => P.string(":"),
    });
  }

  public parse(): void {
    this._tokens = this._language.expr.tryParse(this._code);
  }

  private buildKeyframe([name, body]): Keyframe {
    if (name !== "Keyframe") {
      throw new Error("Keyframe expression is not a keyframe");
    }
    // build object from array
    const object = {};
    body.forEach((pair) => {
      const [key, value] = pair;
      if (key === "position") {
        object[key] = { x: value[0], y: value[1] };
      } else {
        object[key] = value;
      }
    });

    const {
      id,
      type,
      color,
      scale,
      position: { x, y },
      time,
    } = object as KeyframeObject; //?

    // TODO filter what's mandatory or not
    if (!id || !type || !color || !scale || isNaN(x) || isNaN(y) || !time) {
      throw new Error("Something is not present");
    }

    return new Keyframe(id, type, color, scale, { x, y }, time);
  }

  private buildShape([name, body]): Shape {
    if (name !== "Shape") {
      throw new Error("Shape expression is not a shape");
    }
    // build object from array
    const object = {};
    body.forEach((pair) => {
      const [key, value] = pair;
      if (key === "position") {
        object[key] = { x: value[0], y: value[1] };
      } else {
        object[key] = value;
      }
    });

    const {
      id,
      type,
      color,
      position: { x, y },
      size,
      animation,
    } = object as ShapeObject;

    // TODO filter what's mandatory or not
    if (!id || !type || !color || isNaN(x) || isNaN(y) || !size || !animation) {
      throw new Error("Something is not present");
    }

    return new Shape(id, type, color, { x, y }, size, animation);
  }

  public analyzeSyntax(): void {
    const keyframesSyntax = this._tokens.filter(
      (expression) => expression[0] === "Keyframe"
    ); //?
    const shapeSyntax = this._tokens.filter(
      (expression) => expression[0] === "Shape"
    ); //?

    keyframesSyntax.forEach((keyframe) => {
      const kf = this.buildKeyframe(keyframe);
      this._keyframes.set(kf.id, kf);
    });
    this._shapes = shapeSyntax.map((shape) => this.buildShape(shape));
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
transpiler.analyzeSyntax(); //?
transpiler.analyzeSemantics(); //?

transpiler.shapes; //?
transpiler.keyframes; //?
