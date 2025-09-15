import { faker } from '@faker-js/faker'
import { {{module_name.pascalCase()}}Output } from '@/{{module_folder_name}}/application/dtos/{{module_folder_name}}-output'

type Props = {
  id?: string
  {{#fields}}{{ name.camelCase() }}?: {{ tsType }};
  {{/fields}}
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

export function {{module_name.pascalCase()}}OutputDataBuilder(props: Props = {}): {{module_name.pascalCase()}}Output {
  return {
    id: props.id ?? faker.string.uuid(),
    {{#fields}}{{ name.camelCase() }}: props.{{ name.camelCase() }} ?? faker.person.fullName(),
    {{/fields}}
    createdAt: props.createdAt ?? new Date(),
    updatedAt: props.updatedAt ?? new Date(),
    deletedAt: props.deletedAt,
  }
}
