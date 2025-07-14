import assert from "node:assert";

import * as IO from "fp-ts/IO";

import * as Apply from "fp-ts/Apply";

import * as FCore from "fp-ts/function";
import * as FStd from "fp-ts-std/Function";

const F = { ...FCore, ...FStd };

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

(async function () {
  // Task.bindTo

  const actual = await F.pipe(
    T.of("x"),
    T.bindTo("x"),
    T.bind("y", ({ x }) => T.of(`${x}y`)),
    T.bind("z", ({ y }) => T.of(`${y}z`)),
    T.execute,
  );

  const expect = { x: "x", y: "xy", z: "xyz" };
  assert.deepStrictEqual(actual, expect);
})();

(async function () {
  // Task.let

  type Person = {
    age: number;
    married: boolean;
    name: string;
    nationality: string;
    birthYear: number;
  };

  function person(
    name: string,
    age: number,
    married: boolean,
    nationality: string,
    birthYear: number,
  ): Person {
    return { name, age, married, nationality, birthYear };
  }

  const taskAge = T.of(24);
  const taskMarried = T.of(false);
  const taskName = T.of("jesuseun jeremiah olatunde");

  const actual = await F.pipe(
    T.Do,
    T.apS("age", taskAge),
    T.apS("name", taskName),
    T.apS("married", taskMarried),
    T.let("nationality", F.constant("nigerian")),
    T.let("birthYear", ({ age }) => 2025 - age),
    T.map(({ age, married, name, nationality, birthYear }) => {
      return person(name, age, married, nationality, birthYear);
    }),
    T.execute,
  );

  const expect = person(
    "jesuseun jeremiah olatunde",
    24,
    false,
    "nigerian",
    2001,
  );

  assert.deepStrictEqual(actual, expect);
})();

(async function () {
  //  Task.delay

  const commence = performance.now();
  const actual = await F.pipe(T.of(42), T.delay(1000), T.execute);
  const conclude = performance.now();
  const duration = Math.round((conclude - commence) / 1000);

  assert.deepStrictEqual(actual, 42);
  assert.deepStrictEqual(duration, 1);
})();

(async function () {
  //  Task.AppliativePar

  const { ap, of, map } = T.ApplicativePar;
  const Applicative = T.ApplicativePar;

  {
    type Person = {
      age: number;
      married: boolean;
      name: string;
    };

    function person(name: string, age: number, married: boolean): Person {
      return { name, age, married };
    }

    const personC = F.curry3(person);

    const age = F.pipe(T.of(23), T.delay(1000));
    const married = F.pipe(T.of(false), T.delay(2000));
    const name = F.pipe(T.of("jesuseun jeremiah olatunde"), T.delay(500));

    const inspect = ap(ap(ap(of(personC), name), age), married);

    const commence = performance.now();
    const actual = await F.pipe(inspect, T.execute);
    const conclude = performance.now();
    const duration = Math.round((conclude - commence) / 1000);

    const expect = person("jesuseun jeremiah olatunde", 23, false);
    assert.deepStrictEqual(actual, expect);
    assert.deepStrictEqual(duration, 2);
  }

  {
    const commence = performance.now();
    const actual = await T.execute(map(T.delay(1000)(T.of(42)), F.increment));
    const conclude = performance.now();
    const duration = Math.round((conclude - commence) / 1000);

    assert.deepStrictEqual(actual, 43);
    assert.deepStrictEqual(duration, 1);
  }

  {
    const apS = Apply.apS(Applicative);

    const age = F.pipe(T.of(24), T.delay(1000));
    const married = F.pipe(T.of(false), T.delay(2000));
    const name = F.pipe(T.of("jesuseun jeremiah olatunde"), T.delay(3000));

    type Person = {
      age: number;
      married: boolean;
      name: string;
    };

    function person(name: string, age: number, married: boolean): Person {
      return { name, age, married };
    }

    const task = F.pipe(
      T.Do,
      apS("name", name),
      apS("age", age),
      apS("married", married),
      T.map(({ age, married, name }) => {
        return person(name, age, married);
      }),
    );

    const commence = performance.now();
    const actual = await T.execute(task);
    const conclude = performance.now();
    const duration = Math.round((conclude - commence) / 1000);

    const expect = person("jesuseun jeremiah olatunde", 24, false);
    assert.deepStrictEqual(actual, expect);
    assert.deepStrictEqual(duration, 3);
  }

  {
    const sequenceT = Apply.sequenceT(Applicative);

    const age = F.pipe(T.of(24), T.delay(1000));
    const married = F.pipe(T.of(false), T.delay(2000));
    const name = F.pipe(T.of("jesuseun jeremiah olatunde"), T.delay(3000));

    const task = sequenceT(name, age, married);

    const commence = performance.now();
    const actual = await T.execute(task);
    const conclude = performance.now();
    const duration = Math.round((conclude - commence) / 1000);

    const expect = ["jesuseun jeremiah olatunde", 24, false] as const;
    assert.deepStrictEqual(actual, expect);
    assert.deepStrictEqual(duration, 3);
  }
})();

(async function () {
  // Task.sequenceArray

  const a = T.delay(1000)(T.of("a"));
  const b = T.delay(2000)(T.of("b"));
  const c = T.delay(1000)(T.of("c"));

  const task = T.sequenceArray([a, b, c]);

  const commence = performance.now();
  const actual = await T.execute(task);
  const conclude = performance.now();
  const duration = Math.round((conclude - commence) / 1000);

  const expect = ["a", "b", "c"];
  assert.deepStrictEqual(actual, expect);
  assert.deepStrictEqual(duration, 2);
})();

(async function () {
  // Task.sequenceSeqArray

  const a = T.delay(500)(T.of("a"));
  const b = T.delay(1000)(T.of("b"));
  const c = T.delay(500)(T.of("c"));

  const task = T.sequenceSeqArray([a, b, c]);

  const commence = performance.now();
  const actual = await T.execute(task);
  const conclude = performance.now();
  const duration = Math.round((conclude - commence) / 1000);

  const expect = ["a", "b", "c"];
  assert.deepStrictEqual(actual, expect);
  assert.deepStrictEqual(duration, 2);
})();

(async function () {
  type User = {
    name: string;
    age: number;
  };

  const user = (name: string, age: number) => ({ name, age });

  function fetchUser(username: "jeremiah" | "nehemiah" | "roman"): Task<User> {
    const database = {
      jeremiah: user("jeremiah olatunde", 23),
      nehemiah: user("nehemiah olatunde", 19),
      roman: user("roman unuose", 22),
    } as const;

    return T.delay(1000)(T.of(database[username]));
  }

  (async function () {
    // Task.traverseArray

    const toFetch = ["jeremiah", "roman"] as const;
    const task = T.traverseArray(fetchUser)(toFetch);

    const commence = performance.now();
    const actual = await T.execute(task);
    const conclude = performance.now();
    const duration = Math.round((conclude - commence) / 1000);

    const expect = [user("jeremiah olatunde", 23), user("roman unuose", 22)];
    assert.deepStrictEqual(actual, expect);
    assert.deepStrictEqual(duration, 1);
  })();

  (async function () {
    // Task.traverseSeqArray
    //
    const toFetch = ["nehemiah", "roman"] as const;
    const task = T.traverseSeqArray(fetchUser)(toFetch);

    const commence = performance.now();
    const actual = await T.execute(task);
    const conclude = performance.now();
    const duration = Math.round((conclude - commence) / 1000);

    const expect = [user("nehemiah olatunde", 19), user("roman unuose", 22)];
    assert.deepStrictEqual(actual, expect);
    assert.deepStrictEqual(duration, 2);
  })();
})();
