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
    {{#fields}}expect(sut.props.{{ name.camelCase() }}).toEqual(props.{{ name.camelCase() }})
    {{/fields}}
    expect(sut.props.createdAt).toBeInstanceOf(Date)
  })

  {{#fields}}
  it('Getter of name field', () => {
    expect(sut.name).toBeDefined()
    expect(sut.name).toEqual(props.name)
    expect(typeof sut.name).toBe('string')
  })
  it('Setter of {{ name.camelCase() }} field', () => {
    sut['{{ name.camelCase() }}'] = 'other {{ name.camelCase() }}'
    expect(sut.props.{{ name.camelCase() }}).toEqual('other {{ name.camelCase() }}')
    expect(typeof sut.props.{{ name.camelCase() }}).toBe('{{ tsType }}')
  })
  {{/fields}}
})
