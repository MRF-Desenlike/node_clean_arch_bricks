import { {{module_name.pascalCase()}}InMemoryRepository } from '@/{{module_folder_name}}/infrastructure/database/in-memory/repositories/{{module_folder_name}}-in-memory.repository'
import { Create{{module_name.pascalCase()}}UseCase } from '../../create-{{module_folder_name}}.usecase'
import { {{module_name.pascalCase()}}DataBuilder } from '@/{{module_folder_name}}/domain/testing/helpers/{{module_folder_name}}-data-builder'
import { ConflictError } from '@/shared/domain/errors/conflict-error'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'

describe('Create{{module_name.pascalCase()}}UseCase unit tests', () => {
  let sut: Create{{module_name.pascalCase()}}UseCase.UseCase
  let repository: {{module_name.pascalCase()}}InMemoryRepository

  beforeEach(() => {
    repository = new {{module_name.pascalCase()}}InMemoryRepository()
    sut = new Create{{module_name.pascalCase()}}UseCase.UseCase(repository)
  })

  it('Should create a {{module_name}}', async () => {
    const spyInsert = jest.spyOn(repository, 'insert')
    const props = {{module_name.pascalCase()}}DataBuilder({})
    const result = await sut.execute({
      name: props.name,
      email: props.email,
      password: props.password,
    })
    expect(result.id).toBeDefined()
    expect(result.createdAt).toBeInstanceOf(Date)
    expect(spyInsert).toHaveBeenCalledTimes(1)
  })

  it('Should not be able to register with same email twice', async () => {
    const props = {{module_name.pascalCase()}}DataBuilder({ email: 'a@a.com' })
    await sut.execute(props)

    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(ConflictError)
  })

  it('Should throws error when name not provided', async () => {
    const props = Object.assign({{module_name.pascalCase()}}DataBuilder({}), { name: null })
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    )
  })

  it('Should throws error when email not provided', async () => {
    const props = Object.assign({{module_name.pascalCase()}}DataBuilder({}), { email: null })
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    )
  })

  it('Should throws error when password not provided', async () => {
    const props = Object.assign({{module_name.pascalCase()}}DataBuilder({}), { password: null })
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    )
  })
})
