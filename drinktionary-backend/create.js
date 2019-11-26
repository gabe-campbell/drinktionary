import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      drinkId: uuid.v1(),
      drinkTitle: data.drinkTitle,
      mainLiquor: data.mainLiquor,
      glassType: data.glassType,
      liquorOne: data.liquorOne,
      liquorOneAmount: data.liquorOneAmount,
      liquorTwo: data.liquorTwo,
      liquorTwoAmount: data.liquorTwoAmount,
      liquorThree: data.liquorThree,
      liquorThreeAmount: data.liquorThreeAmount,
      mixerOne: data.mixerOne,
      mixerOneAmount: data.mixerOneAmount,
      mixerTwo: data.mixerTwo,
      mixerTwoAmount: data.mixerTwoAmount,
      mixerThree: data.mixerThree,
      mixerThreeAmount: data.mixerThreeAmount,
      garnish: data.garnish,
      description: data.description,
      attachment: data.attachment,
      content: data.content,
      createdAt: Date.now()
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    console.log("It is getting here");
    return success(params.Item);
  } catch (e) {
    console.log(e);
    console.log("It is failing here");
    return failure({ status: false });
  }
}
