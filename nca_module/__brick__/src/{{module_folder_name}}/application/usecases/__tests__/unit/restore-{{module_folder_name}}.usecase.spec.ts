import { {{module_name.pascalCase()}}InMemoryRepository } from '@/{{module_folder_name}}/infrastructure/database/in-memory/repositories/{{module_folder_name}}-in-memory.repository'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { {{module_name.pascalCase()}}Entity } from '@/{{module_folder_name}}/domain/entities/{{module_folder_name}}.entity'
import { {{module_name.pascalCase()}}DataBuilder } from '@/{{module_folder_name}}/domain/testing/helpers/{{module_folder_name}}-data-builder'
import { Restore{{module_name.pascalCase()}}UseCase } from '../../restore-{{module_folder_name}}.usecase'

describe('Restore{{module_name.pascalCase()}}UseCase unit tests', () => {
  let sut: Restore{{module_name.pascalCase()}}UseCase.UseCase
  let repository: {{module_name.pascalCase()}}InMemoryRepository

  beforeEach(() => {
    repository = new {{module_name.pascalCase()}}InMemoryRepository()
    sut = new Restore{{module_name.pascalCase()}}UseCase.UseCase(repository)
  })

  it('Should throws error when entity not found', async () => {
    await expect(() => sut.execute({ id: 'fakeId' })).rejects.toThrow(
      new NotFoundError('Entity not found using id fakeId'),
    )
  })

  it('Should restore a soft deleted {{module_name}}', async () => {
    const entity = new {{module_name.pascalCase()}}Entity({{module_name.pascalCase()}}DataBuilder({}))
    entity.softDelete() // Soft delete the entity first
    repository.items = [entity]

    expect(entity.isDeleted()).toBe(true)

    await sut.execute({ id: entity._id })

    expect(entity.isDeleted()).toBe(false)
    expect(entity.deletedAt).toBeNull()
  })
})
