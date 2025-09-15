import { {{module_name.pascalCase()}}Repository } from '@/{{module_folder_name}}/domain/repositories/{{module_folder_name}}.repository'
import { {{module_name.pascalCase()}}Entity } from '@/{{module_folder_name}}/domain/entities/{{module_folder_name}}.entity'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { ConflictError } from '@/shared/domain/errors/conflict-error'
import { InMemorySearchableRepository } from '@/shared/domain/repositories/in-memory-searchable.repository'
import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contracts'
import { StringUtils } from '@/shared/utils/string.utils'

export class {{module_name.pascalCase()}}InMemoryRepository
  extends InMemorySearchableRepository<{{module_name.pascalCase()}}Entity>
  implements {{module_name.pascalCase()}}Repository.Repository
{
  sortableFields: string[] = [
    {{#fields}}'{{ name.camelCase() }}',
    {{/fields}}
    'createdAt', 
    'updatedAt'
  ]

  async search(
    props: {{module_name.pascalCase()}}Repository.SearchParams,
  ): Promise<{{module_name.pascalCase()}}Repository.SearchResult> {
    // Filter out deleted items first
    const activeItems = this.items.filter(item => !item.isDeleted())
    const tempItems = this.items
    this.items = activeItems
    const result = await super.search(props)
    this.items = tempItems
    return result
  }

  async findById(id: string): Promise<{{module_name.pascalCase()}}Entity> {
    const entity = this.items.find(item => item.id === id && !item.isDeleted())
    if (!entity) {
      throw new NotFoundError(`Entity not found using id ${id}`)
    }
    return entity
  }

  async findAll(): Promise<{{module_name.pascalCase()}}Entity[]> {
    return this.items.filter(item => !item.isDeleted())
  }

  async findAllIncludingDeleted(): Promise<{{module_name.pascalCase()}}Entity[]> {
    return this.items
  }

  async findByIdIncludingDeleted(id: string): Promise<{{module_name.pascalCase()}}Entity> {
    const entity = this.items.find(item => item.id === id)
    if (!entity) {
      throw new NotFoundError(`Entity not found using id ${id}`)
    }
    return entity
  }

  async softDelete(id: string): Promise<void> {
    const entity = await this.findById(id)
    entity.softDelete()
  }

  async restore(id: string): Promise<void> {
    const entity = await this.findByIdIncludingDeleted(id)
    entity.restore()
  }

  protected async applyFilter(
    items: {{module_name.pascalCase()}}Entity[],
    filter: {{module_name.pascalCase()}}Repository.Filter,
  ): Promise<{{module_name.pascalCase()}}Entity[]> {
    if (!filter) {
      return items
    }
    return items.filter(item => {
      return StringUtils.includesIgnoreAccents(item.props.name, filter)
    })
  }

  protected async applySort(
    items: {{module_name.pascalCase()}}Entity[],
    sort: string | null,
    sortDir: SortDirection | null,
  ): Promise<{{module_name.pascalCase()}}Entity[]> {
    return !sort
      ? super.applySort(items, 'createdAt', 'desc')
      : super.applySort(items, sort, sortDir)
  }
}
