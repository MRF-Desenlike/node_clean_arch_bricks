import { {{module_name.pascalCase()}}Entity, {{module_name.pascalCase()}}Props } from '../../{{module_folder_name}}.entity'
import { {{module_name.pascalCase()}}DataBuilder } from '@/{{module_folder_name}}/domain/testing/helpers/{{module_folder_name}}-data-builder'

describe('{{module_name.pascalCase()}}Entity unit tests', () => {
  let props: {{module_name.pascalCase()}}Props
  let sut: {{module_name.pascalCase()}}Entity

  beforeEach(() => {
    {{module_name.pascalCase()}}Entity.validate = jest.fn()
    props = {{module_name.pascalCase()}}DataBuilder({})
    sut = new {{module_name.pascalCase()}}Entity(props)
  })

  it('Constructor method', () => {
    expect({{module_name.pascalCase()}}Entity.validate).toHaveBeenCalled()
    expect(sut.props.name).toEqual(props.name)
    expect(sut.props.email).toEqual(props.email)
    expect(sut.props.password).toEqual(props.password)
    expect(sut.props.createdAt).toBeInstanceOf(Date)
  })

  it('Getter of name field', () => {
    expect(sut.name).toBeDefined()
    expect(sut.name).toEqual(props.name)
    expect(typeof sut.name).toBe('string')
  })

  it('Setter of name field', () => {
    sut['name'] = 'other name'
    expect(sut.props.name).toEqual('other name')
    expect(typeof sut.props.name).toBe('string')
  })

  it('Getter of email field', () => {
    expect(sut.email).toBeDefined()
    expect(sut.email).toEqual(props.email)
    expect(typeof sut.email).toBe('string')
  })

  it('Getter of password field', () => {
    expect(sut.password).toBeDefined()
    expect(sut.password).toEqual(props.password)
    expect(typeof sut.password).toBe('string')
  })

  it('Setter of password field', () => {
    sut['password'] = 'other password'
    expect(sut.props.password).toEqual('other password')
    expect(typeof sut.props.password).toBe('string')
  })

  it('Getter of createdAt field', () => {
    expect(sut.createdAt).toBeDefined()
    expect(sut.createdAt).toBeInstanceOf(Date)
  })

  it('Should update a item', () => {
    expect({{module_name.pascalCase()}}Entity.validate).toHaveBeenCalled()
    sut.update('other name')
    expect(sut.props.name).toEqual('other name')
  })
})
