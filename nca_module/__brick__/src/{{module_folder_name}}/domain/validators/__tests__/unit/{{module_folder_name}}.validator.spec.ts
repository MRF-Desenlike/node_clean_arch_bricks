import { {{module_name.pascalCase()}}DataBuilder } from '@/{{module_folder_name}}/domain/testing/helpers/{{module_folder_name}}-data-builder'
import {
  {{module_name.pascalCase()}}Rules,
  {{module_name.pascalCase()}}Validator,
  {{module_name.pascalCase()}}ValidatorFactory,
} from '../../{{module_folder_name}}.validator'
import { {{module_name.pascalCase()}}Props } from '@/{{module_folder_name}}/domain/entities/{{module_folder_name}}.entity'

let sut: {{module_name.pascalCase()}}Validator
let props: {{module_name.pascalCase()}}Props

describe('{{module_name.pascalCase()}}Validator unit tests', () => {
  beforeEach(() => {
    sut = {{module_name.pascalCase()}}ValidatorFactory.create()
    props = {{module_name.pascalCase()}}DataBuilder({})
  })

  {{#fields}}
  it('Invalidation cases for {{ name.camelCase() }} field', () => {
    let isValid = sut.validate(null as any)
    expect(isValid).toBeFalsy()
    expect(sut.errors['{{ name.camelCase() }}']).toStrictEqual([
      '{{ name.camelCase() }} should not be empty',
      '{{ name.camelCase() }} must be a string',
      '{{ name.camelCase() }} must be shorter than or equal to 255 characters',
    ])

    isValid = sut.validate({ ...props, name: '' })
    expect(isValid).toBeFalsy()
    expect(sut.errors['{{ name.camelCase() }}']).toStrictEqual(['{{ name.camelCase() }} should not be empty'])

    isValid = sut.validate({ ...props, {{ name.camelCase() }}: 10 as any })
    expect(isValid).toBeFalsy()
    expect(sut.errors['{{ name.camelCase() }}']).toStrictEqual([
      '{{ name.camelCase() }} must be a string',
      '{{ name.camelCase() }} must be shorter than or equal to 255 characters',
    ])

    isValid = sut.validate({ ...props, {{ name.camelCase() }}: 'a'.repeat(256) })
    expect(isValid).toBeFalsy()
    expect(sut.errors['{{ name.camelCase() }}']).toStrictEqual([
      '{{ name.camelCase() }} must be shorter than or equal to 255 characters',
    ])
  })
  {{/fields}}

  it('Invalidation cases for createdAt field', () => {
    let isValid = sut.validate({ ...props, createdAt: 10 as any })
    expect(isValid).toBeFalsy()
    expect(sut.errors['createdAt']).toStrictEqual([
      'createdAt must be a Date instance',
    ])

    isValid = sut.validate({ ...props, createdAt: '2023' as any })
    expect(isValid).toBeFalsy()
    expect(sut.errors['createdAt']).toStrictEqual([
      'createdAt must be a Date instance',
    ])
  })

  it('Valid case for {{module_name}} rules', () => {
    const isValid = sut.validate(props)
    expect(isValid).toBeTruthy()
    expect(sut.validatedData).toStrictEqual(new {{module_name.pascalCase()}}Rules(props))
  })
})
