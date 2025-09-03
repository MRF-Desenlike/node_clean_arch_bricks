import { {{module_name.pascalCase()}}Repository } from '@/{{module_folder_name}}/domain/repositories/{{module_folder_name}}.repository'
import { {{module_name.pascalCase()}}Output, {{module_name.pascalCase()}}OutputMapper } from '../dtos/{{module_folder_name}}-output'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'

export namespace Update{{module_name.pascalCase()}}UseCase {
  export type Input = {
    id: string
    name: string
  }

  export type Output = {{module_name.pascalCase()}}Output

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private {{module_name.camelCase()}}Repository: {{module_name.pascalCase()}}Repository.Repository) {}

    async execute(input: Input): Promise<Output> {
      if (!input.name) {
        throw new BadRequestError('Name not provided')
      }
      const entity = await this.{{module_name.camelCase()}}Repository.findById(input.id)
      entity.update(input.name)
      await this.{{module_name.camelCase()}}Repository.update(entity)
      return {{module_name.pascalCase()}}OutputMapper.toOutput(entity)
    }
  }
}
