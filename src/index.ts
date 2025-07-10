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
