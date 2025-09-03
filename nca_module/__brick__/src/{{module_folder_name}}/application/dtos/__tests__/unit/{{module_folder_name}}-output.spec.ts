import { {{module_name.pascalCase()}}Entity } from '@/{{module_folder_name}}/domain/entities/{{module_folder_name}}.entity'
import { {{module_name.pascalCase()}}DataBuilder } from '@/{{module_folder_name}}/domain/testing/helpers/{{module_folder_name}}-data-builder'
import { {{module_name.pascalCase()}}OutputMapper } from '../../{{module_folder_name}}-output'

describe('{{module_name}}OutputMapper unit tests', () => {
  it('should convert a {{module_name}} in output', () => {
    const entity = new {{module_name.pascalCase()}}Entity({{module_name.pascalCase()}}DataBuilder({}))
    const spyToJson = jest.spyOn(entity, 'toJSON')
    const sut = {{module_name.pascalCase()}}OutputMapper.toOutput(entity)

    expect(spyToJson).toHaveBeenCalled()
    expect(sut).toStrictEqual(entity.toJSON())
  })
})
