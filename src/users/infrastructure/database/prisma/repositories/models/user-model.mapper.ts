import { UserEntity } from '@/users/domain/entities/user.entity'
import { User } from '@prisma/client'
import { ValidationError } from '@/shared/domain/errors/validation-error'

export class UserModelMapper {
  static toEntity(model: User) {
    const data = {
      name: model.name,
      email: model.email,
      password: model.password,
      createdAt: model.createdAT,
    }

    try {
      return new UserEntity(data, model.id)
    } catch {
      throw new ValidationError('An entity not be loaded')
    }
  }
}
