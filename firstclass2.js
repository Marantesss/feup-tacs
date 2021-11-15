// INPUT
const json = {
    model:  {
      sum: '+',
      multiply: '*',
      subtract: '-',
      divide: '/',
      mod: '%'
    },
  
    steps: [
      [3, 4234, 'sum'],
      [10, 4236, 'multiply'],
      [43, 4643, 'subtract'],
      [5233, 5233, 'divide'],
      [5433, 134, 'subtract'],  
      [5433, 134, 'mod']    
    ]
  }
  
  
  const main = () => {
    const { model, steps } = json
  
    var code = `
  class Calculator {`;
  
      Object.entries(model).forEach(([key,value]) => {
        code += key + '(x,y) { return x ' + value + ' y }'; //?
      });
      code += `}
  
  const c = new Calculator()
  
  ${steps.reduce((prev, step) => `${prev}\nconsole.log(c.${step[2]}(${step[0]}, ${step[1]}))`, '')}
  `;
  return code;
  }
  
  main() //?
  
  
  
  eval(main())
  
//   sum(x, y) { return x ${model.sum} y } 
//     multiply(x, y) { return x ${model.multiply} y } 
//     subtract(x, y) { return x ${model.subtract} y } 
//     divide(x, y) { return x ${model.divide} y } 