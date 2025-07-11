import { Semigroup } from "fp-ts/Semigroup";

function concat<T>(semigroup: Semigroup<T>, x: T, y: T): T {
  return semigroup.concat(x, y);
}

const SemigroupString: Semigroup<string> = {
  concat: (x, y) => `${x}${y}`,
};

const SemigroupNumberAdd: Semigroup<number> = {
  concat: (x, y) => x + y,
};

console.log(concat(SemigroupString, "hello", "world"));
console.log(concat(SemigroupNumberAdd, 10, 20));
