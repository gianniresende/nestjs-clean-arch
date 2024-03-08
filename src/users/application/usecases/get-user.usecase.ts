import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserOutput, UserOutputMapper } from '../dtos/user-output'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'

export namespace GetUserUseCase {
  export type Input = { id: string }

  export type Output = UserOutput

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private userRepository: UserRepository.Repository) {}
    async execute(_Input: Input): Promise<Output> {
      const entity = await this.userRepository.findById(_Input.id)
      return UserOutputMapper.toOutput(entity)
    }
  }
}
