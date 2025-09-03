import { {{module_name.pascalCase()}}DataBuilder } from '@/{{module_folder_name}}/domain/testing/helpers/{{module_folder_name}}-data-builder'
import { {{module_name.pascalCase()}}Entity, {{module_name.pascalCase()}}Props } from '../../{{module_folder_name}}.entity'
import { EntityValidationError } from '@/shared/domain/errors/validation-error'

describe('{{module_name.pascalCase()}}Entity integration tests', () => {
  describe('Constructor method', () => {
    it('Should throw an error when creating a item with invalid name', () => {
      let props: {{module_name.pascalCase()}}Props = {
        ...{{module_name.pascalCase()}}DataBuilder({}),
        name: null,
      }
      expect(() => new {{module_name.pascalCase()}}Entity(props)).toThrowError(EntityValidationError)

      props = {
        ...{{module_name.pascalCase()}}DataBuilder({}),
        name: '',
      }
      expect(() => new {{module_name.pascalCase()}}Entity(props)).toThrowError(EntityValidationError)

      props = {
        ...{{module_name.pascalCase()}}DataBuilder({}),
        name: 10 as any,
      }
      expect(() => new {{module_name.pascalCase()}}Entity(props)).toThrowError(EntityValidationError)

      props = {
        ...{{module_name.pascalCase()}}DataBuilder({}),
        name: 'a'.repeat(256),
      }
      expect(() => new {{module_name.pascalCase()}}Entity(props)).toThrowError(EntityValidationError)
    })

    it('Should throw an error when creating a item with invalid email', () => {
      let props: {{module_name.pascalCase()}}Props = {
        ...{{module_name.pascalCase()}}DataBuilder({}),
        email: null,
      }
      expect(() => new {{module_name.pascalCase()}}Entity(props)).toThrowError(EntityValidationError)

      props = {
        ...{{module_name.pascalCase()}}DataBuilder({}),
        email: '',
      }
      expect(() => new {{module_name.pascalCase()}}Entity(props)).toThrowError(EntityValidationError)

      props = {
        ...{{module_name.pascalCase()}}DataBuilder({}),
        email: 10 as any,
      }
      expect(() => new {{module_name.pascalCase()}}Entity(props)).toThrowError(EntityValidationError)

      props = {
        ...{{module_name.pascalCase()}}DataBuilder({}),
        email: 'a'.repeat(256),
      }
      expect(() => new {{module_name.pascalCase()}}Entity(props)).toThrowError(EntityValidationError)
    })

    it('Should throw an error when creating a item with invalid createdAt', () => {
      let props: {{module_name.pascalCase()}}Props = {
        ...{{module_name.pascalCase()}}DataBuilder({}),
        createdAt: '2023' as any,
      }
      expect(() => new {{module_name.pascalCase()}}Entity(props)).toThrowError(EntityValidationError)

      props = {
        ...{{module_name.pascalCase()}}DataBuilder({}),
        createdAt: 10 as any,
      }
      expect(() => new {{module_name.pascalCase()}}Entity(props)).toThrowError(EntityValidationError)
    })

    it('Should a valid item', () => {
      expect.assertions(0)

      const props: {{module_name.pascalCase()}}Props = {
        ...{{module_name.pascalCase()}}DataBuilder({}),
      }
      new {{module_name.pascalCase()}}Entity(props)
    })
  })

  describe('Update method', () => {
    it('Should throw an error when update a item with invalid name', () => {
      const entity = new {{module_name.pascalCase()}}Entity({{module_name.pascalCase()}}DataBuilder({}))
      expect(() => entity.update(null)).toThrowError(EntityValidationError)
      expect(() => entity.update('')).toThrowError(EntityValidationError)
      expect(() => entity.update(10 as any)).toThrowError(EntityValidationError)
      expect(() => entity.update('a'.repeat(256))).toThrowError(
        EntityValidationError,
      )
    })

    it('Should a valid item', () => {
      expect.assertions(0)

      const props: {{module_name.pascalCase()}}Props = {
        ...{{module_name.pascalCase()}}DataBuilder({}),
      }

      const entity = new {{module_name.pascalCase()}}Entity(props)
      entity.update('other name')
    })
  })
})
