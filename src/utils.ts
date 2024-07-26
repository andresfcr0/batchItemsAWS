import {
  BatchWriteItemCommand,
  BatchWriteItemCommandInput,
  DynamoDB,
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
  WriteRequest,
  ScanCommand,
  AttributeValue,
} from "@aws-sdk/client-dynamodb";
import { decode } from "jsonwebtoken";

class InvalidRequest extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = "InvalidRequest";
  }
}

export enum FeatureNames {
  table_name = "MEDICAL_FEATURE_NAMES",
  category = "category",
  values = "values",
}

export enum Prediction {
  table_name = "MEDICAL_PREDICTIONS",
  id = "id",
  payload = "payload",
  date = "date",
  user_id = "user_id",
  patient_id = "patient_id",
  status = "status",
  prediction = "prediction",
}

export enum Patient {
  table_name = "MEDICAL_PATIENT",
  id = "id",
  user_id = "user_id",
  tracker = "tracker",
  dob = "dob",
  gender = "gender",
  created_at = "created_at",
}

export enum Outcome {
  table_name = "MEDICAL_OUTCOME",
  id = "id",
  prediction_id = "prediction_id",
  date = "date",
  payload = "payload",
}

enum CUPS {
  table_name = "MEDICAL_CUPS_CODES",
}

enum User {
  table_name = "MEDICAL_USER",
  id = "id",
  name = "name",
  email = "email",
}

enum Status {
  pending = "PENDING",
  completed = "COMPLETED",
}

interface cups {
  code: { S: string };
  value: { S: string };
}

const headers = {
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
  "Content-Type": "application/json",
};

// Validation Functions
export function validUUID(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id
  );
}

export function JWT(code: string | undefined): { [k: string]: any } {
  if (!code) throw new InvalidRequest("Not Authorized");
  const payload = decode(code.split(" ")[1]);
  if (!payload) throw new InvalidRequest("Not Authorized");
  return payload as { [k: string]: any };
}

// DynamoDB Queries
export class DAO {
  private client: DynamoDBClient;
  private service: DynamoDB;
  constructor() {
    this.client = new DynamoDBClient();
    this.service = new DynamoDB();
  }
  async userExists(email: string) {
    const params = {
      TableName: User.table_name,
      FilterExpression: "#email = :email",
      ExpressionAttributeNames: {
        "#email": User.email,
      },
      ExpressionAttributeValues: {
        ":email": { S: email },
      },
      ProjectionExpression: `${Prediction.id}`,
    };
    const data = await this.client.send(new ScanCommand(params));
    return data.Items?.length ? data.Items[0][User.id].S : false;
  }

  async getParams() {
    const params = {
      TableName: FeatureNames.table_name,
      ProjectionExpression: `${FeatureNames.category}`,
    };
    const data = await this.client.send(new ScanCommand(params));
    return data.Items;
  }

  async createPrediction(items: Record<string, AttributeValue>[]) {
    const puts: WriteRequest[] = items.map((item) => {
      return {
        PutRequest: {
          Item: item,
        },
      };
    });

    let counter = 0;
    let fromvalue = 0;
    while (counter < puts.length) {
      fromvalue = counter;
      counter += 25;
      console.log({ counter, fromvalue });
      for (let index = fromvalue; index < counter; index++) {
        const value = puts.slice(fromvalue, counter);
        await this.service.batchWriteItem({
          RequestItems: {
            [CUPS.table_name]: value,
          },
        });
      }
    }
  }
}

export function extractValues(obj: { [k: string]: any }): any {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(extractValues);
  }

  if ("M" in obj) {
    return extractValues(obj["M"]);
  }
  if ("S" in obj) {
    return obj["S"];
  }
  if ("N" in obj) {
    return Number(obj["N"]);
  }

  const newObj: { [k: string]: any } = {};
  for (const key of Object.keys(obj)) {
    newObj[key] = extractValues(obj[key]);
  }
  return newObj;
}

export function successResponse(body: { [k: string]: any }) {
  return { statusCode: 200, body: JSON.stringify(body), headers: headers };
}

export function errorResponse(error: string) {
  return {
    statusCode: 409,
    body: JSON.stringify({
      message: "Ocurrio un error durante el procesamiento de la informacion",
      error: error,
    }),
    headers: headers,
  };
}
