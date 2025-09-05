import { EntityAsterisk } from '@/shared/domain/entities/entityAsterisk'
import { {{module_name.pascalCase()}}ValidatorFactory } from '../validators/{{module_folder_name}}.validator'
import { EntityValidationError } from '@/shared/domain/errors/validation-error'

export type {{module_name.pascalCase()}}Props = {
  tenant_id: number
  name: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

export class {{module_name.pascalCase()}}Entity extends EntityAsterisk<{{module_name.pascalCase()}}Props> {
  constructor(public readonly props: {{module_name.pascalCase()}}Props, id?: number) {
    {{module_name.pascalCase()}}Entity.validate(props)
    super(props, id)
    this.props.createdAt = this.props.createdAt ?? new Date()
    this.props.updatedAt = this.props.updatedAt ?? new Date()
  }

  update({
    tenant_id,
    name,
  }: {
    tenant_id?: number
    name?: string
  }): void {
    {{module_name.pascalCase()}}Entity.validate({
      ...this.props,
      tenant_id,
      name,
    })
    this.name = name ?? this.name,
    this.tenant_id = tenant_id ?? this.props.tenant_id,
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

  get name() {
    return this.props.name
  }

  private set name(value: string) {
    this.props.name = value
  }

  get tenant_id() {
    return this.props.tenant_id
  }

  private set tenant_id(value: number) {
    this.props.tenant_id = value
  }

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
