import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserOutput } from '../dtos/user-output'

export namespace GetUserUseCase {
  export type Input = { id: string }

  export type Output = UserOutput

  export class UseCase {
    constructor(private userRepository: UserRepository.Repository) {}
    async execute(_Input: Input): Promise<Output> {
      const entity = await this.userRepository.findById(_Input.id)
      return entity.toJSON()
    }
  }
}
