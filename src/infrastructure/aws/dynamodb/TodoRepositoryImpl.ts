import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand
} from '@aws-sdk/lib-dynamodb'

import { Todo } from '@/domain/entities/Todo'
import { Repository } from '@/domain/interfaces/Repository'
import { Config } from '@/infrastructure/Config'

import { dynamoDBClient } from './DynamoDB'

const documentClient = DynamoDBDocumentClient.from(dynamoDBClient, {
  marshallOptions: {
    convertClassInstanceToMap: true,
    removeUndefinedValues: true
  }
})

export class TodoRepositoryImpl implements Repository<Todo> {
  private readonly tableName
  constructor (readonly config: Config) {
    this.tableName = this.config.todosTable
  }

  async create (todo: Todo): Promise<Todo> {
    const params = {
      TableName: this.tableName,
      Item: todo
    }

    await documentClient.send(new PutCommand(params))
    return todo
  }

  async findById (id: string): Promise<Todo | null> {
    const params = {
      TableName: this.tableName,
      Key: { id }
    }

    const result = await documentClient.send(new GetCommand(params))
    return result.Item as Todo || null
  }

  async findAll (): Promise<Todo[]> {
    const params = {
      TableName: this.tableName
    }

    const result = await documentClient.send(new ScanCommand(params))
    return result.Items as Todo[] || []
  }

  async update (todo: Todo): Promise<Todo> {
    const params = {
      TableName: this.tableName,
      Key: { todoId: todo.todoId },
      UpdateExpression: 'set title = :title, description = :description, userId = :userId, status = :status',
      ExpressionAttributeValues: {
        ':title': todo.title,
        ':description': todo.description,
        ':userId': todo.userId,
        ':status': todo.status
      },
      ReturnValues: 'ALL_NEW'
    }

    const result = await documentClient.send(new UpdateCommand(params))
    return result.Attributes as Todo
  }

  async delete (id: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { id }
    }

    await documentClient.send(new DeleteCommand(params))
  }
}