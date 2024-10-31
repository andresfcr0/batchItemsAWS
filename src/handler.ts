import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { readFileSync } from "fs";
import { DAO, errorResponse, successResponse } from "./utils";

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    const dao = new DAO();

    const cups = readFileSync("cups_codes.json", "utf8");
    const codes = JSON.parse(cups);

    const feature = readFileSync("feature_names.json", "utf8");
    const names = JSON.parse(feature);

    await dao.uploadFeatures(names);
    await dao.uploadCups(codes);

    return successResponse({ ok: "ok" });
  } catch (error: any) {
    return errorResponse("Error: " + error.message);
  }
}
