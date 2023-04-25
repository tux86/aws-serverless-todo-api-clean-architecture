import { AWS } from '@serverless/typescript'

import { cognitoUserPool } from '@/infrastructure/iac/ressources/cognito/user-pool'
import { dynamodbTodosTable } from '@/infrastructure/iac/ressources/dynamodb/todos-table'
import { dynamodbUsersTable } from '@/infrastructure/iac/ressources/dynamodb/users-table'

export const usersTable = dynamodbUsersTable()
export const todosTable = dynamodbTodosTable()
export const userPool = cognitoUserPool()

export const resources = (): AWS['resources'] => {
  return {
    Resources: {
      ...usersTable.resources,
      ...todosTable.resources,
      ...userPool.resources
    },
    Outputs: {
      ...userPool.outputs
    }
  }
}
