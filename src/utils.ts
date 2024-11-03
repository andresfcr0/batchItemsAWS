import {
  DynamoDB,
  WriteRequest,
  AttributeValue,
} from "@aws-sdk/client-dynamodb";

const env = "DEV-B";
// const env = "TEST";
enum CUPS {
  table_name = `${env}-MEDICAL-Core-CupsCodes`,
}

enum FeatureNames {
  table_name = `${env}-MEDICAL-Core-FeatureNames`,
}

enum Features {
  table_name = `${env}-MEDICAL-Core-Features`,
}

const headers = {
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
  "Content-Type": "application/json",
};

// DynamoDB Queries
export class DAO {
  private service: DynamoDB;
  constructor() {
    this.service = new DynamoDB();
  }

  async uploadCups(items: Record<string, AttributeValue>[]) {
    const puts: WriteRequest[] = items.map((item) => {
      return {
        PutRequest: {
          Item: item,
        },
      };
    });

    let counter = 0;
    let fromvalue = 0;
    console.log({ counter, fromvalue, toUpload: puts.length });
    while (counter < puts.length) {
      fromvalue = counter;
      counter += 25;
      for (let index = fromvalue; index < counter; index++) {
        const value = puts.slice(fromvalue, counter);
        await this.service.batchWriteItem({
          RequestItems: {
            [CUPS.table_name]: value,
          },
        });
      }
    }
    console.log({ counter, fromvalue, toUpload: puts.length });
  }

  async uploadFeatureNames(items: Record<string, AttributeValue>[]) {
    const puts: WriteRequest[] = items.map((item) => {
      return {
        PutRequest: {
          Item: item,
        },
      };
    });

    let counter = 0;
    let fromvalue = 0;
    console.log({ counter, fromvalue, toUpload: puts.length });
    while (counter < puts.length) {
      fromvalue = counter;
      counter += 25;
      for (let index = fromvalue; index < counter; index++) {
        const value = puts.slice(fromvalue, counter);
        await this.service.batchWriteItem({
          RequestItems: {
            [FeatureNames.table_name]: value,
          },
        });
      }
    }
    console.log({ counter, fromvalue, toUpload: puts.length });
  }

  async uploadFeatures(items: Record<string, AttributeValue>[]) {
    const puts: WriteRequest[] = items.map((item) => {
      return {
        PutRequest: {
          Item: item,
        },
      };
    });

    let counter = 0;
    let fromvalue = 0;
    console.log({ counter, fromvalue, toUpload: puts.length });
    while (counter < puts.length) {
      fromvalue = counter;
      counter += 25;
      for (let index = fromvalue; index < counter; index++) {
        const value = puts.slice(fromvalue, counter);
        console.log(value[0]);
        console.log(value[24]);
        await this.service.batchWriteItem({
          RequestItems: {
            [Features.table_name]: value,
          },
        });
      }
    }
    console.log({ counter, fromvalue, toUpload: puts.length });
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
