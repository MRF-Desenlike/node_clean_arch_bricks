import { faker } from '@faker-js/faker'
import { {{module_name.pascalCase()}}Output } from '@/{{module_folder_name}}/application/dtos/{{module_folder_name}}-output'

type Props = {
  id?: number | string
  {{#fields}}{{ name }}?: {{ tsType }};
  {{/fields}}
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

export function {{module_name.pascalCase()}}OutputDataBuilder(props: Props = {}): {{module_name.pascalCase()}}Output {
  return {
    id: props.id ?? (typeof props.id === 'number' ? faker.number.int({ min: 1 }) : faker.string.uuid()),
    {{#fields}}{{ name }}: props.{{ name }} ?? faker.person.fullName(),
    {{/fields}}
    createdAt: props.createdAt ?? new Date(),
    updatedAt: props.updatedAt ?? new Date(),
    deletedAt: props.deletedAt,
  }
}
