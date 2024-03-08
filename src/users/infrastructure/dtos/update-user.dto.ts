import { UpdateUserUseCase } from '@/users/application/usecases/Update-user.usecase'

export class UpdateUserDto implements Omit<UpdateUserUseCase.Input, 'id'> {
  name: string
}
