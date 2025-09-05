import { faker } from '@faker-js/faker'
import { {{module_name.pascalCase()}}Output } from '@/{{module_folder_name}}/application/dtos/{{module_folder_name}}-output'

type Props = {
  id?: number
  tenant_id?: number
  name?: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

export function {{module_name.pascalCase()}}OutputDataBuilder(props: Props = {}): {{module_name.pascalCase()}}Output {
  return {
    id: props.id ?? faker.number.int({ min: 1 }),
    tenant_id: props.tenant_id ?? faker.number.int({ min: 1 }),
    name: props.name ?? faker.person.fullName(),
    createdAt: props.createdAt ?? new Date(),
    updatedAt: props.updatedAt ?? new Date(),
    deletedAt: props.deletedAt,
  }
}
