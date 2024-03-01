import { UsersController } from '../../users.controller'
import { UserOutput } from '@/users/application/dtos/user-output'
import { SignupUseCase } from '@/users/application/usecases/signup.usecase'
import { SigninUseCase } from '@/users/application/usecases/signin.usecase'
import { SignupDto } from '../../dtos/signup.dto'
import { SigninDto } from '../../dtos/signin.dto'
import { UpdateUserUseCase } from '@/users/application/usecases/Update-user.usecase'
import { UpdateUserDto } from '../../dtos/update-user.dto'
import { UpdatePasswordUseCase } from '@/users/application/usecases/Update-password.usecase'
import { UpdatePasswordDto } from '../../dtos/update-password.dto'
import { GetUserUseCase } from '@/users/application/usecases/get-user.usecase'

describe('UsersController unit tests', () => {
  let sut: UsersController
  let id: string
  let props: UserOutput

  beforeEach(async () => {
    sut = new UsersController()
    id = 'b99bb948-9141-44c3-8e8e-5ec2dfb15b36'
    props = {
      id,
      name: 'Jhon',
      email: 'a@a.com',
      password: '123456',
      createdAt: new Date(),
    }
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  it('should create a user', async () => {
    const output: SignupUseCase.Output = props
    const mockSignupUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    sut['signupUseCase'] = mockSignupUseCase as any

    const input: SignupDto = {
      name: 'Jhon',
      email: 'a@a.com',
      password: '123456',
    }

    const result = await sut.create(input)

    expect(output).toMatchObject(result)
    expect(mockSignupUseCase.execute).toHaveBeenCalledWith(input)
  })

  it('should authenticate a user', async () => {
    const output: SigninUseCase.Output = props
    const mockSigninUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    sut['signinUseCase'] = mockSigninUseCase as any

    const input: SigninDto = {
      email: 'a@a.com',
      password: '123456',
    }

    const result = await sut.login(input)

    expect(output).toMatchObject(result)
    expect(mockSigninUseCase.execute).toHaveBeenCalledWith(input)
  })

  it('should update a user', async () => {
    const output: UpdateUserUseCase.Output = props
    const mockUpdateUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    sut['updateUserCase'] = mockUpdateUserUseCase as any

    const input: UpdateUserDto = {
      name: 'New name',
    }

    const result = await sut.update(id, input)

    expect(output).toMatchObject(result)
    expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith({ id, ...input })
  })

  it('should update user password', async () => {
    const output: UpdatePasswordUseCase.Output = props
    const mockUpdatePasswordUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    sut['updatePasswordUseCase'] = mockUpdatePasswordUseCase as any

    const input: UpdatePasswordDto = {
      password: 'New name',
      old_password: 'old password',
    }

    const result = await sut.updatePassword(id, input)

    expect(output).toMatchObject(result)
    expect(mockUpdatePasswordUseCase.execute).toHaveBeenCalledWith({
      id,
      ...input,
    })
  })

  it('should delete a user', async () => {
    const output = undefined
    const mockDeleteUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    sut['deleteUserUseCase'] = mockDeleteUserUseCase as any

    const result = await sut.remove(id)

    expect(output).toStrictEqual(result)
    expect(mockDeleteUserUseCase.execute).toHaveBeenCalledWith({ id })
  })

  it('should get a user', async () => {
    const output: GetUserUseCase.Output = props
    const mockGetUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    sut['getUserUseCase'] = mockGetUserUseCase as any

    const result = await sut.findOne(id)

    expect(output).toStrictEqual(result)
    expect(mockGetUserUseCase.execute).toHaveBeenCalledWith({ id })
  })
})
