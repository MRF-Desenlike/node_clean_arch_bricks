import { faker } from '@faker-js/faker'
import { {{module_name.pascalCase()}}Props } from '../../entities/{{module_folder_name}}.entity'

type Props = {
  tenant_id?: number
  name?: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

export function {{module_name.pascalCase()}}DataBuilder(props: Props): {{module_name.pascalCase()}}Props {
  return {
    tenant_id: props.tenant_id ?? faker.number.int({ min: 1 }),
    name: props.name ?? faker.person.fullName(),
    createdAt: props.createdAt ?? new Date(),
    updatedAt: props.updatedAt ?? new Date(),
    deletedAt: props.deletedAt ?? null,
  }
}
