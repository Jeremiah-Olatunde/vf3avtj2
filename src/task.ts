import assert from "node:assert";

import * as IO from "fp-ts/IO";
import * as F from "fp-ts/function";

import * as TCore from "fp-ts/Task";
import * as TStd from "fp-ts-std/Task";
import { type Task } from "fp-ts/Task";

const T = { ...TCore, ...TStd };

(async function () {
  // Task.of

  const task: Task<string> = T.of("hello task");
  const actual = await T.execute(task);
  assert.deepStrictEqual(actual, "hello task");
})();

(async function () {
  // Task.fromIO

  const random = Math.random(); // for testing purpose
  const getRandom: IO.IO<number> = IO.of(random);
  const task = T.fromIO(getRandom);
  const actual = await T.execute(task);
  assert.deepStrictEqual(actual, random);
})();

(async function () {
  // Task.apS

  type Person = {
    age: number;
    married: boolean;
    name: string;
  };

  function person(name: string, age: number, married: boolean): Person {
    return { name, age, married };
  }

  const taskAge = T.of(23);
  const taskMarried = T.of(false);
  const taskName = T.of("jesuseun jeremiah olatunde");

  const actual = await F.pipe(
    T.Do,
    T.apS("age", taskAge),
    T.apS("name", taskName),
    T.apS("married", taskMarried),
    T.map(({ age, married, name }) => {
      return person(name, age, married);
    }),
    T.execute,
  );

  const expect = person("jesuseun jeremiah olatunde", 23, false);

  assert.deepStrictEqual(actual, expect);
})();

(async function () {
  //  Task.bind

  const actual = await F.pipe(
    T.Do,
    T.bind("x", () => T.of(`x`)),
    T.bind("y", ({ x }) => T.of(`${x}y`)),
    T.bind("z", ({ y }) => T.of(`${y}z`)),
    T.execute,
  );

  const expect = { x: "x", y: "xy", z: "xyz" };
  assert.deepStrictEqual(actual, expect);
})();
