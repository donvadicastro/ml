(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global["@ml/linear-regression"] = {}));
})(this, function(exports2) {
  "use strict";
  function gradient(data, w, b) {
    let dj_dw = 0;
    let dj_db = 0;
    data.filter((x) => x.target >= 0 && x.feature >= 0).forEach((x) => {
      const value = model(x.feature, w, b);
      dj_dw += (value - x.target) * x.feature;
      dj_db += value - x.target;
    });
    dj_dw = dj_dw / data.length;
    dj_db = dj_db / data.length;
    return { dj_dw, dj_db };
  }
  function cost(data, w, b) {
    return data.filter((x) => x.target >= 0 && x.feature >= 0).reduce(
      (sum, current) => sum + (model(current.feature, w, b) - current.target) ** 2,
      0
    ) / (2 * data.length);
  }
  function model(x, w, b) {
    return x * w + b;
  }
  function* train(data, iterations, w = Math.random(), b = Math.random(), alpha = 1e-6) {
    for (let i = 0; i < iterations; i++) {
      const { dj_dw, dj_db } = gradient(data, w, b);
      w -= alpha * dj_dw;
      b -= alpha * dj_db;
      if (i % 1e3 === 0) {
        const squaredCost = cost(data, w, b);
        yield { w, b, squaredCost, i };
      }
    }
    return { w, b, i: iterations };
  }
  const model$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    cost,
    model,
    train
  }, Symbol.toStringTag, { value: "Module" }));
  exports2.model = model$1;
  Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
});
