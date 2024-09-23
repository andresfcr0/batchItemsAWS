import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { readFileSync } from "fs";
import { DAO, errorResponse, successResponse } from "./utils";

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    const dao = new DAO();

    const file = readFileSync("cups_codes.json", "utf8");
    const codes = JSON.parse(file);
    await dao.upload(codes);

    return successResponse({ ok: "ok" });
  } catch (error: any) {
    return errorResponse("Error: " + error.message);
  }
}
