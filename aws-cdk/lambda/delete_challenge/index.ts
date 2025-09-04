import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, DeleteCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

export const handler = async (event: APIGatewayProxyEventV2) => {
  const tableName = process.env.CHALLENGES_TABLE!;
  const id = event.pathParameters?.id;
  const category = event.pathParameters?.category;

  if (!id || !category) return { statusCode: 400, body: 'Missing path parameters' };

  await ddb.send(new DeleteCommand({
    TableName: tableName,
    Key: { challenge_id: id, category_id: category },
  }));
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  };
  return { statusCode: 204, headers, body: '' };
};
