const cdk = require('aws-cdk-lib');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const s3 = require('aws-cdk-lib/aws-s3');
const iam = require('aws-cdk-lib/aws-iam');
const lambda = require('aws-cdk-lib/aws-lambda');
const lambdaEventSource = require('aws-cdk-lib/aws-lambda-event-sources');
const events = require('aws-cdk-lib/aws-events');
const targets = require('aws-cdk-lib/aws-events-targets');

class CdkAppStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // ========================================
    // Bucket for storing images
    // ========================================
    // const bucket = new s3.Bucket(this, imageBucket, {
    //   removalPolicy: cdk.RemovalPolicy.DESTROY,
    // });
    // new cdk.CfnOutput(this, 'Bucket', { value: bucket.bucketName });

    const existingBucketArn = 'arn:aws:s3:::my-nest-project-44444';

    const existingBucket = s3.Bucket.fromBucketArn(
      this,
      'ExistingBucket',
      existingBucketArn,
    );
    const bucketName = process.env.BUCKET_NAME;

    // ========================================
    // Role for AWS Lambda
    // ========================================
    const role = new iam.Role(this, 'cdk-rekn-lambdarole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    role.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'rekognition:*',
          'logs:CreateLogGroup',
          'logs:CreateLogStream',
          'logs:PutLogEvents',
          'sqs:*',
        ],
        resources: ['*'],
      }),
    );

    // ========================================
    // DynamoDB table for storing image labels
    // ========================================
    // const table = new dynamodb.Table(this, 'cdk-rekn-imagetable', {
    //   partitionKey: { name: 'Image', type: dynamodb.AttributeType.STRING },
    //   removalPolicy: cdk.RemovalPolicy.DESTROY,
    // });
    // new cdk.CfnOutput(this, 'Table', { value: table.tableName });

    // ========================================
    // AWS Lambda function
    // ========================================

    // 3s lambda
    const thumbnailLambda = new lambda.Function(this, 'cdk-rekn-function', {
      code: lambda.AssetCode.fromAsset('lambda/3s-lambda'),
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      role: role,
      environment: {
        BUCKET_NAME: 'my-nest-project-44444',
      },
    });
    thumbnailLambda.addEventSource(
      new lambdaEventSource.S3EventSource(existingBucket, {
        events: [s3.EventType.OBJECT_CREATED],
      }),
    );

    existingBucket.grantReadWrite(thumbnailLambda);

    //eventBridge lambda

    const eventBridgeLambda = new lambda.Function(
      this,
      'cdk-eventbridge-function',
      {
        code: lambda.AssetCode.fromAsset('lambda/token-lambda/dist'),
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: 'index.handler',
        role: role,
        environment: {
          BUCKET_NAME: 'my-nest-project-44444',
          DB_PORT: '5432',
          DB_USERNAME: 'postgres',
          DB_PASSWORD: 'postgres',
          DB_DATABASE: 'postgres',
          DB_HOST: 'database-1.crmqwukkkrmp.us-east-1.rds.amazonaws.com',
        },
      },
    );

    // eventBridge rule

    const rule = new events.Rule(this, 'Rule', {
      schedule: events.Schedule.rate(cdk.Duration.hours(1)),
    });

    rule.addTarget(new targets.LambdaFunction(eventBridgeLambda));
    eventBridgeLambda.grantInvoke(
      new iam.ServicePrincipal('events.amazonaws.com'),
    );
  }
}

module.exports = { CdkAppStack };
