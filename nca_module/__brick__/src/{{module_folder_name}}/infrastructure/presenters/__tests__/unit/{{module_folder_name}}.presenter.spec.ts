import { instanceToPlain } from 'class-transformer'
import { {{module_name.pascalCase()}}CollectionPresenter, {{module_name.pascalCase()}}Presenter } from '../../{{module_folder_name}}.presenter'
import { PaginationPresenter } from '@/shared/infrastructure/presenters/pagination.presenter'
import { {{module_name.pascalCase()}}OutputDataBuilder } from '@/{{module_folder_name}}/domain/testing/helpers/{{module_folder_name}}-output-data-builder'

describe('{{module_name.pascalCase()}}Presenter unit tests', () => {
  const createdAt = new Date()
  const updatedAt = new Date()
  const props = {{module_name.pascalCase()}}OutputDataBuilder({
    id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
    name: 'test name',
    email: 'a@a.com',
    password: 'fake',
    createdAt,
    updatedAt,
  })
  let sut: {{module_name.pascalCase()}}Presenter

  beforeEach(() => {
    sut = new {{module_name.pascalCase()}}Presenter(props)
  })

  describe('constructor', () => {
    it('should set values', () => {
      expect(sut.id).toEqual(props.id)
      expect(sut.name).toEqual(props.name)
      expect(sut.email).toEqual(props.email)
      expect(sut.createdAt).toEqual(props.createdAt)
    })
  })

  it('should presenter data', () => {
    const output = instanceToPlain(sut)
    expect(output).toStrictEqual({
      id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
      name: 'test name',
      email: 'a@a.com',
      createdAt: createdAt.toISOString(),
    })
  })
})

describe('{{module_name.pascalCase()}}CollectionPresenter unit tests', () => {
  const createdAt = new Date()
  const updatedAt = new Date()
  const props = {{module_name.pascalCase()}}OutputDataBuilder({
    id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
    name: 'test name',
    email: 'a@a.com',
    password: 'fake',
    createdAt,
    updatedAt,
  })

  describe('constructor', () => {
    it('should set values', () => {
      const sut = new {{module_name.pascalCase()}}CollectionPresenter({
        items: [props],
        currentPage: 1,
        perPage: 2,
        lastPage: 1,
        total: 1,
      })
      expect(sut.meta).toBeInstanceOf(PaginationPresenter)
      expect(sut.meta).toStrictEqual(
        new PaginationPresenter({
          currentPage: 1,
          perPage: 2,
          lastPage: 1,
          total: 1,
        }),
      )
      expect(sut.data).toStrictEqual([new {{module_name.pascalCase()}}Presenter(props)])
    })
  })

  it('should presenter data', () => {
    let sut = new {{module_name.pascalCase()}}CollectionPresenter({
      items: [props],
      currentPage: 1,
      perPage: 2,
      lastPage: 1,
      total: 1,
    })
    let output = instanceToPlain(sut)
    expect(output).toStrictEqual({
      data: [
        {
          id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
          name: 'test name',
          email: 'a@a.com',
          createdAt: createdAt.toISOString(),
        },
      ],
      meta: {
        currentPage: 1,
        perPage: 2,
        lastPage: 1,
        total: 1,
      },
    })

    sut = new {{module_name.pascalCase()}}CollectionPresenter({
      items: [props],
      currentPage: '1' as any,
      perPage: '2' as any,
      lastPage: '1' as any,
      total: '1' as any,
    })
    output = instanceToPlain(sut)
    expect(output).toStrictEqual({
      data: [
        {
          id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
          name: 'test name',
          email: 'a@a.com',
          createdAt: createdAt.toISOString(),
        },
      ],
      meta: {
        currentPage: 1,
        perPage: 2,
        lastPage: 1,
        total: 1,
      },
    })
  })
})
