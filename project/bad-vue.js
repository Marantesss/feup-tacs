// Our "safe" expression evaluator
const call = (expr, ctx) =>
  new Function(`with(this){ return ${expr} }`).bind(ctx)();

// prefix for directives
// - bv-if="..."
// - bv-for=""
const prefix = "bv-";

// Our supported directives
const directives = {
  // Bind innerHTML to an expression value
  html: (el, _, val, ctx) => (el.innerHTML = call(val, ctx)),
  // Bind innerText to an expression value
  text: (el, _, val, ctx) => (el.innerText = call(val, ctx)),
  if: (el, _, val, ctx) => (el.hidden = !call(val, ctx)),
  // Bind event listener
  on: (el, name, val, ctx) => (el[`on${name}`] = () => call(val, ctx)),
  model: (el, name, val, ctx) => {
    el.value = ctx[val];
    el.oninput = () => (ctx[val] = el.value);
  },
  // Bind node attribute to an expression value
  bind: (el, name, value, ctx) => {
    const v = call(value, ctx);
    if (name === "style") {
      el.removeAttribute("style");
      for (const k in v) {
        el.style[k] = v[k];
      }
    } else if (name === "class") {
      el.setAttribute("class", [].concat(v).join(" "));
    } else {
      v ? el.setAttribute(name, v) : el.removeAttribute(name);
    }
  },
  for: (el, name, val, ctx) => {
    const items = call(val, ctx);
    if (!el.$for) {
      el.$for = el.children[0];
    }
    el.innerText = "";
    for (let it of items) {
      const childNode = document.importNode(el.$for);
      const childCtx = { $parent: ctx, $it: it };
      childNode.$bv = childCtx;
      BadVue(childNode, childCtx);
      el.appendChild(childNode);
    }
  },
};

// Currently evaluated directive, proxy uses it as a dependency
// of the individual variables accessed during directive evaluation
let $dep;

// A function to iterate over DOM node and its child nodes, scanning all
// attributes and binding them as directives if needed
const walk = (node, bv) => {
  // Iterate node attributes
  for (const { name, value } of node.attributes) {
    if (name.startsWith(prefix)) {
      const [directive, event] = name.substring(prefix.length).split(":");
      const d = directives[directive];
      // Set $dep to re-evaluate this directive
      $dep = () => d(node, event, value, bv);
      // Evaluate directive for the first time
      $dep();
      // And clear $dep after we are done
      $dep = undefined;
    }
  }
  // Walk through child nodes
  for (const child of node.children) {
    if (!child.$bv) {
      walk(child, bv);
    }
  }
};

// Proxy uses Object.defineProperty to intercept access to
// all `q` data object properties.
const proxy = (bv) => {
  const deps = {}; // Dependent directives of the given data object
  for (const name in bv) {
    deps[name] = []; // Dependent directives of the given property
    let prop = bv[name];
    Object.defineProperty(bv, name, {
      get() {
        if ($dep) {
          // Property has been accessed.
          // Add current directive to the dependency list.
          deps[name].push($dep);
        }
        return prop;
      },
      set(value) {
        prop = value;
        if (!name.startsWith("$")) {
          for (const dep of deps[name]) {
            dep(value);
          }
        }
      },
    });
  }
  return bv;
};

// Main entry point:
// - apply data object "bv" to the DOM tree at root "el".
const BadVue = (el, bv) => walk(el, proxy(bv));
