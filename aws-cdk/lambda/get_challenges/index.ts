import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

export const handler = async (event: APIGatewayProxyEventV2) => {
  const tableName = process.env.CHALLENGES_TABLE!;
  const category = event?.pathParameters?.category;

  if (category) {
    const res = await ddb.send(new QueryCommand({
      TableName: tableName,
      IndexName: 'CategoryIndex',
      KeyConditionExpression: 'category_id = :c',
      ExpressionAttributeValues: { ':c': category },
    }));
    return { statusCode: 200, body: JSON.stringify(res.Items ?? []) };
  }

  const res = await ddb.send(new ScanCommand({ TableName: tableName }));
  return { statusCode: 200, body: JSON.stringify(res.Items ?? []) };
};
