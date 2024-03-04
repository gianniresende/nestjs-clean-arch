import { PrismaClient, User } from '@prisma/client'
import { UserModelMapper } from '../user-model.mapper'
import { ValidationError } from '@/shared/domain/errors/validation-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'

describe('UserModelMapper integration tests', () => {
  let prismaService: PrismaClient
  let props: any

  beforeAll(async () => {
    setupPrismaTests()

    prismaService = new PrismaClient()
    await prismaService.$connect()
  })

  beforeEach(async () => {
    await prismaService.user.deleteMany()
    props = {
      id: 'b99bb948-9141-44c3-8e8e-5ec2dfb15b36',
      name: 'User Test',
      email: 'a@a.com',
      password: 'Test Password',
      createdAT: new Date(),
    }
  })

  afterAll(async () => {
    await prismaService.$disconnect()
  })

  it('Should throws error when user model is invalid', async () => {
    const model: User = Object.assign(props, { name: null })
    expect(() => UserModelMapper.toEntity(model)).toThrowError(ValidationError)
  })

  it('Should convert a user model to a use entity', async () => {
    const model: User = await prismaService.user.create({ data: props })
    const sut = UserModelMapper.toEntity(model)
    expect(sut).toBeInstanceOf(UserEntity)
  })
})
