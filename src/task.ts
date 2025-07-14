import assert from "node:assert";

import * as IO from "fp-ts/IO";

import * as TCore from "fp-ts/Task";
import * as TStd from "fp-ts-std/Task";
import { type Task } from "fp-ts/Task";

const T = { ...TCore, ...TStd };

(async function () {
  const task: Task<string> = T.of("hello task");
  const actual = await T.execute(task);
  assert.deepStrictEqual(actual, "hello task");
})();

(async function () {
  const random = Math.random(); // for testing purpose
  const getRandom: IO.IO<number> = IO.of(random);
  const task = T.fromIO(getRandom);
  const actual = await T.execute(task);
  assert.deepStrictEqual(actual, random);
})();
