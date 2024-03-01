import { UsersController } from '../../users.controller'
import { UserOutput } from '@/users/application/dtos/user-output'
import { SignupUseCase } from '@/users/application/usecases/signup.usecase'
import { SigninUseCase } from '@/users/application/usecases/signin.usecase'
import { SignupDto } from '../../dtos/signup.dto'
import { SigninDto } from '../../dtos/signin.dto'
import { UpdateUserUseCase } from '@/users/application/usecases/Update-user.usecase'
import { UpdateUserDto } from '../../dtos/update-user.dto'

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
})
