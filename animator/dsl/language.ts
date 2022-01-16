import * as P from 'parsimmon'

class Expression {
    execute(){};
};

class Shape extends Expression {

    constructor(public id: string, public type: ShapeType, public color: Color, public position: {x: number, y: number},  public size: number, public animation: string[]){
        super();
    };

};

class Keyframe extends Expression {

    constructor(public id: string, public type: AnimType, public color: Color, public position: {x: number, y: number}, public time: number){
        super();
    };

};

// Shape:
//     Id: 1
//     Type: square
//     Color: red 
//     Size: 25px

// Keyframe:
//     Order: 1
//     Target: 1
//     Type: ease-in
//     Color: red    
//     Time: 1s


type Grammar = {
    expr: Shape | Keyframe,

    shapeExpr: Shape,
    keyframeExpr: Keyframe

    idExpr: string,
    shapeTypeExpr: string,
    animTypeExpr: string,
    colorExpr: string,
    sizeExpr: string,

    id: string
    shapeType: ShapeType,
    animType: AnimType,
    color: Color,
    size: string,
}

type ShapeType = 'square' | 'circle';
type AnimType = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
type Color = 'red' | 'green' | 'blue' | 'purple' | 'orange' | 'yellow' | 'pink' | 'white' | 'black';

// P.string('red'), P.string('green'), P.string('blue'), P.string('purple'), P.string('orange'), P.string('yellow'), P.string('pink'), P.string('white'), P.string('black')
const Lang = P.createLanguage({
    expr: l => P.alt(l.shapeExpr, l.keyframeExpr).sepBy(P.optWhitespace).skip(P.end),

    shapeExpr: l => P.seq(P.string("Shape").skip(P.seq(l.colon, P.optWhitespace)), l.subExpr.sepBy(P.optWhitespace)), 
    keyframeExpr: l => P.seq(P.string("Keyframe").skip(P.seq(l.colon, P.optWhitespace)), l.subExpr.sepBy(P.optWhitespace)), 


    subExpr: l => P.seq(l.identifier.skip(l.colon.trim(P.optWhitespace)), P.alt(l.value, l.arr)),

    identifier: () => P.regex(/^(?!Shape|Keyframe)[a-zA-z]*/), // match any word except Shape or Keyframe
    
    value: () => P.regexp(/[a-zA-Z0-9]+/),
    arr: l => l.leftBracket.trim(P.optWhitespace)
        .then(l.value.trim(P.optWhitespace).sepBy(P.string(',')))
        .skip(l.rightBracket),


    leftBracket: () => P.string('['),
    rightBracket: () => P.string(']'),
    colon: () => P.string(':'),

    // idExpr: l => P.seq(P.string("id: "), l.id).map(([_,a]) => a),
    // shapeTypeExpr: l => P.seq(P.string("type: "), l.shapeType).map(([_,a]) => a),
    // animTypeExpr: l => P.seq(P.string("type: "), l.animType).map(([_,a]) => a),
    // colorExpr: l => P.seq(P.string("color: "), l.color).map(([_,a]) => a),
    // sizeExpr: l => P.seq(P.string("size: "), l.size, P.alt(P.string("px"))).map(([_,a,__]) => a),
    // timeExpr: l => P.seq(P.string("time: "), l.time, P.alt(P.string("s"))).map(([_,a,__]) => a),
    // positionExpr: l=> P.seq(P.string("position:"), P.newline, l.position).map(([_,__,a]) => a),
    // animationExpr: l => P.seq(P.string("animation: "), P.alt(l.id).sepBy(P.whitespace)).map(([_,a]) => a),

    // id: l => P.regexp(/[a-zA-Z0-9]+/),
    // shapeType: l => P.alt(P.string('square'), P.string('circle')),
    // animType: l => P.alt(P.string('linear'), P.string('ease-in'), P.string("ease-out"), P.string("ease-in-out")),
    // color: l => P.alt(P.string('red'), P.string('green'), P.string('blue'), P.string('purple'), P.string('orange'), P.string('yellow'), P.string('pink'), P.string('white'), P.string('black')),
    // size: l => P.digits,
    // order: l => P.regexp(/[0-9]+/), //TODO: cenas repetidas, dar cleanup depois
    // target: l=> P.regexp(/[a-zA-Z0-9]+/),
    // time: l => P.regexp(/[0-9]+/),
    // position: l => P.seq(P.string("x: "), P.digits, P.newline, P.string("y: "), P.digits).map(([_,a,__,___,b]) => [a,b]),
});

// Lang.positionExpr.tryParse("position:\nx: 1\ny: 2") //?
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
type: linear
color: red
position: [0,1]
time: 2s
`

const syntax = Lang.expr.tryParse(teste); //?

const semanticAnalysis = (syntax: Array<Array<any>>) => {
    const keyframesSyntax = syntax.filter(expression => expression[0] === 'Keyframe') //?
    const shapeSyntax = syntax.filter(expression => expression[0] === 'Shape') //?

    const buildKeyframe = ([name, body]) => {
        if (name !== 'Keyframe') {
            throw new Error('Keyframe expression is not a keyframe')
        } 
        // build object from array
        const object = { name };
        body.forEach(pair => {
          const [key, value] = pair;
          object[key] = value;
        })

        object //?

        const {
            id, type, color, position: [x, y], time
        } = object

        // TODO filter what's mandatory or not
        if (!id || !type || !color || !x || !y || !time) {
            throw new Error('Something is not present')
        }

        return new Keyframe(id, type, color, {x, y}, time) //?

    }

    const buildShape = ([name, body]) => {
        if (name !== 'Shape') {
            throw new Error('Shape expression is not a shape')
        } 
        // build object from array
        const object = { name };
        body.forEach(pair => {
          const [key, value] = pair;
          object[key] = value;
        })

        object //?

        const {
            id, type, color, position: [x, y], size, animation
        } = object

        // TODO filter what's mandatory or not
        if (!id || !type || !color || !x || !y || !size || !animation) {
            throw new Error('Something is not present')
        }

        return new Shape(id, type, color, {x, y}, size, animation) //?

    }

    const keyframeList = keyframesSyntax.map(e => buildKeyframe(e))
    keyframeList //?
    const shapeList = shapeSyntax.map(e => buildShape(e))
    shapeList //?
}

semanticAnalysis(syntax)
