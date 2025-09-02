import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

export const handler = async (event: APIGatewayProxyEventV2) => {
  const tableName = process.env.CHALLENGES_TABLE!;
  const body = event.body ? JSON.parse(event.body) : {};
  const id = event.pathParameters?.id;

  if (!id) return { statusCode: 400, body: 'Missing id' };

  const fields: string[] = [];
  const values: Record<string, any> = {};

  for (const key of ['name', 'description', 'difficulty', 'duration', 'category_id']) {
    if (body[key] !== undefined) {
      fields.push(`${key} = :${key}`);
      values[`:${key}`] = body[key];
    }
  }

  if (fields.length === 0) return { statusCode: 400, body: 'Nothing to update' };

  await ddb.send(new UpdateCommand({
    TableName: tableName,
    Key: { challenge_id: id, category_id: body.category_id },
    UpdateExpression: `SET ${fields.join(', ')}`,
    ExpressionAttributeValues: values,
    ReturnValues: 'ALL_NEW',
  }));

  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
};
