import type { AWS } from '@serverless/typescript'

import { functions } from './functions'
import { createDefaultIam } from './iam/defaultIam'
import { createUserPool } from './ressources/cognitoUserPool'
import { createTodoDynamodbTable } from './ressources/dynamodb'

const todoDynamodbTable = createTodoDynamodbTable()
const cognitoUserPool = createUserPool()
const defaultIam = createDefaultIam({
  userPoolArn: cognitoUserPool.userPoolArn,
  tableArn: todoDynamodbTable.tableArn
})

export const serverlessConfiguration: AWS = {
  service: 'todo-api',
  frameworkVersion: '3',
  useDotenv: true,
  plugins: ['serverless-esbuild', 'serverless-offline'],
  package: { individually: true },
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    stage: '${opt:stage, "dev"}',
    region: 'eu-west-1',
    architecture: 'arm64',
    memorySize: 128,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      // TODO: move to the target lambda environement
      COGNITO_USER_POOL_ID: cognitoUserPool.userPoolId,
      COGNITO_APP_CLIENT_ID: cognitoUserPool.userPoolClientId,
      DYNAMODB_TABLE: todoDynamodbTable.tableName
    },
    iam: defaultIam
  },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node18',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
      watch: {
        pattern: ['src/**/*.ts']
      }
    }
  },
  functions,
  resources: {
    Resources: {
      ...todoDynamodbTable.resources,
      ...cognitoUserPool.resources
    }
  }
}
