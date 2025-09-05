import { {{module_name.pascalCase()}}Repository } from '@/{{module_folder_name}}/domain/repositories/{{module_folder_name}}.repository'
import { BadRequestError } from '../../../shared/application/errors/bad-request-error'
import { {{module_name.pascalCase()}}Entity } from '@/{{module_folder_name}}/domain/entities/{{module_folder_name}}.entity'
import { {{module_name.pascalCase()}}Output, {{module_name.pascalCase()}}OutputMapper } from '../dtos/{{module_folder_name}}-output'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'

export namespace Create{{module_name.pascalCase()}}UseCase {
  export type Input = {
    tenant_id: number
    name: string
  }

  export type Output = {{module_name.pascalCase()}}Output

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private {{module_name.camelCase()}}Repository: {{module_name.pascalCase()}}Repository.Repository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { tenant_id, name } = input

      if (!tenant_id || !name) {
        throw new BadRequestError('Input data not provided')
      }

      const entity = new {{module_name.pascalCase()}}Entity(
        Object.assign(input),
      )

      await this.{{module_name.camelCase()}}Repository.insert(entity)
      return {{module_name.pascalCase()}}OutputMapper.toOutput(entity)
    }
  }
}
