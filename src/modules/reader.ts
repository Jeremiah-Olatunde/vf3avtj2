import assert from "node:assert";

import * as R from "../lib/Reader.js";
import * as F from "../lib/Function.js";

{
  // Exploration

  {
    type Deps = { inc: number };
    function increment(n: number, deps: Deps) {
      return n + deps.inc;
    }

    function doubleThenIncrement(n: number, deps: Deps) {
      const doubled = n * 2;
      return increment(doubled, deps);
    }

    const actual = doubleThenIncrement(10, { inc: 10 });
    const expected = 30;
    assert.deepStrictEqual(actual, expected);
  }

  {
    type Deps = { inc: number };

    function increment(n: number) {
      return function (deps: Deps) {
        return n + deps.inc;
      };
    }

    function doubleThenIncrement(n: number) {
      const doubled = n * 2;
      return increment(doubled);
    }

    const deps = { inc: 10 };
    const actual = doubleThenIncrement(10)(deps);
    const expected = 30;
    assert.deepStrictEqual(actual, expected);
  }

  {
    type Deps = { inc: number };

    function increment(n: number): (d: Deps) => number {
      const inspect = F.pipe(
        R.ask<Deps>(),
        R.map(({ inc }) => inc + n),
      );

      return inspect;
    }

    function doubleThenIncrement(n: number) {
      const doubled = n * 2;
      return increment(doubled);
    }

    const deps = { inc: 10 };
    const actual = doubleThenIncrement(10)(deps);
    const expected = 30;
    assert.deepStrictEqual(actual, expected);
  }
}
