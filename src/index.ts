import assert from "node:assert";
import * as E from "fp-ts/Either";
import * as F from "fp-ts/function";
import * as A from "fp-ts/ReadonlyArray";

{
  // tap
  const eitherA: E.Either<"LeftA", "RightA"> = E.left("LeftA");
  const eitherB: E.Either<"LeftB", "RightB"> = E.left("LeftB");

  const inspect: E.Either<"LeftA" | "LeftB", "RightA"> = E.tap(
    eitherA,
    (a: "RightA") => {
      return eitherB;
    },
  );
}

{
  const left = E.left("Left");
  const right = E.right(42);
  const ofRight = E.of(42);
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
