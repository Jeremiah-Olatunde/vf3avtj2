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

type Env = "production" | "development";

type ContextProduction = {
  env: "production";
  api: "https://jeremiah-olatunde.com";
};

type ContextDevelopment = {
  env: "development";
  api: "https://dev.jeremiah-olatunde.dev";
};

type Context = ContextProduction | ContextDevelopment;

const production: Context = {
  env: "production",
  api: "https://jeremiah-olatunde.com",
};
const development: Context = {
  env: "development",
  api: "https://dev.jeremiah-olatunde.dev",
};

{
  // Reader.ask

  {
    // The implementation of R.ask is a thunk returning the identity function () => identity
    // i.e the result of R.ask() is a Reader that "reads" the context and returns the context
    const reader: R.Reader<Context, Context> = R.ask<Context>();

    {
      const actual = reader(production);
      const expected = production;
      assert.deepStrictEqual(actual, expected);
    }

    {
      const actual = reader(development);
      const expected = development;
      assert.deepStrictEqual(actual, expected);
    }
  }
}

{
  // Reader.asks

  // The implementation is the identity function itself
  // Motivation
  // We want asks to return a reader that takes a context and returns a value from it
  // a selector if you will
  // so we write the selector function that selects our desired value from the context
  // and pass that in to asks
  // but if you deep it, the selector function is the reader we wanted in the first place
  // i.e takes the current context and returns a value from it
  // in general a Reader is literally just a single argument function
  // but in functional programming, where every function is curried
  // every function is a single argument function
  const reader: R.Reader<Context, Env> = R.asks<Context, Env>(({ env }) => env);
  const manual: R.Reader<Context, Env> = ({ env }) => env;

  {
    const actual = reader(production);
    const expected = "production";
    assert.deepStrictEqual(actual, expected);
  }

  {
    const actual = manual(development);
    const expected = "development";
    assert.deepStrictEqual(actual, expected);
  }
}
