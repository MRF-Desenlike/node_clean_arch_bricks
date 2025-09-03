import { {{module_name.pascalCase()}}InMemoryRepository } from '@/{{module_folder_name}}/infrastructure/database/in-memory/repositories/{{module_folder_name}}-in-memory.repository'
import { List{{module_name.pascalCase()}}UseCase } from '../../list-{{module_folder_name}}.usecase'
import { {{module_name.pascalCase()}}Repository } from '@/{{module_folder_name}}/domain/repositories/{{module_folder_name}}.repository'
import { {{module_name.pascalCase()}}Entity } from '@/{{module_folder_name}}/domain/entities/{{module_folder_name}}.entity'
import { {{module_name.pascalCase()}}DataBuilder } from '@/{{module_folder_name}}/domain/testing/helpers/{{module_folder_name}}-data-builder'

describe('List{{module_name.pascalCase()}}UseCase unit tests', () => {
  let sut: List{{module_name.pascalCase()}}UseCase.UseCase
  let repository: {{module_name.pascalCase()}}InMemoryRepository

  beforeEach(() => {
    repository = new {{module_name.pascalCase()}}InMemoryRepository()
    sut = new List{{module_name.pascalCase()}}UseCase.UseCase(repository)
  })

  it('toOutput method', () => {
    let result = new {{module_name.pascalCase()}}Repository.SearchResult({
      items: [],
      total: 1,
      currentPage: 1,
      perPage: 2,
      sort: null,
      sortDir: null,
      filter: null,
    })
    let output = sut['toOutput'](result)
    expect(output).toStrictEqual({
      items: [],
      total: 1,
      currentPage: 1,
      lastPage: 1,
      perPage: 2,
    })

    const entity = new {{module_name.pascalCase()}}Entity({{module_name.pascalCase()}}DataBuilder({}))
    result = new {{module_name.pascalCase()}}Repository.SearchResult({
      items: [entity],
      total: 1,
      currentPage: 1,
      perPage: 2,
      sort: null,
      sortDir: null,
      filter: null,
    })
    output = sut['toOutput'](result)
    expect(output).toStrictEqual({
      items: [entity.toJSON()],
      total: 1,
      currentPage: 1,
      lastPage: 1,
      perPage: 2,
    })
  })

  it('should return the items ordered by createdAt', async () => {
    const createdAt = new Date()
    const items = [
      new {{module_name.pascalCase()}}Entity({{module_name.pascalCase()}}DataBuilder({ createdAt })),
      new {{module_name.pascalCase()}}Entity(
        {{module_name.pascalCase()}}DataBuilder({ createdAt: new Date(createdAt.getTime() + 1) }),
      ),
    ]
    repository.items = items
    const output = await sut.execute({})
    expect(output).toStrictEqual({
      items: [...items].reverse().map(item => item.toJSON()),
      total: 2,
      currentPage: 1,
      lastPage: 1,
      perPage: 15,
    })
  })

  it('should return the items using pagination, sort and filter', async () => {
    const items = [
      new {{module_name.pascalCase()}}Entity({{module_name.pascalCase()}}DataBuilder({ name: 'a' })),
      new {{module_name.pascalCase()}}Entity({{module_name.pascalCase()}}DataBuilder({ name: 'AA' })),
      new {{module_name.pascalCase()}}Entity({{module_name.pascalCase()}}DataBuilder({ name: 'Aa' })),
      new {{module_name.pascalCase()}}Entity({{module_name.pascalCase()}}DataBuilder({ name: 'b' })),
      new {{module_name.pascalCase()}}Entity({{module_name.pascalCase()}}DataBuilder({ name: 'c' })),
    ]
    repository.items = items
    let output = await sut.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'a',
    })
    expect(output).toStrictEqual({
      items: [items[1].toJSON(), items[2].toJSON()],
      total: 3,
      currentPage: 1,
      lastPage: 2,
      perPage: 2,
    })

    output = await sut.execute({
      page: 2,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'a',
    })
    expect(output).toStrictEqual({
      items: [items[0].toJSON()],
      total: 3,
      currentPage: 2,
      lastPage: 2,
      perPage: 2,
    })

    output = await sut.execute({
      page: 1,
      perPage: 3,
      sort: 'name',
      sortDir: 'desc',
      filter: 'a',
    })
    expect(output).toStrictEqual({
      items: [items[0].toJSON(), items[2].toJSON(), items[1].toJSON()],
      total: 3,
      currentPage: 1,
      lastPage: 1,
      perPage: 3,
    })
  })
})
