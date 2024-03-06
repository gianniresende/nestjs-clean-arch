import { PrismaClient } from '@prisma/client'
import { DeleteUserUseCase } from '../../delete-user.usecase'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserEntity } from '@/users/domain/entities/user.entity'

describe('DeleteUseCase integration tests', () => {
  const prismaService = new PrismaClient()
  let sut: DeleteUserUseCase.UseCase
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
    sut = new DeleteUserUseCase.UseCase(repository)
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

  it('Should delete a user', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    })

    await sut.execute({ id: entity._id })
    const output = await prismaService.user.findUnique({
      where: {
        id: entity._id,
      },
    })
    expect(output).toBeNull()
    const models = await prismaService.user.findMany()
    expect(models).toHaveLength(0)
  })
})
