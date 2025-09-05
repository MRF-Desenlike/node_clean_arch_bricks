import { {{module_name.pascalCase()}}Entity } from '@/{{module_folder_name}}/domain/entities/{{module_folder_name}}.entity'

export type {{module_name.pascalCase()}}Output = {
  id: number
  tenant_id: number
  name: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export class {{module_name.pascalCase()}}OutputMapper {
  static toOutput(entity: {{module_name.pascalCase()}}Entity): {{module_name.pascalCase()}}Output {
    return entity.toJSON()
  }
}
