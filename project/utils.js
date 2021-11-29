export const call = (expr, ctx) =>
  new Function(`with(this){ return ${expr} }`).bind(ctx)();
