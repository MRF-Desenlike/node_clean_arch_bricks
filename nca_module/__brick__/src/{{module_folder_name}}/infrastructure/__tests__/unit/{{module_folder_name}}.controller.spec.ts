import { {{module_name.pascalCase()}}Controller } from '../../{{module_folder_name}}.controller'
import { {{module_name.pascalCase()}}Output } from '@/{{module_folder_name}}/application/dtos/{{module_folder_name}}-output'
import { Create{{module_name.pascalCase()}}UseCase } from '@/{{module_folder_name}}/application/usecases/create-{{module_folder_name}}.usecase'
import { Create{{module_name.pascalCase()}}Dto } from '../../dtos/create-{{module_folder_name}}.dto'
import { Update{{module_name.pascalCase()}}UseCase } from '@/{{module_folder_name}}/application/usecases/update-{{module_folder_name}}.usecase'
import { Update{{module_name.pascalCase()}}Dto } from '../../dtos/update-{{module_folder_name}}.dto'
import { Get{{module_name.pascalCase()}}UseCase } from '@/{{module_folder_name}}/application/usecases/get-{{module_folder_name}}.usecase'
import { List{{module_name.pascalCase()}}UseCase } from '@/{{module_folder_name}}/application/usecases/list-{{module_folder_name}}.usecase'
import {
  {{module_name.pascalCase()}}CollectionPresenter,
  {{module_name.pascalCase()}}Presenter,
} from '../../presenters/{{module_folder_name}}.presenter'
import { {{module_name.pascalCase()}}OutputDataBuilder } from '@/{{module_folder_name}}/domain/testing/helpers/{{module_folder_name}}-output-data-builder'

describe('{{module_name.pascalCase()}}Controller unit tests', () => {
  let sut: {{module_name.pascalCase()}}Controller
  let id: string
  let props: {{module_name.pascalCase()}}Output

  beforeEach(async () => {
    sut = new {{module_name.pascalCase()}}Controller()
    id = 'df96ae94-6128-486e-840c-b6f78abb4801'
    props = {{module_name.pascalCase()}}OutputDataBuilder({
      id,
      name: 'Jhon Doe',
      email: 'a@a.com',
      password: '1234',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  it('should create a item', async () => {
    const output: Create{{module_name.pascalCase()}}UseCase.Output = props
    const mockCreate{{module_name.pascalCase()}}UseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    sut['{{module_name.camelCase()}}UseCase'] = mockCreate{{module_name.pascalCase()}}UseCase as any
    const input: Create{{module_name.pascalCase()}}Dto = {
      name: 'Jhon Doe',
      email: 'a@a.com',
      password: '1234',
    }
    const presenter = await sut.create(input)
    expect(presenter).toBeInstanceOf({{module_name.pascalCase()}}Presenter)
    expect(presenter).toStrictEqual(new {{module_name.pascalCase()}}Presenter(output))
    expect(mockCreate{{module_name.pascalCase()}}UseCase.execute).toHaveBeenCalledWith(input)
  })

  it('should update a item', async () => {
    const output: Update{{module_name.pascalCase()}}UseCase.Output = props
    const mockUpdate{{module_name.pascalCase()}}UseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    sut['update{{module_name.pascalCase()}}UseCase'] = mockUpdate{{module_name.pascalCase()}}UseCase as any
    const input: Update{{module_name.pascalCase()}}Dto = {
      name: 'new name',
    }
    const presenter = await sut.update(id, input)
    expect(presenter).toBeInstanceOf({{module_name.pascalCase()}}Presenter)
    expect(presenter).toStrictEqual(new {{module_name.pascalCase()}}Presenter(output))
    expect(mockUpdate{{module_name.pascalCase()}}UseCase.execute).toHaveBeenCalledWith({ id, ...input })
  })

  it('should delete a item', async () => {
    const output = undefined
    const mockDelete{{module_name.pascalCase()}}UseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    sut['delete{{module_name.pascalCase()}}UseCase'] = mockDelete{{module_name.pascalCase()}}UseCase as any
    const result = await sut.remove(id)
    expect(output).toStrictEqual(result)
    expect(mockDelete{{module_name.pascalCase()}}UseCase.execute).toHaveBeenCalledWith({
      id,
    })
  })

  it('should gets a item', async () => {
    const output: Get{{module_name.pascalCase()}}UseCase.Output = props
    const mockGet{{module_name.pascalCase()}}UseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    sut['get{{module_name.pascalCase()}}UseCase'] = mockGet{{module_name.pascalCase()}}UseCase as any
    const presenter = await sut.findOne(id)
    expect(presenter).toBeInstanceOf({{module_name.pascalCase()}}Presenter)
    expect(presenter).toStrictEqual(new {{module_name.pascalCase()}}Presenter(output))
    expect(mockGet{{module_name.pascalCase()}}UseCase.execute).toHaveBeenCalledWith({
      id,
    })
  })

  it('should list items', async () => {
    const output: List{{module_name.pascalCase()}}UseCase.Output = {
      items: [props],
      currentPage: 1,
      lastPage: 1,
      perPage: 1,
      total: 1,
    }
    const mockList{{module_name.pascalCase()}}UseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    sut['list{{module_name.pascalCase()}}UseCase'] = mockList{{module_name.pascalCase()}}UseCase as any
    const searchParams = {
      page: 1,
      perPage: 1,
    }
    const presenter = await sut.search(searchParams)
    expect(presenter).toBeInstanceOf({{module_name.pascalCase()}}CollectionPresenter)
    expect(presenter).toEqual(new {{module_name.pascalCase()}}CollectionPresenter(output))
    expect(mockList{{module_name.pascalCase()}}UseCase.execute).toHaveBeenCalledWith(searchParams)
  })
})
