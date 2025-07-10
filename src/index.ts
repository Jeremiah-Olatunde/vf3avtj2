import assert from "node:assert";
import * as E from "fp-ts/Either";

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
