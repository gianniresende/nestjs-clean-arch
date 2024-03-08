import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error'
import { SigninUseCase } from '../../signin.usecase'
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'

describe('SigninUseCase integration tests', () => {
  const prismaService = new PrismaClient()
  let sut: SigninUseCase.UseCase
  let repository: UserPrismaRepository
  let module: TestingModule
  let hashProvider: HashProvider

  beforeAll(async () => {
    setupPrismaTests()
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile()
    repository = new UserPrismaRepository(prismaService as any)
    hashProvider = new BcryptjsHashProvider()
  })

  beforeEach(async () => {
    sut = new SigninUseCase.UseCase(repository, hashProvider)
    await prismaService.user.deleteMany()
  })

  beforeAll(async () => {
    await module.close()
  })

  it('Should not be able to authenticate with wrong email', async () => {
    const entity = new UserEntity(UserDataBuilder({}))

    await expect(
      sut.execute({
        email: entity.email,
        password: '1234',
      }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  it('Should not be able to authenticate with wrong password', async () => {
    const hashPassword = await hashProvider.generateHash('123456')
    const entity = new UserEntity(
      UserDataBuilder({ email: 'a@a.com', password: hashPassword }),
    )
    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    })
    await expect(
      sut.execute({
        email: 'a@a.com',
        password: '1234',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('Should throws error when email not provided', async () => {
    await expect(
      sut.execute({
        email: null,
        password: '1234',
      }),
    ).rejects.toBeInstanceOf(BadRequestError)
  })

  it('Should throws error when password not provided', async () => {
    await expect(
      sut.execute({
        email: 'a@a.com',
        password: null,
      }),
    ).rejects.toBeInstanceOf(BadRequestError)
  })

  it('Should authenticate a user', async () => {
    const hashPassword = await hashProvider.generateHash('123456')
    const entity = new UserEntity(
      UserDataBuilder({ email: 'a@a.com', password: hashPassword }),
    )
    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    })

    const output = await sut.execute({
      email: 'a@a.com',
      password: '123456',
    })

    expect(output).toMatchObject(entity.toJSON())
  })
})
