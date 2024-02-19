import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserInMemoryRepository } from '../../user-in-memory.repository'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { NotFoundError } from 'rxjs'
import { ConflictError } from '@/shared/domain/errors/conflict-error'

describe('UserInMemoryRepository unit tests', () => {
  let sut: UserInMemoryRepository

  beforeEach(() => {
    sut = new UserInMemoryRepository()
  })

  it('Should throw error when not found - findByEmail method', async () => {
    await expect(sut.findByEmail('a@e.com')).rejects.toThrow(
      new NotFoundError('Entity not found using email: a@e.com'),
    )
  })

  it('Should find a entity by Email - findByEmail method', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await sut.insert(entity)
    const result = await sut.findByEmail(entity.email)
    expect(entity.toJSON()).toStrictEqual(result.toJSON())
  })

  it('Should throw error when not found - emailExists method', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await sut.insert(entity)
    await expect(sut.emailExists(entity.email)).rejects.toThrow(
      new ConflictError('Email address already used'),
    )
  })

  it('Should find a entity by Email - findByEmail method', async () => {
    expect.assertions(0)
    await sut.emailExists('a@e.com')
  })

  it('Should no filter items when filter object is null', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await sut.insert(entity)
    const result = await sut.findAll()
    const spyFilter = jest.spyOn(result, 'filter')
    const itemsFiltered = await sut['applyFilter'](result, null)
    expect(spyFilter).not.toHaveBeenCalled()
    expect(itemsFiltered).toStrictEqual(result)
  })

  it('Should filter name field using filter params', async () => {
    const items = [
      new UserEntity(UserDataBuilder({ name: 'Test' })),
      new UserEntity(UserDataBuilder({ name: 'TEST' })),
      new UserEntity(UserDataBuilder({ name: 'test' })),
      new UserEntity(UserDataBuilder({ name: 'fake' })),
    ]

    const spyFilter = jest.spyOn(items, 'filter')
    const itemsFiltered = await sut['applyFilter'](items, 'test')
    expect(spyFilter).toHaveBeenCalled()
    expect(itemsFiltered).toStrictEqual([items[0], items[1], items[2]])
  })
})
