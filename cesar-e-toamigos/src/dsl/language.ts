import * as P from "parsimmon";

export type ShapeType = "square" | "circle";
export type AnimType = "lerp" | "slerp";

export interface ShapeObject {
  id: string;
  type: ShapeType;
  color: string;
  position: { x: number; y: number };
  size: number;
  animation: Array<string>;
}

export interface KeyframeObject {
  id: string;
  type: AnimType;
  color: string;
  scale: number;
  position: { x: number; y: number };
  time: number;
}

export interface LanguageOutput {
  shapes: Array<ShapeObject>;
  keyframes: Array<KeyframeObject>;
}

interface Grammar {
  expr: LanguageOutput;

  shapeExpr: ShapeObject;
  keyframeExpr: KeyframeObject;

  shapeSubExpr: Array<string>;
  keyframeSubExpr: Array<string>;

  idExpr: Array<string>;
  shapeTypeExpr: Array<string>;
  animTypeExpr: Array<string>;
  colorExpr: Array<string>;
  sizeExpr: Array<string>;
  timeExpr: Array<string>;
  positionExpr: Array<string>;
  animationExpr: Array<string>;
  scaleExpression: Array<string>;

  id: string;
  shapeType: ShapeType;
  animType: AnimType;
  color: string;
  size: number;
  time: number;
  position: { x: number; y: number };
  arr: Array<string>;

  leftBracket: "[";
  rightBracket: "]";
}

const makeShapeObject = ([object, body]): ShapeObject => {
  if (object !== "Shape") return;
  const obj = {};
  body.forEach(([key, value]) => {
    obj[key] = value;
    return obj;
  });
  return obj as ShapeObject;
};

const makeKeyframeObject = ([object, body]): KeyframeObject => {
  if (object !== "Keyframe") return;
  const obj = {};
  body.forEach(([key, value]) => {
    obj[key] = value;
    return obj;
  });
  return obj as KeyframeObject;
};

const makeLanguageOutput =(result: Array<any>) => {
  const shapes = result.filter(({ scale }) => !scale);
  const keyframes = result.filter(({ scale }) => scale);

  return {
    shapes,
    keyframes,
  };
}

const makePair = (key, valueParser) =>
  P.seq(
    P.string(key).skip(P.seq(P.optWhitespace, P.string(":"), P.optWhitespace)),
    valueParser
  );

const language = P.createLanguage<Grammar>({
  expr: (l) =>
    P.alt(l.shapeExpr, l.keyframeExpr)
      .sepBy(P.optWhitespace)
      .skip(P.optWhitespace)
      .map(makeLanguageOutput),

  shapeExpr: (l) =>
    makePair("Shape", l.shapeSubExpr.sepBy(P.whitespace)).map(makeShapeObject),
  keyframeExpr: (l) =>
    makePair("Keyframe", l.keyframeSubExpr.sepBy(P.whitespace)).map(
      makeKeyframeObject
    ),

  shapeSubExpr: (l) =>
    P.alt(
      l.idExpr,
      l.shapeTypeExpr,
      l.colorExpr,
      l.sizeExpr,
      l.positionExpr,
      l.animationExpr
    ),

  keyframeSubExpr: (l) =>
    P.alt(
      l.idExpr,
      l.animTypeExpr,
      l.colorExpr,
      l.timeExpr,
      l.scaleExpression,
      l.positionExpr
    ),

  // Key-Value expressions (syntax analysis)
  idExpr: (l) => makePair("id", l.id),
  shapeTypeExpr: (l) => makePair("type", l.shapeType),
  animTypeExpr: (l) => makePair("type", l.animType),
  colorExpr: (l) => makePair("color", l.color),
  sizeExpr: (l) => makePair("size", l.size),
  timeExpr: (l) => makePair("time", l.time),
  positionExpr: (l) => makePair("position", l.position),
  animationExpr: (l) => makePair("animation", l.arr),
  scaleExpression: (l) => makePair("scale", l.id),

  id: (l) => P.regexp(/[a-zA-Z0-9]+/),
  shapeType: (l) => P.alt(P.string("square"), P.string("circle")),
  animType: (l) => P.alt(P.string("lerp"), P.string("slerp")),
  color: (l) =>
    P.alt(
      P.regexp(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/i),
      P.string("red").result("#ff0000"),
      P.string("green").result("#00ff00"),
      P.string("blue").result("#0000ff"),
      P.string("purple").result("#6a0dad"),
      P.string("orange").result("#ffa500"),
      P.string("yellow").result("#ffff00"),
      P.string("pink").result("#ffc0cb"),
      P.string("white").result("#ffffff"),
      P.string("black").result("#000000")
    ),
  size: (l) => P.digits.skip(P.string("px")).map((d) => parseFloat(d)),
  time: (l) =>
    P.regexp(/[0-9]+/)
      .skip(P.string("s"))
      .map((d) => parseFloat(d)),

  position: (l) =>
    l.leftBracket
      .trim(P.optWhitespace)
      .then(l.id.trim(P.optWhitespace).sepBy(P.string(",")))
      .map(([x, y, ...rest]) => {
        return { x: parseInt(x), y: parseInt(y) };
      })
      .skip(l.rightBracket),

  arr: (l) =>
    l.leftBracket
      .trim(P.optWhitespace)
      .then(l.id.trim(P.optWhitespace).sepBy(P.string(",")))
      .skip(l.rightBracket),

  leftBracket: () => P.string("["),
  rightBracket: () => P.string("]"),
});

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

language.expr.tryParse(teste) //?

export { language };
