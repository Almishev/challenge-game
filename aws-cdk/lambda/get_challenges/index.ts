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
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    };
    return { statusCode: 200, headers, body: JSON.stringify(res.Items ?? []) };
  }

  const res = await ddb.send(new ScanCommand({ TableName: tableName }));
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  };
  return { statusCode: 200, headers, body: JSON.stringify(res.Items ?? []) };
};
