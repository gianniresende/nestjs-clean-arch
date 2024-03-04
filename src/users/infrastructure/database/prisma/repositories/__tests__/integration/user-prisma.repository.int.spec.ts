import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { PrismaClient } from '@prisma/client'
import { UserPrismaRepository } from '../../user-prisma.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'

describe('UserModelMapper integration tests', () => {
  const prismaService = new PrismaClient()
  let sut: UserPrismaRepository
  let module: TestingModule

  beforeAll(async () => {
    setupPrismaTests()
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile()
  })

  beforeEach(async () => {
    sut = new UserPrismaRepository(prismaService as any)
    await prismaService.user.deleteMany()
  })

  it('Should throws error when entity not found', async () => {
    expect(sut.findById('fakeId')).rejects.toThrow(
      new NotFoundError('UserModel not found using ID fakeId'),
    )
  })

  it('Should finds a entity by id', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    })
    const output = await sut.findById(newUser.id)
    expect(output.toJSON()).toStrictEqual(entity.toJSON())
  })

  it('Should insert a new entity', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await sut.insert(entity)
    const result = await prismaService.user.findUnique({
      where: {
        id: entity._id,
      },
    })

    expect(result).toStrictEqual(entity.toJSON())
  })

  it('Should return all users', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    })
    const entities = await sut.findAll()
    expect(entities).toHaveLength(1)
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]))
    entities.map(item => expect(item.toJSON()).toStrictEqual(entity.toJSON()))
  })
})
