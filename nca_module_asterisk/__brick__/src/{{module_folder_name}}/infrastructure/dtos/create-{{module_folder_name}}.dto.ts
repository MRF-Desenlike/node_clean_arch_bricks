import { Create{{module_name.pascalCase()}}UseCase } from '@/{{module_folder_name}}/application/usecases/create-{{module_folder_name}}.usecase'
import { ApiProperty } from '@nestjs/swagger'
{{#needs_type_import}}import { Type } from 'class-transformer'{{/needs_type_import}}
{{#has_validator_imports}}import { {{validator_imports_csv}} } from 'class-validator'{{/has_validator_imports}}

export class Create{{module_name.pascalCase()}}Dto implements Create{{module_name.pascalCase()}}UseCase.Input {
  {{#fields}}
  @ApiProperty({ description: '{{description}}' })
  {{#validators}}@{{.}}
  {{/validators}}{{#useTypeDate}}@Type(() => Date)
  {{/useTypeDate}}{{name}}{{#isOptional}}?{{/isOptional}}: {{tsType}};
  {{/fields}}
}
