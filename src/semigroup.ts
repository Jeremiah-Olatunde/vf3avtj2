import assert from "node:assert";
import * as S from "fp-ts/Semigroup";
import * as A from "fp-ts/ReadonlyArray";
import * as F from "fp-ts/function";
import * as O from "fp-ts/Ord";
import * as number from "fp-ts/number";

{
  function concat<T>(semigroup: S.Semigroup<T>, x: T, y: T): T {
    return semigroup.concat(x, y);
  }

  const SemigroupString: S.Semigroup<string> = {
    concat: (x, y) => `${x}${y}`,
  };

  const SemigroupNumberAdd: S.Semigroup<number> = {
    concat: (x, y) => x + y,
  };

  const SemigroupNumberMul: S.Semigroup<number> = {
    concat: (x, y) => x * y,
  };

  const SemigroupBooleanOr: S.Semigroup<boolean> = {
    concat: (x, y) => x || y,
  };

  const SemigroupBooleanAnd: S.Semigroup<boolean> = {
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
  function concat<T>(semigroup: S.Semigroup<T>, x: T, y: T): T {
    return semigroup.concat(x, y);
  }

  interface Parameterized<T> {
    Array: S.Semigroup<Array<T>>;
    Record: S.Semigroup<Record<string, T>>;
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

{
  /**
   * Folding over a string array using Semigroup
   * */

  const SemigroupString: S.Semigroup<string> = {
    concat: (x, y) => `${x}${y}`,
  };

  const xs: readonly string[] = "hello".split("");

  const actual = A.reduce("", SemigroupString.concat)(xs);
  const expect = "hello";
  assert.equal(actual, expect);
}

{
  /**
   * Semigroup.constant
   * */

  {
    const { concat } = S.constant(10);
    const actual = concat(200, 100);
    assert.deepStrictEqual(actual, 10);
  }

  {
    type R = Record<string, string>;
    const { concat } = S.constant<R>({ a: "A" });
    const actual = concat({ x: "x" }, { x: "y" });
    assert.deepStrictEqual(actual, { a: "A" });
  }
}

{
  /**
   * Semigroup.min, Semigroup.max
   * */
  {
    const { concat: max } = S.max(number.Ord);
    const { concat: min } = S.min(number.Ord);
    const head = 10;
    const tail = [5, 7, 2, 4, 1];

    {
      assert.equal(max(5, 10), 10);
      assert.equal(max(10, 5), max(5, 10));
    }

    {
      assert.equal(min(5, 10), 5);
      assert.equal(min(10, 5), min(5, 10));
    }

    {
      const actual = F.pipe(tail, A.reduce(head, max));
      const expect = 10;
      assert.equal(actual, expect);
    }

    {
      const actual = F.pipe(tail, A.reduce(head, min));
      const expect = 1;
      assert.equal(actual, expect);
    }
  }

  {
    type Person = {
      name: string;
      age: number;
    };

    const OrdPerson: O.Ord<Person> = {
      equals: (x, y) => x.age === y.age,
      compare: (x, y) => {
        if (OrdPerson.equals(x, y)) return 0;
        return x.age < y.age ? -1 : 1;
      },
    };

    const SemigroupPersonMax: S.Semigroup<Person> = S.max(OrdPerson);
    const SemigroupPersonMin: S.Semigroup<Person> = S.min(OrdPerson);

    const jeremiah: Person = {
      name: "Jeremiah",
      age: 23,
    };

    const nehemiah: Person = {
      name: "Nehemiah",
      age: 18,
    };

    const roman: Person = {
      name: "Roman",
      age: 22,
    };

    const head: Person = nehemiah;
    const tail: readonly Person[] = [jeremiah, roman];

    {
      const actual = F.pipe(tail, A.reduce(head, SemigroupPersonMax.concat));
      assert.deepStrictEqual(actual, jeremiah);
    }

    {
      const actual = F.pipe(tail, A.reduce(head, SemigroupPersonMin.concat));
      assert.deepStrictEqual(actual, nehemiah);
    }
  }
}

{
  // TODO: Semigroup.first Semigroup.last
}

{
  // TODO: Semigroup.concatAll Semigroup.intercalate
}

{
  /**
   * Semigroup.struct
   * */

  const SemigroupNumberAdd: S.Semigroup<number> = {
    concat: (x, y) => x + y,
  };

  type Point = { x: number; y: number; z: number };

  const point = (x: number, y: number, z: number): Point => ({ x, y, z });

  const SemigroupPointAdd = S.struct({
    x: SemigroupNumberAdd,
    y: SemigroupNumberAdd,
    z: SemigroupNumberAdd,
  });

  const origin = point(0, 0, 0);
  const a = point(1, 1, 1);
  const b = point(2, 2, 2);

  const actual = A.reduce(origin, SemigroupPointAdd.concat)([a, b]);
  const expect = point(3, 3, 3);

  assert.deepStrictEqual(actual, expect);
}
