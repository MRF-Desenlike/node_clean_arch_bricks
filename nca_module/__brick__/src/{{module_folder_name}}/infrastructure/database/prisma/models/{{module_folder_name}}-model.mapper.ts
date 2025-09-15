import { ValidationError } from '@/shared/domain/errors/validation-error'
import { {{module_name.pascalCase()}}Entity } from '@/{{module_folder_name}}/domain/entities/{{module_folder_name}}.entity'
import { {{module_name.pascalCase()}} } from '@prisma/client'

export class {{module_name.pascalCase()}}ModelMapper {
  static toEntity(model: {{module_name.pascalCase()}}) {
    const data = {
      {{#fields}}{{ name.camelCase() }}: model.{{ name.camelCase() }},
      {{/fields}}
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    }

    try {
      return new {{module_name.pascalCase()}}Entity(data, model.id)
    } catch {
      throw new ValidationError('An entity not be loaded')
    }
  }
}
