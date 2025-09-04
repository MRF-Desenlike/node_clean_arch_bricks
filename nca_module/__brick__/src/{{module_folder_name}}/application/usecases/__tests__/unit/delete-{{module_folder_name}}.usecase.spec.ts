import { {{module_name.pascalCase()}}InMemoryRepository } from '@/{{module_folder_name}}/infrastructure/database/in-memory/repositories/{{module_folder_name}}-in-memory.repository'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { {{module_name.pascalCase()}}Entity } from '@/{{module_folder_name}}/domain/entities/{{module_folder_name}}.entity'
import { {{module_name.pascalCase()}}DataBuilder } from '@/{{module_folder_name}}/domain/testing/helpers/{{module_folder_name}}-data-builder'
import { Delete{{module_name.pascalCase()}}UseCase } from '../../delete-{{module_folder_name}}.usecase'

describe('Delete{{module_name.pascalCase()}}UseCase unit tests', () => {
  let sut: Delete{{module_name.pascalCase()}}UseCase.UseCase
  let repository: {{module_name.pascalCase()}}InMemoryRepository

  beforeEach(() => {
    repository = new {{module_name.pascalCase()}}InMemoryRepository()
    sut = new Delete{{module_name.pascalCase()}}UseCase.UseCase(repository)
  })

  it('Should throws error when entity not found', async () => {
    await expect(() => sut.execute({ id: 'fakeId' })).rejects.toThrow(
      new NotFoundError('Entity not found'),
    )
  })

  it('Should delete a {{module_name}}', async () => {
    const spyDelete = jest.spyOn(repository, 'delete')
    const items = [new {{module_name.pascalCase()}}Entity({{module_name.pascalCase()}}DataBuilder({}))]
    repository.items = items

    expect(repository.items).toHaveLength(1)
    await sut.execute({ id: items[0]._id })
    expect(spyDelete).toHaveBeenCalledTimes(1)
    expect(repository.items).toHaveLength(0)
  })
})
