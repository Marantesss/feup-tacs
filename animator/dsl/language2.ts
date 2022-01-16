import * as P from "parsimmon";

const makeObject = (pair) => {
  const obj = {};
  let [key, value] = pair;
  obj[key] = value;
  return obj;
};

const makeActualObject = (arr) => {
  const keyframes = arr.filter(
    (expression) => expression[0] === "Keyframe"
  ); //?
  const shapes = arr.filter(
    (expression) => expression[0] === "Shape"
  ); //?

  arr //?
  return arr
}

const makePair = (key, valueParser) =>
  P.seq(P.string(key).skip(P.seq(P.optWhitespace, P.string(":"), P.optWhitespace)), valueParser);

const lang = P.createLanguage({
  expr: (l) =>
    P.alt(l.shapeExpr, l.keyframeExpr)
      .sepBy(P.optWhitespace)
      .skip(P.optWhitespace)
      .map(makeActualObject),

  shapeExpr: (l) => makePair("Shape", l.shapeSubExpr.sepBy(P.whitespace)),
  keyframeExpr: (l) =>
    makePair("Keyframe", l.keyframeSubExpr.sepBy(P.whitespace)),

  shapeSubExpr: (l) =>
    P.alt(
      l.idExpr,
      l.shapeTypeExpr,
      l.colorExpr,
      l.sizeExpr,
      l.positionExpr,
      l.animationExpr
    ).map(makeObject),

  keyframeSubExpr: (l) =>
    P.alt(
      l.idExpr,
      l.animTypeExpr,
      l.colorExpr,
      l.timeExpr,
      l.scaleExpression,
      l.positionExpr
    ).map(makeObject),

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
  size: (l) => P.digits.skip(P.string("px")),
  time: (l) => P.regexp(/[0-9]+/).skip(P.string("s")),

  position: (l) =>
    l.leftBracket
      .trim(P.optWhitespace)
      .then(l.id.trim(P.optWhitespace).sepBy(P.string(",")))
      .map(([x, y, ...rest]) => {
        return { x, y };
      })
      .skip(l.rightBracket),

  arr: (l) =>
    l.leftBracket
      .trim(P.optWhitespace)
      .then(l.id.trim(P.optWhitespace).sepBy(P.string(",")))
      .skip(l.rightBracket),

  leftBracket: () => P.string("["),
  rightBracket: () => P.string("]"),
  colon: () => P.string(":"),
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

lang.expr.tryParse(teste); //?
