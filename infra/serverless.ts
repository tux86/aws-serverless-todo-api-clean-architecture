import type { AWS } from '@serverless/typescript'
import { stackTags, tags } from '../api/iac/serverless/provider/tags'
import { AWSRegion } from '../common/src/aws/types'
import { UserPool, UserPoolClient, UserPoolOutputs } from './iac/serverless/resources/cogntio-user-pool'
import { UsersTable, UsersTableOutputs } from './iac/serverless/resources/dynamodb-users-table'
import { TodosTable, TodosTableOutputs } from './iac/serverless/resources/dynamodb-todos-table'

export const serverlessConfiguration: AWS = {
  service: 'todo-infra',
  frameworkVersion: '3',
  useDotenv: true,
  configValidationMode: 'error',
  // Define the cloud service provider for the application
  provider: {
    name: 'aws',
    stage: '${opt:stage, "dev"}',
    region: '${param:region}' as AWSRegion,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true
    },
    stackTags,
    tags
  },
  resources: {
    Resources: {
      // cognito
      UserPool,
      UserPoolClient,
      // dynamodb
      UsersTable,
      TodosTable
    },
    Outputs: {
      // cognito
      ...UserPoolOutputs,
      // dynamodb
      ...UsersTableOutputs,
      ...TodosTableOutputs
    }
  }
}

module.exports = serverlessConfiguration
