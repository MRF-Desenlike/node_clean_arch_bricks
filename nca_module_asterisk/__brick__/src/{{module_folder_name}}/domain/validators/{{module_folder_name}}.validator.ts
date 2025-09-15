import { ClassValidatorFields } from '@/shared/domain/validators/class-validator-fields'
import { {{module_name.pascalCase()}}Props } from '../entities/{{module_folder_name}}.entity'
{{#needs_type_import}}import { Type } from 'class-transformer'{{/needs_type_import}}
{{#has_validator_imports}}import { IsDate, {{validator_imports_csv}} } from 'class-validator'{{/has_validator_imports}}

export class {{module_name.pascalCase()}}Rules {
  {{#fields}}
  {{#validators}}@{{.}}
  {{/validators}}{{#useTypeDate}}@Type(() => Date)
  {{/useTypeDate}}{{name.camelCase()}}{{#isOptional}}?{{/isOptional}}: {{tsType}};
  {{/fields}}

  @IsDate()
  @IsOptional()
  createdAt?: Date

  constructor({ 
    {{#fields}}{{ name.camelCase() }},
    {{/fields}}
    createdAt 
  }: {{module_name.pascalCase()}}Props) {
    Object.assign(this, { 
      {{#fields}}{{ name.camelCase() }},
      {{/fields}}
      createdAt 
    })
  }
}

export class {{module_name.pascalCase()}}Validator extends ClassValidatorFields<{{module_name.pascalCase()}}Rules> {
  validate(data: {{module_name.pascalCase()}}Rules): boolean {
    return super.validate(new {{module_name.pascalCase()}}Rules(data ?? ({} as {{module_name.pascalCase()}}Props)))
  }
}

export class {{module_name.pascalCase()}}ValidatorFactory {
  static create(): {{module_name.pascalCase()}}Validator {
    return new {{module_name.pascalCase()}}Validator()
  }
}
