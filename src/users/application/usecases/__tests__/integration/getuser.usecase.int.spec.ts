import { PrismaClient } from '@prisma/client'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { GetUserUseCase } from '../../get-user.usecase'

describe('GetUserUseCase integration tests', () => {
  const prismaService = new PrismaClient()
  let sut: GetUserUseCase.UseCase
  let repository: UserPrismaRepository
  let module: TestingModule

  beforeAll(async () => {
    setupPrismaTests()
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile()
    repository = new UserPrismaRepository(prismaService as any)
  })

  beforeEach(async () => {
    sut = new GetUserUseCase.UseCase(repository)
    await prismaService.user.deleteMany()
  })

  beforeAll(async () => {
    await module.close()
  })

  it('Should throw error when entity not found', async () => {
    const props = {
      name: 'test name',
      email: 'a@a.com',
      password: '123456',
    }
    await expect(sut.execute({ id: 'fakeId' })).rejects.toThrow(
      new NotFoundError('UserModel not found using ID fakeId'),
    )
  })

  it('Should returns a user', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const model = await prismaService.user.create({
      data: entity.toJSON(),
    })

    const output = await sut.execute({ id: entity._id })
    expect(output).toMatchObject(model)
  })
})
