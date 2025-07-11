import assert from "node:assert";
import { Semigroup } from "fp-ts/Semigroup";

{
  function concat<T>(semigroup: Semigroup<T>, x: T, y: T): T {
    return semigroup.concat(x, y);
  }

  const SemigroupString: Semigroup<string> = {
    concat: (x, y) => `${x}${y}`,
  };

  const SemigroupNumberAdd: Semigroup<number> = {
    concat: (x, y) => x + y,
  };

  const SemigroupNumberMul: Semigroup<number> = {
    concat: (x, y) => x * y,
  };

  const SemigroupBooleanOr: Semigroup<boolean> = {
    concat: (x, y) => x || y,
  };

  const SemigroupBooleanAnd: Semigroup<boolean> = {
    concat: (x, y) => x && y,
  };

  {
    const actual = concat(SemigroupString, "domain", "expansion");
    const expect = "domainexpansion";
    assert.equal(actual, expect);
  }

  {
    const actual = concat(SemigroupNumberAdd, 10, 5);
    const expect = 15;
    assert.equal(actual, expect);
  }

  {
    const actual = concat(SemigroupNumberMul, 10, 5);
    const expect = 50;
    assert.equal(actual, expect);
  }

  {
    const actual = concat(SemigroupBooleanAnd, true, false);
    const expect = false;
    assert.equal(actual, expect);
  }

  {
    const actual = concat(SemigroupBooleanAnd, true, true);
    const expect = true;
    assert.equal(actual, expect);
  }

  {
    const actual = concat(SemigroupBooleanOr, true, false);
    const expect = true;
    assert.equal(actual, expect);
  }

  {
    const actual = concat(SemigroupBooleanOr, true, true);
    const expect = true;
    assert.equal(actual, expect);
  }

  {
    const actual = concat(SemigroupBooleanOr, true, true);
    const expect = true;
    assert.equal(actual, expect);
  }
}

{
  function concat<T>(semigroup: Semigroup<T>, x: T, y: T): T {
    return semigroup.concat(x, y);
  }

  interface Parameterized<T> {
    Array: Semigroup<Array<T>>;
    Record: Semigroup<Record<string, T>>;
  }

  const SemigroupsNumber: Parameterized<number> = {
    Array: { concat: (x, y) => [...x, ...y] },
    Record: {
      concat: (x, y) => {
        return { ...x, ...y };
      },
    },
  };

  {
    const actual = concat(SemigroupsNumber.Array, [0], [1]);
    const expect = [0, 1];
    assert.deepStrictEqual(actual, expect);
  }

  {
    const actual = concat(SemigroupsNumber.Record, { x: 0 }, { y: 1 });
    const expect = { x: 0, y: 1 };
    assert.deepStrictEqual(actual, expect);
  }
}
