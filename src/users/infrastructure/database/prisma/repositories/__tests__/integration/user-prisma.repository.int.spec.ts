import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { PrismaClient } from '@prisma/client'
import { UserPrismaRepository } from '../../user-prisma.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { ConflictError } from '@/shared/domain/errors/conflict-error'

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

  it('Should throws error on update when entity not found', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await expect(sut.update(entity)).rejects.toThrow(
      new NotFoundError(`UserModel not found using ID ${entity._id}`),
    )
  })

  it('Should update a entity', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    })
    entity.update('new name')
    await sut.update(entity)
    const output = await prismaService.user.findUnique({
      where: {
        id: entity._id,
      },
    })
    expect(output.name).toBe('new name')
  })

  it('Should throws error on delete when entity not found', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await expect(sut.delete(entity._id)).rejects.toThrow(
      new NotFoundError(`UserModel not found using ID ${entity._id}`),
    )
  })

  it('Should delete a entity', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    })

    await sut.delete(entity._id)
    const output = await prismaService.user.findUnique({
      where: {
        id: entity._id,
      },
    })
    expect(output).toBeNull()
  })

  it('Should throws error when entity not found', async () => {
    await expect(sut.findByEmail('a@a.com')).rejects.toThrow(
      new NotFoundError('UserModel not found using email a@a.com'),
    )
  })

  it('Should finds a entity by email', async () => {
    const entity = new UserEntity(UserDataBuilder({ email: 'a@a.com' }))
    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    })

    const output = await sut.findByEmail('a@a.com')

    expect(output.toJSON()).toStrictEqual(entity.toJSON())
  })

  it('Should throws error when entity found by email', async () => {
    const entity = new UserEntity(UserDataBuilder({ email: 'a@a.com' }))
    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    })
    await expect(sut.emailExists('a@a.com')).rejects.toThrow(
      new ConflictError('Email address already used'),
    )
  })

  it('Should not finds a entity by email', async () => {
    expect.assertions(0)
    await sut.emailExists('a@a.com')
  })

  describe('Search method tests', () => {
    it('Should apply only pagination when the other params are null', async () => {
      const createdAt = new Date()
      const entities: UserEntity[] = []
      const arrange = Array(16).fill(UserDataBuilder({}))
      arrange.forEach((element, index) => {
        entities.push(
          new UserEntity({
            ...element,
            email: `test${index}@email.com`,
            createdAt: new Date(createdAt.getTime() + index),
          }),
        )
      })

      await prismaService.user.createMany({
        data: entities.map(item => item.toJSON()),
      })

      const searchOutput = await sut.search(new UserRepository.SearchParams())
      const items = searchOutput.items
      expect(searchOutput).toBeInstanceOf(UserRepository.SearchResult)
      expect(searchOutput.total).toBe(16)
      expect(searchOutput.items.length).toBe(15)
      searchOutput.items.forEach(item => {
        expect(item).toBeInstanceOf(UserEntity)
      })
      items.reverse().forEach((item, index) => {
        expect(`test${index + 1}@email.com`).toBe(item.email)
      })
    })

    it('Should search using filter, sort and paginate', async () => {
      const createdAt = new Date()
      const entities: UserEntity[] = []
      const arrange = ['test', 'a', 'TEST', 'b', 'TeSt']
      arrange.forEach((element, index) => {
        entities.push(
          new UserEntity({
            ...UserDataBuilder({ name: element }),
            createdAt: new Date(createdAt.getTime() + index),
          }),
        )
      })

      await prismaService.user.createMany({
        data: entities.map(item => item.toJSON()),
      })

      const searchOutputPage1 = await sut.search(
        new UserRepository.SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      )

      expect(searchOutputPage1.items[0].toJSON()).toMatchObject(
        entities[0].toJSON(),
      )
      expect(searchOutputPage1.items[1].toJSON()).toMatchObject(
        entities[4].toJSON(),
      )

      const searchOutputPage2 = await sut.search(
        new UserRepository.SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      )

      expect(searchOutputPage2.items[0].toJSON()).toMatchObject(
        entities[2].toJSON(),
      )
    })
  })
})
