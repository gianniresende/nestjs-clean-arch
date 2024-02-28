import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserOutput, UserOutputMapper } from '../dtos/user-output'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error'
import { HashProvider } from '@/shared/application/providers/hash-provider'

export namespace UpdatePasswordUseCase {
  export type Input = {
    id: string
    password: string
    old_password: string
  }

  export type Output = UserOutput

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private userRepository: UserRepository.Repository,
      private hashProvider: HashProvider,
    ) {}

    async execute(_Input: Input): Promise<Output> {
      const entity = await this.userRepository.findById(_Input.id)
      if (!_Input.password || !_Input.old_password) {
        throw new InvalidPasswordError(
          'Old password and new password is required',
        )
      }
      const checkOldPassword = await this.hashProvider.compareHash(
        _Input.old_password,
        entity.password,
      )

      if (!checkOldPassword) {
        throw new InvalidPasswordError('Old password does not match')
      }

      const hashPassword = await this.hashProvider.generateHash(_Input.password)

      entity.updatePassword(hashPassword)
      await this.userRepository.update(entity)
      return UserOutputMapper.toOutput(entity)
    }
  }
}
