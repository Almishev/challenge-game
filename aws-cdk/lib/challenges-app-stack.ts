import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';

export class ChallengesAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const projectName = 'challenges-app';

    // DynamoDB tables
    const categoriesTable = new dynamodb.Table(this, 'CategoriesTable', {
      tableName: `${projectName}-categories`,
      partitionKey: { name: 'category_id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const challengesTable = new dynamodb.Table(this, 'ChallengesTable', {
      tableName: `${projectName}-challenges`,
      partitionKey: { name: 'challenge_id', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'category_id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    challengesTable.addGlobalSecondaryIndex({
      indexName: 'CategoryIndex',
      partitionKey: { name: 'category_id', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // Lambda function factory
    const createLambda = (name: string, handlerDir: string, env?: Record<string, string>) =>
      new lambda.Function(this, `${name}Fn`, {
        functionName: `${projectName}-${name}`,
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: 'index.handler',
        code: lambda.Code.fromAsset(path.join(__dirname, `../lambda/${handlerDir}`)),
        timeout: cdk.Duration.seconds(30),
        environment: env,
      });

    // Lambdas
    const getCategoriesFn = createLambda('get-categories', 'get_categories', {
      CATEGORIES_TABLE: categoriesTable.tableName,
    });

    const getChallengesFn = createLambda('get-challenges', 'get_challenges', {
      CHALLENGES_TABLE: challengesTable.tableName,
    });

    const createChallengeFn = createLambda('create-challenge', 'create_challenge', {
      CHALLENGES_TABLE: challengesTable.tableName,
    });

    const updateChallengeFn = createLambda('update-challenge', 'update_challenge', {
      CHALLENGES_TABLE: challengesTable.tableName,
    });

    const deleteChallengeFn = createLambda('delete-challenge', 'delete_challenge', {
      CHALLENGES_TABLE: challengesTable.tableName,
    });

    // Permissions
    categoriesTable.grantReadData(getCategoriesFn);

    challengesTable.grantReadData(getChallengesFn);
    challengesTable.grantWriteData(createChallengeFn);
    challengesTable.grantWriteData(updateChallengeFn);
    challengesTable.grantWriteData(deleteChallengeFn);

    // API Gateway
    const api = new apigw.RestApi(this, 'ChallengesApi', {
      restApiName: `${projectName}-api`,
      deployOptions: {
        stageName: 'dev',
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS,
        allowMethods: apigw.Cors.ALL_METHODS,
      },
    });

    const categories = api.root.addResource('categories');
    categories.addMethod('GET', new apigw.LambdaIntegration(getCategoriesFn));

    const challenges = api.root.addResource('challenges');
    challenges.addMethod('GET', new apigw.LambdaIntegration(getChallengesFn));
    challenges.addMethod('POST', new apigw.LambdaIntegration(createChallengeFn));

    const challengesByCategory = challenges.addResource('{category}');
    const challengeById = challengesByCategory.addResource('{id}');

    challengesByCategory.addMethod('GET', new apigw.LambdaIntegration(getChallengesFn));
    challengeById.addMethod('PUT', new apigw.LambdaIntegration(updateChallengeFn));
    challengeById.addMethod('DELETE', new apigw.LambdaIntegration(deleteChallengeFn));

    new cdk.CfnOutput(this, 'ApiUrl', { value: api.url ?? 'undefined' });
    new cdk.CfnOutput(this, 'CategoriesTableName', { value: categoriesTable.tableName });
    new cdk.CfnOutput(this, 'ChallengesTableName', { value: challengesTable.tableName });
  }
}
