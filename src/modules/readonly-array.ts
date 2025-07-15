import assert from "node:assert";

import * as RA from "fp-ts/ReadonlyArray";
import * as F from "fp-ts/function";
import * as E from "fp-ts/Either";

{
  /**
   * ReadonlyArray.makeBy
   * */

  {
    const actual = RA.makeBy(10, F.identity);
    const expect = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    assert.deepStrictEqual(actual, expect);
  }

  {
    const actual = RA.makeBy(10, F.increment);
    const expect = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    assert.deepStrictEqual(actual, expect);
  }
}

{
  /**
   * ReadonlyArray.of
   * */

  {
    const actual = RA.of(10);
    const expect = [10];
    assert.deepStrictEqual(actual, expect);
  }
}

{
  /**
   * ReadonlyArray.replicate
   * */

  {
    const actual = RA.replicate(10, 0);
    const expect = RA.makeBy(10, F.constant(0));
    assert.deepStrictEqual(actual, expect);
  }
}

{
  /**
   * ReadonlyArray.fromArray
   * */

  {
    const mutable: number[] = [0, 1, 2];
    const immutable: readonly number[] = RA.fromArray(mutable);
    assert.deepStrictEqual(immutable, mutable);
  }
}

{
  /**
   * ReadonlyArray.fromEither
   * */

  {
    const actual = RA.fromEither(E.of(42));
    const expect = RA.of(42);
    assert.deepStrictEqual(actual, expect);
  }

  {
    const user: E.Either<"ErrorNotFound", string> = E.left("ErrorNotFound");
    const actual = RA.fromEither(user);
    const expect: readonly string[] = [];
    assert.deepStrictEqual(actual, expect);
  }
}

{
  /**
   * ReadonlyArray.fromOption
   * */

  {
    const xs = RA.of(42);
    const actual = RA.fromOption(RA.head(xs));
    const expect = xs;
    assert.deepStrictEqual(actual, expect);
  }

  {
    const xs: readonly string[] = RA.empty;
    const actual = RA.fromOption(RA.head(xs));
    const expect = xs;
    assert.deepStrictEqual(actual, expect);
  }
}
