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
