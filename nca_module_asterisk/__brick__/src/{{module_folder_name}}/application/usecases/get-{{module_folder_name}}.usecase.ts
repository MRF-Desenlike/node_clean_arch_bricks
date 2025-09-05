import { {{module_name.pascalCase()}}Repository } from '@/{{module_folder_name}}/domain/repositories/{{module_folder_name}}.repository'
import { {{module_name.pascalCase()}}Output, {{module_name.pascalCase()}}OutputMapper } from '../dtos/{{module_folder_name}}-output'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'

export namespace Get{{module_name.pascalCase()}}UseCase {
  export type Input = {
    id: number
  }

  export type Output = {{module_name.pascalCase()}}Output

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private {{module_name.camelCase()}}Repository: {{module_name.pascalCase()}}Repository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.{{module_name.camelCase()}}Repository.findById(input.id)
      return {{module_name.pascalCase()}}OutputMapper.toOutput(entity)
    }
  }
}
