import { call } from "./utils";

const directives = {
  // Bind innerText to an expression value
  text: (el, _, val, ctx) => (el.innerText = call(val, ctx)),
  // Bind event listener
  on: (el, name, val, ctx) => (el[`on${name}`] = () => call(val, ctx)),
  // Bind node attribute to an expression value
  bind: (el, name, value, ctx) => el.setAttribute(name, call(value, ctx)),
};

export default directives;
