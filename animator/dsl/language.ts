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
    expr: l => P.alt(P.seq(P.string("Shape:"), P.newline, l.shapeExpr).map(([_,__,a]) => a),
                    P.seq(P.string("Keyframe:"), P.newline, l.keyframeExpr).map(([_,__,a]) => a)).sepBy(P.newline),

    shapeExpr: l => P.alt(l.subExpr).sepBy(P.newline).map(([a,b,c,d,e,f]) => new Shape(a,b,c,d,e,f)).skip(l.End), 
    keyframeExpr: l => P.alt(l.subExpr).sepBy(P.newline).map(([a,b,c,d,e]) => new Keyframe(a,b,c,d,e)).skip(l.End), 


    subExpr: l => P.seq(l.identifier.trim(P.optWhitespace).skip(P.string(":").trim(P.optWhitespace)), l.value),

    identifier: l => P.alt(P.string("id"), P.string("type"), P.string("color"), P.string("position"), P.string("size"), P.string("time"), P.string("animation"), P.string("x"), P.string("y")),
    value: l => P.alt(l.subExpr, P.regexp(/[a-zA-Z0-9]+/)), 

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
    position: l=> P.seq(P.string("x: "), P.digits, P.newline, P.string("y: "), P.digits).map(([_,a,__,___,b]) => [a,b]),

    NL: () => P.alt(P.string("\r\n"), P.oneOf("\r\n")),

    End: l => P.alt(l.NL, P.eof)
});

// Lang.positionExpr.tryParse("position:\nx: 1\ny: 2") //?

 //TODO: identation

const teste = `Shape:
id: ola
type: circle
color: red
position: x: 0
y: 0
size: 20px

Shape:
id: quadrado1
type: square
color: purple
size: 132px

Keyframe:
id: 1
type: linear
color: red
position:
x: 1
y: 3
time: 2s`

Lang.expr.tryParse(teste); //?