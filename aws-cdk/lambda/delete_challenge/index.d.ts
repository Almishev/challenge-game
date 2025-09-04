import { APIGatewayProxyEventV2 } from 'aws-lambda';
export declare const handler: (event: APIGatewayProxyEventV2) => Promise<{
    statusCode: number;
    body: string;
    headers?: undefined;
} | {
    statusCode: number;
    headers: {
        'Content-Type': string;
        'Access-Control-Allow-Origin': string;
        'Access-Control-Allow-Headers': string;
        'Access-Control-Allow-Methods': string;
    };
    body: string;
}>;
