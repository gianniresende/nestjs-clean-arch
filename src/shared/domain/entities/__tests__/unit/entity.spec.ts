import { validate as uuidValidate } from 'uuid'
import { Entity } from '../../entity'
import exp from 'constants'

type StubProps = {
  prop1: string
  prop2: number
}

class StubEntity extends Entity<StubProps> {}
describe('userEntity unit tests', () => {
  it('Should set props and id', () => {
    const props = { prop1: 'value', prop2: 15 }
    const entity = new StubEntity(props)
    expect(entity.props).toStrictEqual(props)
    expect(entity._id).not.toBeNull()
    expect(uuidValidate(entity._id)).toBeTruthy()
  })

  it('Should accept valide uuid', () => {
    const props = { prop1: 'value', prop2: 15 }
    const id = '7130cfa9-b677-41dd-8491-afa3ae500c4c'
    const entity = new StubEntity(props, id)

    expect(uuidValidate(entity._id)).toBeTruthy()
    expect(entity._id).toBe(id)
  })

  it('Should convert a entity to a Javascript Object', () => {
    const props = { prop1: 'value1', prop2: 15 }
    const id = '7130cfa9-b677-41dd-8491-afa3ae500c4c'
    const entity = new StubEntity(props, id)

    expect(entity.toJSON()).toStrictEqual({ id, ...props, })
  })
})
