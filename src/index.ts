import assert from "node:assert";
import * as E from "fp-ts/Either";
import * as F from "fp-ts/function";
import * as A from "fp-ts/ReadonlyArray";

{
  type EitherA = E.Either<"LeftA", "RightA">;
  const rightA: EitherA = E.of("RightA");
  const leftA: EitherA = E.left("LeftA");

  type EitherB = E.Either<"LeftB", "RightB">;
  const rightB: EitherB = E.of("RightB");
  const leftB: EitherB = E.left("LeftB");

  {
    const actual = F.pipe(
      rightA,
      E.tap(() => rightB),
    );
    const expect = E.of("RightA");
    assert.deepStrictEqual(actual, expect);
  }

  {
    const actual = F.pipe(
      leftA,
      E.tap(() => rightB),
    );
    const expect = E.left("LeftA");
    assert.deepStrictEqual(actual, expect);
  }

  {
    const actual = F.pipe(
      rightA,
      E.tap(() => leftB),
    );
    const expect = E.left("LeftB");
    assert.deepStrictEqual(actual, expect);
  }

  {
    type User = { name: string; age: number };
    type EitherGetUsers = E.Either<"ErrorNetwork", readonly User[]>;

    const ErrorEmptyArray = F.constant("ErrorEmptyArray" as const);
    const head = F.flow(A.head, E.fromOption(ErrorEmptyArray));

    {
      const users: EitherGetUsers = E.of([]);
      const actual = F.pipe(users, E.tap(head));
      const expect = E.left("ErrorEmptyArray");
      assert.deepStrictEqual(actual, expect);
    }

    {
      const users: EitherGetUsers = E.left("ErrorNetwork");
      const actual = F.pipe(users, E.tap(head));
      const expect = E.left("ErrorNetwork");
      assert.deepStrictEqual(actual, expect);
    }

    {
      const jeremiah = { name: "Jeremiah", age: 23 };
      const nehemiah = { name: "nehemiah", age: 18 };
      const users: EitherGetUsers = E.right([jeremiah, nehemiah]);
      const actual = F.pipe(users, E.tap(head));
      const expect = E.right([jeremiah, nehemiah]);
      assert.deepStrictEqual(actual, expect);
    }
  }
}

{
  // Either.of, Either.right, Either.left
  {
    const result = E.of("goodbye Earth");
    assert(result._tag === "Right");
  }

  {
    const result = E.right("hello Mars");
    assert(result._tag === "Right");
  }

  {
    const result = E.left("crashed into the moon");
    assert(result._tag === "Left");
  }
}

{
  // either.fromNullable
  {
    const inspect = E.fromNullable("ErrorNullValue")(false);
    assert.deepStrictEqual(inspect, E.right(false));
  }

  {
    const inspect = E.fromNullable("ErrorNullValue")(null);
    assert.deepStrictEqual(inspect, E.left("ErrorNullValue"));
  }

  {
    const inspect = E.fromNullable("ErrorNullValue")(undefined);
    assert.deepStrictEqual(inspect, E.left("ErrorNullValue"));
  }

  {
    const name = "Jeremiah Olatunde";
    const inspect = E.fromNullable("ErrorNullValue")({ name });
    assert.deepStrictEqual(inspect, E.right({ name }));
  }
}

{
  // either.fromOption
  {
    const xs: readonly number[] = [0, 1, 2];
    const inspect = E.fromOption(F.constant("ErrorNoneValue"))(A.head(xs));
    assert.deepStrictEqual(inspect, E.right(0));
  }

  {
    const xs: readonly number[] = [];
    const inspect = E.fromOption(F.constant("ErrorNoneValue"))(A.head(xs));
    assert.deepStrictEqual(inspect, E.left("ErrorNoneValue"));
  }
}

{
  // either.toUnion
  {
    const either: E.Either<"Left", "Right"> = E.left("Left");
    const inspect = E.toUnion(either);
    assert.deepStrictEqual(inspect, "Left");
  }

  {
    const either: E.Either<"Left", "Right"> = E.right("Right");
    const inspect = E.toUnion(either);
    assert.deepStrictEqual(inspect, "Right");
  }
}

{
  // either.apS
  {
    type ErrorLeft = "LeftA" | "LeftB";
    type EitherA = E.Either<ErrorLeft, { rightA: "RightA" }>;
    type EitherB = E.Either<ErrorLeft, "RightB">;

    const rightA: EitherA = E.right({ rightA: "RightA" });
    const leftA: EitherA = E.left("LeftA");

    const rightB: EitherB = E.right("RightB");
    const leftB: EitherB = E.left("LeftB");

    {
      const result = F.pipe(rightA, E.apS("rightB", rightB));
      const expect = E.of({ rightA: "RightA", rightB: "RightB" });
      assert.deepStrictEqual(result, expect);
    }

    {
      const result = F.pipe(leftA, E.apS("rightB", rightB));
      const expect = E.left("LeftA");
      assert.deepStrictEqual(result, expect);
    }

    {
      const result = F.pipe(rightA, E.apS("rightB", leftB));
      const expect = E.left("LeftB");
      assert.deepStrictEqual(result, expect);
    }

    {
      const result = F.pipe(leftA, E.apS("rightB", leftB));
      const expect = E.left("LeftA");
      assert.deepStrictEqual(result, expect);
    }
  }

  {
    type LeftAll = "Left0" | "Left1" | "Left2";

    type Either0 = E.Either<LeftAll, "Right0">;
    const right0: Either0 = E.right("Right0");
    const left0: Either0 = E.left("Left0");

    type Either1 = E.Either<LeftAll, "Right1">;
    const right1: Either1 = E.right("Right1");
    const left1: Either1 = E.left("Left1");

    type Either2 = E.Either<LeftAll, "Right2">;
    const right2: Either2 = E.right("Right2");
    // const left2: Either2 = E.left("Left2");

    {
      const result = F.pipe(
        E.Do,
        E.apS("result0", right0),
        E.apS("result1", right1),
        E.apS("result2", right2),
      );

      const expect = E.right({
        result0: "Right0",
        result1: "Right1",
        result2: "Right2",
      });

      assert.deepStrictEqual(result, expect);
    }

    {
      const result = F.pipe(
        E.of({}),
        E.apS("result0", left0),
        E.apS("result1", left1),
        E.apS("result2", right2),
      );

      const expect = E.left("Left0"); // takes the first left

      assert.deepStrictEqual(result, expect);
    }
  }
}

{
  // either.apSW
  // TODO: define liftN with of apSW
  type EitherNameFirst = E.Either<"ErrorNameFirst", string>;
  const eitherNameFirst: EitherNameFirst = E.of("Jesuseun");

  type EitherNameMiddle = E.Either<"ErrorNameMiddle", string>;
  const eitherNameMiddle: EitherNameMiddle = E.of("Jeremiah");

  type EitherNameLast = E.Either<"ErrorNameLast", string>;
  const eitherNameLast: EitherNameLast = E.of("Olatunde");

  type FullNameKeys = "first" | "middle" | "last";
  type FullName = Record<FullNameKeys, string>;

  function fullName({ first, middle, last }: FullName): string {
    return `${first} ${middle} ${last}`;
  }

  const result = F.pipe(
    E.Do,
    E.apSW("first", eitherNameFirst),
    E.apSW("middle", eitherNameMiddle),
    E.apSW("last", eitherNameLast),
    E.map(fullName),
  );

  assert.deepStrictEqual(result, E.of("Jesuseun Jeremiah Olatunde"));
}

{
  // Either.bind, Either.bindW
  // Admittedly a ridiculous example

  type EitherNameFirst = E.Either<"ErrorNameFirst", string>;
  const eitherNameFirst: EitherNameFirst = E.of("Jesuseun");

  type EitherNameMiddle = E.Either<"ErrorNameMiddle", string>;
  const eitherNameMiddle: EitherNameMiddle = E.of("Jeremiah");

  type EitherNameLast = E.Either<"ErrorNameLast", string>;
  const eitherNameLast: EitherNameLast = E.of("Olatunde");

  type FullNameKeys = "first" | "middle" | "last";
  type FullName = Record<FullNameKeys, string>;

  type NameFirst = Pick<FullName, "first">;
  type EitherValidNameFirst = E.Either<"ErrorInvalidFirstName", NameFirst>;

  function validateNameFirst({ first }: NameFirst): EitherValidNameFirst {
    if (first.length < 5) return E.left("ErrorInvalidFirstName");
    return E.right({ first });
  }

  type NameMiddle = Pick<FullName, "middle">;
  type EitherValidNameMiddle = E.Either<"ErrorInvalidMiddleName", NameMiddle>;

  function validateNameMiddle({ middle }: NameMiddle): EitherValidNameMiddle {
    if (middle.length < 5) return E.left("ErrorInvalidMiddleName");
    return E.right({ middle });
  }

  type NameLast = Pick<FullName, "last">;
  type EitherValidNameLast = E.Either<"ErrorInvalidLastName", NameLast>;

  function validateNameLast({ last }: NameLast): EitherValidNameLast {
    if (last.length < 10) return E.left("ErrorInvalidLastName");
    return E.right({ last });
  }

  function fullName({ first, middle, last }: FullName): string {
    return `${first} ${middle} ${last}`;
  }

  const actual = F.pipe(
    E.Do,
    E.bindW("first", (_) => eitherNameFirst),
    E.bindW("middle", (names) =>
      E.tap(eitherNameMiddle, () => validateNameFirst(names)),
    ),
    E.bindW("last", (names) =>
      E.tap(eitherNameLast, () => validateNameMiddle(names)),
    ),
    E.tap((names) => validateNameLast(names)),
    E.map(fullName),
  );

  const expect = E.left("ErrorInvalidLastName");
  assert.deepStrictEqual(actual, expect);
}

{
  // Either.bindTo
  //
  const first = "Jesuseun" as const;
  const middle = "Jeremiah" as const;
  const last = "Olatunde" as const;

  const actual = F.pipe(
    E.right(first),
    E.bindTo("first"),
    E.bind("middle", () => E.right(middle)),
    E.bind("last", () => E.right(last)),
  );

  const expect = E.right({ first, middle, last });

  assert.deepStrictEqual(actual, expect);
}
