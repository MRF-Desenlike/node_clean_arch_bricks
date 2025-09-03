import { faker } from '@faker-js/faker'
import { {{module_name.pascalCase()}}Props } from '../../entities/{{module_folder_name}}.entity'

type Props = {
  name?: string
  email?: string
  password?: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

export function {{module_name.pascalCase()}}DataBuilder(props: Props): {{module_name.pascalCase()}}Props {
  return {
    name: props.name ?? faker.person.fullName(),
    email: props.email ?? faker.internet.email(),
    password: props.password ?? faker.internet.password(),
    createdAt: props.createdAt ?? new Date(),
    updatedAt: props.updatedAt ?? new Date(),
    deletedAt: props.deletedAt ?? null,
  }
}
