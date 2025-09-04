import { {{module_name.pascalCase()}}InMemoryRepository } from '@/{{module_folder_name}}/infrastructure/database/in-memory/repositories/{{module_folder_name}}-in-memory.repository'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { {{module_name.pascalCase()}}Entity } from '@/{{module_folder_name}}/domain/entities/{{module_folder_name}}.entity'
import { {{module_name.pascalCase()}}DataBuilder } from '@/{{module_folder_name}}/domain/testing/helpers/{{module_folder_name}}-data-builder'
import { Update{{module_name.pascalCase()}}UseCase } from '../../update-{{module_folder_name}}.usecase'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'

describe('Update{{module_name.pascalCase()}}UseCase unit tests', () => {
  let sut: Update{{module_name.pascalCase()}}UseCase.UseCase
  let repository: {{module_name.pascalCase()}}InMemoryRepository

  beforeEach(() => {
    repository = new {{module_name.pascalCase()}}InMemoryRepository()
    sut = new Update{{module_name.pascalCase()}}UseCase.UseCase(repository)
  })

  it('Should throws error when entity not found', async () => {
    await expect(() =>
      sut.execute({ id: 'fakeId', name: 'test name' }),
    ).rejects.toThrow(new NotFoundError('Entity not found using id fakeId'))
  })

  it('Should throws error when name not provided', async () => {
    await expect(() => sut.execute({ id: 'fakeId', name: '' })).rejects.toThrow(
      new BadRequestError('Name not provided'),
    )
  })

  it('Should update a {{module_name}}', async () => {
    const spyUpdate = jest.spyOn(repository, 'update')
    const items = [new {{module_name.pascalCase()}}Entity({{module_name.pascalCase()}}DataBuilder({}))]
    repository.items = items

    const result = await sut.execute({ id: items[0]._id, name: 'new name' })
    expect(spyUpdate).toHaveBeenCalledTimes(1)
    expect(result).toMatchObject({
      id: items[0].id,
      name: 'new name',
      email: items[0].email,
      password: items[0].password,
      createdAt: items[0].createdAt,
    })
  })
})
