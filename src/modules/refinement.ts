import assert from "node:assert";
import * as R from "fp-ts/Refinement";
import * as RA from "fp-ts/ReadonlyArray";
import * as F from "fp-ts/function";
import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";

type Success = "200" | "201";
type ErrorServer = "500" | "501";
type ErrorClient = "400" | "401" | "404" | "409";
type Response = ErrorClient | ErrorServer | Success;

type RefinementResponse = R.Refinement<string, Response>;
const isResponse: RefinementResponse = (r: string): r is Response => {
  return ["200", "201", "400", "401", "404", "409", "500", "501"].includes(r);
};

const ERROR_SERVER = ["500", "501"];
const ERROR_CLIENT = ["400", "401", "404", "409"];
const SUCCESS = ["200", "201"];

type RES = R.Refinement<string, ErrorServer>;
const isErrorServer: RES = (r: string): r is ErrorServer => {
  return ERROR_SERVER.includes(r);
};

type REC = R.Refinement<string, ErrorClient>;
const isErrorClient: REC = (r: string): r is ErrorClient => {
  return ERROR_CLIENT.includes(r);
};

type RS = R.Refinement<string, Success>;
const isSuccess: RS = (r: string): r is Success => {
  return SUCCESS.includes(r);
};

assert.strictEqual(isResponse("300"), false);
assert.strictEqual(isResponse("423"), false);
assert.strictEqual(isResponse("404"), true);
assert.strictEqual(isResponse("500"), true);

assert.strictEqual(isErrorServer("500"), true);
assert.strictEqual(isErrorServer("400"), false);

assert.strictEqual(isErrorClient("400"), true);
assert.strictEqual(isErrorClient("401"), true);
assert.strictEqual(isErrorClient("100"), false);

assert.strictEqual(isSuccess("100"), false);
assert.strictEqual(isSuccess("200"), true);

type Odd = 3 | 5 | 7 | 9;
type Even = 2 | 4 | 6;
type Prime = 2 | 5 | 7;
type Num = Odd | Even | Prime;

type RefineOdd = R.Refinement<Num, Odd>;
type RefineEven = R.Refinement<Num, Even>;
type RefinePrime = R.Refinement<Num, Prime>;
// type RefineNum = R.Refinement<number, Num>;

const isEven: RefineEven = (x): x is Even => x % 2 === 0;
const isOdd: RefineOdd = (x): x is Odd => x % 2 !== 0;
const isPrime: RefinePrime = (x): x is Prime => [2, 5, 7].includes(x);
// const isNum: RefineNum = (x): x is Num => [2, 3, 4, 5, 6, 7, 9].includes(x);

{
  /**
   * Refinement.or
   * */

  {
    const isError = R.or(isErrorServer)(isErrorClient);
    assert.strictEqual(isError("400"), true);
    assert.strictEqual(isError("404"), true);
    assert.strictEqual(isError("500"), true);
    assert.strictEqual(isError("501"), true);
    assert.strictEqual(isError("100"), false);
    assert.strictEqual(isError("300"), false);
    assert.strictEqual(isError("202"), false);
  }

  {
    const isEvenOrPrime = R.or(isEven)(isPrime);
    assert.strictEqual(isEvenOrPrime(2), true);
    assert.strictEqual(isEvenOrPrime(7), true);
    assert.strictEqual(isEvenOrPrime(4), true);
    assert.strictEqual(isEvenOrPrime(9), false);
  }

  {
    const isOddOrPrime = R.or(isOdd)(isPrime);
    assert.strictEqual(isOddOrPrime(3), true);
    assert.strictEqual(isOddOrPrime(7), true);
    assert.strictEqual(isOddOrPrime(9), true);
    assert.strictEqual(isOddOrPrime(4), false);
  }
}

{
  /**
   * Refinement.and
   * */

  {
    const isEvenAndPrime = R.and(isEven)(isPrime);

    assert.strictEqual(isEvenAndPrime(2), true);
    assert.strictEqual(isEvenAndPrime(7), false);
    assert.strictEqual(isEvenAndPrime(4), false);
  }

  {
    const isOddAndPrime = R.and(isOdd)(isPrime);

    assert.strictEqual(isOddAndPrime(7), true);
    assert.strictEqual(isOddAndPrime(9), false);
    assert.strictEqual(isOddAndPrime(2), false);
  }
}

{
  /**
   * Refinement.not
   * */

  {
    const isEven = R.not(isOdd);
    assert.strictEqual(isEven(2), true);
    assert.strictEqual(isEven(4), true);
    assert.strictEqual(isEven(3), false);
  }
}

{
  /**
   * Refinement.compose
   * */

  const refine = F.pipe(isResponse, R.compose(isErrorServer));
  assert.strictEqual(refine("500"), isErrorServer("500"));
  assert.strictEqual(refine("400"), isErrorServer("400"));
}

{
  /**
   * Refinement.zero
   * */

  const refine = R.zero<number, Num>();
  assert.strictEqual(refine(1000), false);
  assert.strictEqual(refine(2), false);
  assert.strictEqual(refine(9), false);
}

{
  /**
   * Refinement.fromEitherK
   * */

  type Char =
    | "a"
    | "b"
    | "c"
    | "d"
    | "e"
    | "f"
    | "g"
    | "h"
    | "i"
    | "j"
    | "k"
    | "l"
    | "m"
    | "n"
    | "o"
    | "p"
    | "q"
    | "r"
    | "s"
    | "t"
    | "u"
    | "v"
    | "w"
    | "x"
    | "y"
    | "z";

  type StringLen3 = `${Char}${Char}${Char}`;
  type Validated = E.Either<"TooShort" | "TooLong", StringLen3>;
  function isLength3(input: string): Validated {
    if (input.length > 3) {
      return E.left("TooLong");
    }

    if (input.length < 3) {
      return E.left("TooShort");
    }

    return E.right(input as StringLen3);
  }

  const refine = R.fromEitherK(isLength3);

  assert.strictEqual(refine("hello"), false);
  assert.strictEqual(refine("hel"), true);
}

{
  /**
   * Refinement.fromOptionK
   * */

  type NonEmpty<T> = [T, ...T[]];

  function splitHead<T>(xs: T[]): O.Option<NonEmpty<T>> {
    return F.pipe(
      xs,
      RA.head,
      O.map((head) => [head]),
    );
  }

  const refine = R.fromOptionK(splitHead);

  assert.strictEqual(refine([]), false);
  assert.strictEqual(refine([42, 69]), true);
}
