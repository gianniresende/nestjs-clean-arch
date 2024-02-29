import { UpdatePasswordUseCase } from '@/users/application/usecases/Update-password.usecase'

export class UpdatePasswordDto
  implements Omit<UpdatePasswordUseCase.Input, 'id'>
{
  password: string
  old_password: string
}
