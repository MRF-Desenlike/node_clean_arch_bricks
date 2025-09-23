import { faker } from '@faker-js/faker'
import { {{module_name.pascalCase()}}Output } from '@/{{module_folder_name}}/application/dtos/{{module_folder_name}}-output'

type Props = {
  id?: number
  {{#fields}}{{ name }}?: {{ tsType }};
  {{/fields}}
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

export function {{module_name.pascalCase()}}OutputDataBuilder(props: Props = {}): {{module_name.pascalCase()}}Output {
  return {
    id: props.id ?? faker.number.int({ min: 1 }),
    {{#fields}}{{ name }}: props.{{ name }} ?? faker.person.fullName(),
    {{/fields}}
    createdAt: props.createdAt ?? new Date(),
    updatedAt: props.updatedAt ?? new Date(),
    deletedAt: props.deletedAt,
  }
}
