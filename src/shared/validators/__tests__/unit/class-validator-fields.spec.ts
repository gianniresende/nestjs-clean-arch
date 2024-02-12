import { ClassValidatorFields } from '../../class-validator-fields'
import * as libClassValidator from 'class-validator'

class StubClassValidatorFields extends ClassValidatorFields<{
  field: string
}> {}

describe('ClassValidatorFields unit tests', () => {
  it('Should initialize errors and validatedData variables with null', () => {
    const sut = new StubClassValidatorFields()
    expect(sut.errors).toBeNull()
    expect(sut.validatedData).toBeNull()
  })

  it('Should validate with errors', () => {
    const spyvalidateSync = jest.spyOn(libClassValidator, 'validateSync')
    spyvalidateSync.mockReturnValue([
      { property: 'field', constraints: { isRequired: 'test error' } },
    ])
    const sut = new StubClassValidatorFields()
    expect(sut.validate(null)).toBeFalsy()
    expect(spyvalidateSync).toHaveBeenCalled()
    expect(sut.validatedData).toBeNull()
    expect(sut.errors).toStrictEqual({ field: ['test error'] })
  })

  it('Should validate without errors', () => {
    const spyvalidateSync = jest.spyOn(libClassValidator, 'validateSync')
    spyvalidateSync.mockReturnValue([])
    const sut = new StubClassValidatorFields()

    expect(sut.validate({ field: 'value' })).toBeTruthy()
    expect(spyvalidateSync).toHaveBeenCalled()
    expect(sut.validatedData).toStrictEqual({ field: 'value' })
    expect(sut.errors).toBeNull()
  })
})
