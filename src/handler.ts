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

    const feat = readFileSync("features.json", "utf8");
    const features = JSON.parse(feat);

    console.log(features[0]);
    console.log(features[1]);
    console.log(features[2]);
    console.log(features[3]);

    // await dao.uploadFeatureNames(names);
    // await dao.uploadCups(codes);
    await dao.uploadFeatures(features);

    return successResponse({ ok: "ok" });
  } catch (error: any) {
    return errorResponse("Error: " + error.message);
  }
}
