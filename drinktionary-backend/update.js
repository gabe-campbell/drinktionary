import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    // 'Key' defines the partition key and sort key of the item to be updated
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      drinkId: event.pathParameters.id
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: "SET drinkTitle = :drinkTitle, mainLiquor = :mainLiquor, glassType = :glassType, " +
                          "liquorOne = :liquorOne, liquorOneAmount = :liquorOneAmount, " +
                          "liquorTwo = :liquorTwo, liquorTwoAmount = :liquorTwoAmount, " +
                          "liquorThree = :liquorThree, liquorThreeAmount = :liquorThreeAmount, " +
                          "mixerOne = :mixerOne, mixerOneAmount = :mixerOneAmount, " +
                          "mixerTwo = :mixerTwo, mixerTwoAmount = :mixerTwoAmount, " +
                          "mixerThree = :mixerThree, mixerThreeAmount = :mixerThreeAmount, " +
                          "garnish = :garnish, description = :description, " +
                          "content = :content, attachment = :attachment",
    ExpressionAttributeValues: {
      ":drinkTitle": data.drinkTitle || null,
      ":mainLiquor": data.mainLiquor || null,
      ":glassType": data.glassType || null,
      ":liquorOne": data.liquorOne || null,
      ":liquorOneAmount": data.liquorOneAmount || null,
      ":liquorTwo": data.liquorTwo || null,
      ":liquorTwoAmount": data.liquorTwoAmount || null,
      ":liquorThree": data.liquorThree || null,
      ":liquorThreeAmount": data.liquorThreeAmount || null,
      ":mixerOne": data.mixerOne || null,
      ":mixerOneAmount": data.mixerOneAmount || null,
      ":mixerTwo": data.mixerTwo || null,
      ":mixerTwoAmount": data.mixerTwoAmount || null,
      ":mixerThree": data.mixerThree || null,
      ":mixerThreeAmount": data.mixerThreeAmount || null,
      ":garnish": data.garnish || null,
      ":description": data.description || null,
      ":attachment": data.attachment || null,
      ":content": data.content || null
    },
    // 'ReturnValues' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update; you
    // can inspect 'result' below to see how it works with different settings
    ReturnValues: "ALL_NEW"
  };

  try {
    await dynamoDbLib.call("update", params);
    console.log("You are getting here");
    return success({ status: true });
  } catch (e) {
    console.log("You are failing here");
    return failure({ status: false });
  }
}
