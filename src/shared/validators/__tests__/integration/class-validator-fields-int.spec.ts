import { MaxLength, IsNotEmpty, IsString, IsNumber } from 'class-validator'
import { ClassValidatorFields } from '../../class-validator-fields'

class StubRules {
  @MaxLength(255)
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNumber()
  @IsNotEmpty()
  price: number

  constructor(data: any) {
    Object.assign(this, data)
  }
}

class StubClassValidatorFields extends ClassValidatorFields<StubRules> {
  validate(data: any): boolean {
    return super.validate(new StubRules(data))
  }
}

describe('ClassValidatorFields integration tests', () => {
  it('Should validate with errors', () => {
    const validator = new StubClassValidatorFields()
    expect(validator.validate(null)).toBeFalsy()
    expect(validator.errors).toStrictEqual({
      name: [
        'name must be a string',
        'name should not be empty',
        'name must be shorter than or equal to 255 characters',
      ],
      price: [
        'price should not be empty',
        'price must be a number conforming to the specified constraints',
      ],
    })
    console.log(validator.errors)
  })

  it('Should validate without errors', () => {
    const validator = new StubClassValidatorFields()
    expect(validator.validate({ name: 'value', price: 10 })).toBeTruthy()
    expect(validator.validatedData).toStrictEqual(
      new StubRules({ name: 'value', price: 10 }),
    )
    console.log(validator.errors)
  })
})
