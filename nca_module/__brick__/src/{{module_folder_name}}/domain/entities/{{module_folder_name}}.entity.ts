import { Entity } from '@/shared/domain/entities/entity'
import { {{module_name.pascalCase()}}ValidatorFactory } from '../validators/{{module_folder_name}}.validator'
import { EntityValidationError } from '@/shared/domain/errors/validation-error'

export type {{module_name.pascalCase()}}Props = {
  {{#fields}}{{ name.camelCase() }}{{#isOptional}}?{{/isOptional}}: {{ tsType }};
  {{/fields}}
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

export class {{module_name.pascalCase()}}Entity extends Entity<{{module_name.pascalCase()}}Props> {
  constructor(public readonly props: {{module_name.pascalCase()}}Props, id?: string) {
    {{module_name.pascalCase()}}Entity.validate(props)
    super(props, id)
    this.props.createdAt = this.props.createdAt ?? new Date()
    this.props.updatedAt = this.props.updatedAt ?? new Date()
  }

  update(data: {{module_name.pascalCase()}}Props): void {
    {{module_name.pascalCase()}}Entity.validate({
      ...this.props,
      ...data,
    })
    {{#fields}}this.{{ name.camelCase() }} = data.{{ name.camelCase() }} ?? this.{{ name.camelCase() }};
    {{/fields}}
    this.touch()
  }

  softDelete(): void {
    this.props.deletedAt = new Date()
    this.touch()
  }

  restore(): void {
    this.props.deletedAt = null
    this.touch()
  }

  isDeleted(): boolean {
    return this.props.deletedAt !== null && this.props.deletedAt !== undefined
  }

  private touch(): void {
    this.props.updatedAt = new Date()
  }

  {{#fields}}
  get {{ name.camelCase() }}() {
    return this.props.{{ name.camelCase() }}
  }
  private set {{ name.camelCase() }}(value: {{ tsType }}) {
    this.props.{{ name.camelCase() }} = value
  }
  {{/fields}}

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get deletedAt() {
    return this.props.deletedAt
  }

  static validate(props: {{module_name.pascalCase()}}Props) {
    const validator = {{module_name.pascalCase()}}ValidatorFactory.create()
    const isValid = validator.validate(props)
    if (!isValid) {
      throw new EntityValidationError(validator.errors)
    }
  }
}
