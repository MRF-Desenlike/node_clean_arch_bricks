import { faker } from '@faker-js/faker'
import { {{module_name.pascalCase()}}Props } from '../../entities/{{module_folder_name}}.entity'

type Props = {
  {{#fields}}{{ name }}?: {{ tsType }};
  {{/fields}}
}

export function {{module_name.pascalCase()}}DataBuilder(props: Props): {{module_name.pascalCase()}}Props {
  return {
    {{#fields}}{{ name }}: props.{{ name }} ?? faker.person.fullName(),
    {{/fields}}
  }
}
