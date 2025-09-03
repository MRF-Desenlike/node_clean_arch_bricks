import { {{module_name.pascalCase()}}InMemoryRepository } from '@/{{module_folder_name}}/infrastructure/database/in-memory/repositories/{{module_folder_name}}-in-memory.repository'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { {{module_name.pascalCase()}}Entity } from '@/{{module_folder_name}}/domain/entities/{{module_folder_name}}.entity'
import { {{module_name.pascalCase()}}DataBuilder } from '@/{{module_folder_name}}/domain/testing/helpers/{{module_folder_name}}-data-builder'
import { SoftDelete{{module_name.pascalCase()}}UseCase } from '../../soft-delete-{{module_folder_name}}.usecase'

describe('SoftDelete{{module_name.pascalCase()}}UseCase unit tests', () => {
  let sut: SoftDelete{{module_name.pascalCase()}}UseCase.UseCase
  let repository: {{module_name.pascalCase()}}InMemoryRepository

  beforeEach(() => {
    repository = new {{module_name.pascalCase()}}InMemoryRepository()
    sut = new SoftDelete{{module_name.pascalCase()}}UseCase.UseCase(repository)
  })

  it('Should throws error when entity not found', async () => {
    await expect(() => sut.execute({ id: 'fakeId' })).rejects.toThrow(
      new NotFoundError('Entity not found using id fakeId'),
    )
  })

  it('Should soft delete an item', async () => {
    const entity = new {{module_name.pascalCase()}}Entity({{module_name.pascalCase()}}DataBuilder({}))
    repository.items = [entity]

    expect(entity.isDeleted()).toBe(false)

    await sut.execute({ id: entity._id })

    expect(entity.isDeleted()).toBe(true)
    expect(entity.deletedAt).toBeInstanceOf(Date)
  })
})
