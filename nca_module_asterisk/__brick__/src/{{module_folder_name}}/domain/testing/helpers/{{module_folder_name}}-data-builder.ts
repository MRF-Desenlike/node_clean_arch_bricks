import { faker } from '@faker-js/faker'
import { {{module_name.pascalCase()}}Props } from '../../entities/{{module_folder_name}}.entity'

type Props = {
  {{#fields}}{{ name }}?: {{ tsType }};
  {{/fields}}
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

export function {{module_name.pascalCase()}}DataBuilder(props: Props): {{module_name.pascalCase()}}Props {
  return {
    {{#fields}}{{ name }}: props.{{ name }} ?? faker.person.fullName(),
    {{/fields}}
    createdAt: props.createdAt ?? new Date(),
    updatedAt: props.updatedAt ?? new Date(),
    deletedAt: props.deletedAt ?? null,
  }
}
