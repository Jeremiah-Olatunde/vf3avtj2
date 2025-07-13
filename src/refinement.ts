import assert from "node:assert";
import * as R from "fp-ts/Refinement";

{
  type Success = "200" | "201";
  type ErrorServer = "500" | "501";
  type ErrorClient = "400" | "401" | "404" | "409";
  type Response = ErrorClient | ErrorServer | Success;

  type RefinementResponse = R.Refinement<string, Response>;
  const isResponse: RefinementResponse = (r: string): r is Response => {
    return ["200", "201", "400", "401", "404", "409", "500", "501"].includes(r);
  };

  const ERROR_SERVER = ["500", "501"];
  const ERROR_CLIENT = ["400", "401", "404", "409"];
  const SUCCESS = ["200", "201"];

  type RES = R.Refinement<string, ErrorServer>;
  const isErrorServer: RES = (r: string): r is ErrorServer => {
    return ERROR_SERVER.includes(r);
  };

  type REC = R.Refinement<string, ErrorClient>;
  const isErrorClient: REC = (r: string): r is ErrorClient => {
    return ERROR_CLIENT.includes(r);
  };

  type RS = R.Refinement<string, Success>;
  const isSuccess: RS = (r: string): r is Success => {
    return SUCCESS.includes(r);
  };

  assert.strictEqual(isResponse("300"), false);
  assert.strictEqual(isResponse("423"), false);
  assert.strictEqual(isResponse("404"), true);
  assert.strictEqual(isResponse("500"), true);

  assert.strictEqual(isErrorServer("500"), true);
  assert.strictEqual(isErrorServer("400"), false);

  assert.strictEqual(isErrorClient("400"), true);
  assert.strictEqual(isErrorClient("401"), true);
  assert.strictEqual(isErrorClient("100"), false);

  assert.strictEqual(isSuccess("100"), false);
  assert.strictEqual(isSuccess("200"), true);
}
