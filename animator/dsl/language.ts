import * as P from 'parsimmon'

// Shape:
//     Id: 1
//     Type: square
//     Color: red 
//     Size: 25px
//     Active: yes

// type ShapeGrammar = {
//     Id: string,
//     Type: TypeExp,
//     Color: ColorExp,
//     Size: SizeExp 
// }

// const ShapeLang = P.createLanguage<ShapeGrammar>({
//     Id => P.string
//     Type: P.alt(),
// })


/[Ss]quare/.test('square') //?

class Expression {
    execute(){};
};

class Shape extends Expression {

    constructor(public id: string, public type: String){
        super();
    };

};

class Animation extends Expression {

    constructor(public id: string, public type: ShapeType){
        super();
    };

};



new Shape('ola', 'square') //?

type Grammar = {
    expr: Shape | Animation,
    shapeExpr: Shape,
    animExpr: Animation
}

const language = P.createLanguage<Grammar>({
    expr: l => P.alt(l.shapeExpr, l.animExpr),
    shapeExpr: l => P.seq(P.string('Shape:'), P.newline, P.letters, P.whitespace, P.letters).map(([_, __,a, ___, b]) => new Shape(a,b)),
    animExpr: l => P.seq(P.string('Shape:'), P.newline, P.string, P.any)

})

language.shapeExpr.tryParse("Shape:\num square") //?

type ShapeType = 'square' | 'circle';
type Color = 'red' | 'green' | 'blue' | 'purple' | 'orange' | 'yellow' | 'pink' | 'white' | 'black';

type ShapeGrammar = {
    id: string,
    type: string,
    color: Color,
    size: string
}

var shapeLang = P.createLanguage({
    id: l => P.regexp(/[a-zA-Z0-9]+/).skip(l.newline),

    newline: _ => P.newline
});

shapeLang.id.tryParse("oaXafwe7\n"); //?