import { AuthSuccessResult } from '@/application/dtos/user/auth-success.result'
import { User } from '@/domain/models/user'
import { AuthService } from '@/domain/services/auth.service'
import { DynamodbUserRepository } from '@/infrastructure/repositories/dynamodb.user.repository'
import { CognitoUserService } from '@/infrastructure/services/cognito-user.service'

export class AuthServiceImpl implements AuthService {
  constructor(readonly cognitoUserService: CognitoUserService, readonly userRepository: DynamodbUserRepository) {}

  async registerUser(user: User, password: string): Promise<User> {
    // TODO: should be safe using a transaction
    // Store user in Cognito
    await this.cognitoUserService.createUser(user.email)
    // Set permanent password for the user
    await this.cognitoUserService.setUserPassword(user.email, password)
    // Store user in Dynamodb
    return await this.userRepository.create(user)
  }

  async authenticateUser(email: string, password: string): Promise<AuthSuccessResult> {
    return this.cognitoUserService.authenticateUser(email, password)
  }
}