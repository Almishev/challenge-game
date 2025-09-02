import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

export const handler = async (event: APIGatewayProxyEventV2) => {
  const tableName = process.env.CHALLENGES_TABLE!;
  const body = event.body ? JSON.parse(event.body) : {};

  const item = {
    challenge_id: randomUUID(),
    category_id: body.category_id,
    name: body.name,
    description: body.description,
    difficulty: body.difficulty ?? 'medium',
    duration: body.duration ?? '',
    created_at: Date.now(),
  };

  await ddb.send(new PutCommand({ TableName: tableName, Item: item }));

  return { statusCode: 201, body: JSON.stringify(item) };
};
