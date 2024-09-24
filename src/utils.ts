import {
  DynamoDB,
  DynamoDBClient,
  WriteRequest,
  AttributeValue,
} from "@aws-sdk/client-dynamodb";

enum CUPS {
  table_name = "MEDICAL_CUPS_CODES",
}

const headers = {
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
  "Content-Type": "application/json",
};

// DynamoDB Queries
export class DAO {
  private client: DynamoDBClient;
  private service: DynamoDB;
  constructor() {
    this.client = new DynamoDBClient();
    this.service = new DynamoDB();
  }

  async upload(items: Record<string, AttributeValue>[]) {
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
