import { {{module_name.pascalCase()}}Repository } from '@/{{module_folder_name}}/domain/repositories/{{module_folder_name}}.repository'
import { {{module_name.pascalCase()}}Output, {{module_name.pascalCase()}}OutputMapper } from '../dtos/{{module_folder_name}}-output'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'

export namespace Update{{module_name.pascalCase()}}UseCase {
  export type Input = {
    id: string
    {{#fields}}{{ name.camelCase() }}{{#isOptional}}?{{/isOptional}}: {{ tsType }};
    {{/fields}}
  }

  export type Output = {{module_name.pascalCase()}}Output

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private {{module_name.camelCase()}}Repository: {{module_name.pascalCase()}}Repository.Repository) {}

    async execute(input: Input): Promise<Output> {
      {{#has_required}}
      if (
        {{#required_fields}}{{^isFirstRequired}} || {{/isFirstRequired}}!input.{{ name.camelCase() }}
        {{/required_fields}}
      ) {
        throw new BadRequestError('Input data not provided');
      }
      {{/has_required}}
      const entity = await this.{{module_name.camelCase()}}Repository.findById(input.id)
      entity.update(input)
      await this.{{module_name.camelCase()}}Repository.update(entity)
      return {{module_name.pascalCase()}}OutputMapper.toOutput(entity)
    }
  }
}
