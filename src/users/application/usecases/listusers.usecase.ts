import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { SearchInput } from '@/shared/application/dtos/search-input'

export namespace ListUsersUseCase {
  export type Input = SearchInput

  export type Output = void

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private userRepository: UserRepository.Repository) {}
    async execute(_Input: Input): Promise<Output> {
      const params = new UserRepository.SearchParams(_Input)
      const searchResult = await this.userRepository.search(params)
      return
    }
  }
}
