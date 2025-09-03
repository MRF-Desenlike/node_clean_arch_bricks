import { {{module_name.pascalCase()}}Repository } from '@/{{module_folder_name}}/domain/repositories/{{module_folder_name}}.repository'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'

export namespace Delete{{module_name.pascalCase()}}UseCase {
  export type Input = {
    id: string
  }

  export type Output = void

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private {{module_name.camelCase()}}Repository: {{module_name.pascalCase()}}Repository.Repository) {}

    async execute(input: Input): Promise<Output> {
      await this.{{module_name.camelCase()}}Repository.delete(input.id)
    }
  }
}
