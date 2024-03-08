import { UserPresenter } from "../../user.presenter"

describe('UsersPresenter unit tests', () => {
  const createdAt = new Date()
  const props = {
    id: '0f664fbc-0f4e-486d-8569-5babee53bd89',
    name: 'test name',
    email: '2Ft1G@example.com',
    password: 'test password',
    createdAt,
  }

  describe('constructor', () => {
    it('should be defined', () => {
      const sut = new UserPresenter(props)
      expect(sut.id).toEqual(props.id)
      expect(sut.name).toEqual(props.name)
      expect(sut.email).toEqual(props.email)
      expect(sut.createdAt).toEqual(props.createdAt)
    })
  })
})
