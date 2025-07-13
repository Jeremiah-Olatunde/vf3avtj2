import * as R from "fp-ts/Refinement";

{
  type ResponseEuccess = "200" | "201";
  type ResponseErrorServer = "500" | "501";
  type ResponseErrorClient = "400" | "401" | "404" | "409";
  type Response = ResponseErrorClient | ResponseErrorServer | ResponseEuccess;

  type RefinementResponse = R.Refinement<string, Response>;
  const isResponse: RefinementResponse = (r: string): r is Response => {
    return ["200", "201", "400", "401", "404", "409", "500", "501"].includes(r);
  };
}
