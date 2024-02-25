import { UserRepository } from '@/users/domain/repositories/user.repository'
import { BadRequestError } from './errors/bad-request-error'
import { UserEntity } from '@/users/domain/entities/user.entity'

export namespace SignupUseCase {
  export type Input = {
    name: string
    email: string
    password: string
  }

  export type Output = {
    id: string
    name: string
    email: string
    password: string
    CreatedAt?: Date
  }

  export class UseCase {
    constructor(private userRepository: UserRepository.Repository) {}
    async execute(_Input: Input): Promise<Output> {
      const { name, email, password } = _Input
      if (!name || !email || !password) {
        throw new BadRequestError('Input data not provided')
      }
      await this.userRepository.emailExists(email)
      const entity = new UserEntity(_Input)
      await this.userRepository.insert(entity)
      return entity.toJSON()
    }
  }
}
