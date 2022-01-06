import * as P from 'parsimmon'

class Expression {
    execute(){};
};

class Shape extends Expression {

    constructor(public id: string, public type: ShapeType, public color: Color, public size: number){
        super();
    };

};

class Animation extends Expression {

    constructor(public order: number, public target: string, public type: AnimType, public color: Color, public time: number){
        super();
    };

};

// Shape:
//     Id: 1
//     Type: square
//     Color: red 
//     Size: 25px

// Animation:
//     Order: 1
//     Target: 1
//     Type: ease-in
//     Color: red    
//     Time: 1s


type Grammar = {
    expr: Shape | Animation,

    shapeExpr: Shape,
    animExpr: Animation

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
                    P.seq(P.string("Animation:"), P.newline, l.animExpr).map(([_,__,a]) => a)).sepBy(P.newline),
    
    shapeExpr: l => P.alt(l.idExpr, l.shapeTypeExpr, l.colorExpr, l.sizeExpr).sepBy(P.newline).map(([a,b,c,d]) => new Shape(a,b,c,d)).skip(l.End), 
    animExpr: l => P.alt(l.orderExpr, l.targetExpr, l.animTypeExpr ,l.colorExpr, l.timeExpr).sepBy(P.newline).map(([a,b,c,d,e]) => new Animation(a,b,c,d,e)).skip(l.End), 

    idExpr: l => P.seq(P.string("id: "), l.id).map(([_,a]) => a),
    shapeTypeExpr: l => P.seq(P.string("type: "), l.shapeType).map(([_,a]) => a),
    animTypeExpr: l => P.seq(P.string("type: "), l.animType).map(([_,a]) => a),
    colorExpr: l => P.seq(P.string("color: "), l.color).map(([_,a]) => a),
    sizeExpr: l => P.seq(P.string("size: "), l.size, P.alt(P.string("px"))).map(([_,a,__]) => a),
    orderExpr: l => P.seq(P.string("order: "), l.order).map(([_,a]) => a),
    targetExpr: l => P.seq(P.string("target: "), l.target).map(([_,a]) => a),
    timeExpr: l => P.seq(P.string("time: "), l.time, P.alt(P.string("s"))).map(([_,a,__]) => a),

    id: l => P.regexp(/[a-zA-Z0-9]+/),
    shapeType: l => P.alt(P.string('square'), P.string('circle')),
    animType: l => P.alt(P.string('linear'), P.string('ease-in'), P.string("ease-out"), P.string("ease-in-out")),
    color: l => P.alt(P.string('red'), P.string('green'), P.string('blue'), P.string('purple'), P.string('orange'), P.string('yellow'), P.string('pink'), P.string('white'), P.string('black')),
    size: l => P.regexp(/[0-9]+/),
    order: l => P.regexp(/[0-9]+/), //TODO: cenas repetidas, dar cleanup depois
    target: l=> P.regexp(/[a-zA-Z0-9]+/),
    time: l => P.regexp(/[0-9]+/),

    NL: () => P.alt(P.string("\r\n"), P.oneOf("\r\n")),

    End: l => P.alt(l.NL, P.eof)
});



 //TODO: identation


const teste = `Shape:
id: ola
type: circle
color: red
size: 20px

Shape:
id: quadrado1
type: square
color: purple
size: 132px

Animation:
order: 1
target: ola
type: linear
color: red
time: 2s`

Lang.expr.tryParse(teste); //?