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
    const left2: Either2 = E.left("Left2");

    {
      const result = F.pipe(
        E.of({}),
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
