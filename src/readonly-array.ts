import assert from "node:assert";

import * as RA from "fp-ts/ReadonlyArray";
import * as F from "fp-ts/function";

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
