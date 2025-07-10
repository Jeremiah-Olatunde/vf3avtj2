import * as E from "fp-ts/Either";
import * as F from "fp-ts/function";
import * as C from "fp-ts/Console";

function double(n: number): number {
  return n + n;
}

type ErrorEmptyArray = {
  tag: "ErrorEmptyArray";
};

const ErrorEmptyArray: ErrorEmptyArray = {
  tag: "ErrorEmptyArray",
};

type ErrorDivisionByZero = {
  tag: "ErrorDivisionByZero";
};
const ErrorDivisionByZero: ErrorDivisionByZero = {
  tag: "ErrorDivisionByZero",
};

function head<T>(xs: readonly T[]): E.Either<ErrorEmptyArray, T> {
  const [first] = xs;
  return E.fromNullable(ErrorEmptyArray)(first);
}

function inverse(n: number): E.Either<ErrorDivisionByZero, number> {
  if (n === 0) {
    return E.left(ErrorDivisionByZero);
  }

  return E.right(1 / n);
}

export const example = F.pipe(
  E.of([10, 20, 30]),
  E.flatMap(head),
  E.map(double),
  E.flatMap(inverse),
  E.fold(
    (error) => C.error(`Error: ${error}`),
    (value) => C.log(`Result: ${value}`),
  ),
);
