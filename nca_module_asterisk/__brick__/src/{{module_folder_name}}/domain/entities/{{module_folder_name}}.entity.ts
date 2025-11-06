import { EntityAsterisk } from '@/shared/domain/entities/entityAsterisk'
import { {{module_name.pascalCase()}}ValidatorFactory } from '../validators/{{module_folder_name}}.validator'
import { EntityValidationError } from '@/shared/domain/errors/validation-error'

export type {{module_name.pascalCase()}}Props = {
  {{#fields}}{{ name }}{{#isOptional}}?{{/isOptional}}: {{ tsType }};
  {{/fields}}
}

export class {{module_name.pascalCase()}}Entity extends EntityAsterisk<{{module_name.pascalCase()}}Props> {
  constructor(public readonly props: {{module_name.pascalCase()}}Props, id?: number | string) {
    {{module_name.pascalCase()}}Entity.validate(props)
    super(props, id)
  }

  update(data: {{module_name.pascalCase()}}Props): void {
    {{module_name.pascalCase()}}Entity.validate({
      ...this.props,
      ...data,
    })
    {{#fields}}this.{{ name }} = data.{{ name }} ?? this.{{ name }};
    {{/fields}}
    this.touch()
  }

  softDelete(): void {
    this.touch()
  }

  restore(): void {
    this.touch()
  }

  isDeleted(): boolean {
    return true
  }

  private touch(): void {
  }

  {{#fields}}
  get {{ name }}() {
    return this.props.{{ name }}
  }
  private set {{ name }}(value: {{ tsType }}) {
    this.props.{{ name }} = value
  }
  {{/fields}}

  static validate(props: {{module_name.pascalCase()}}Props) {
    const validator = {{module_name.pascalCase()}}ValidatorFactory.create()
    const isValid = validator.validate(props)
    if (!isValid) {
      throw new EntityValidationError(validator.errors)
    }
  }
}
