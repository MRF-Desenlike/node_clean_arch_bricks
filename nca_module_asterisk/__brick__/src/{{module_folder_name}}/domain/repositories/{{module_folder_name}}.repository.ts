import { {{module_name.pascalCase()}}Entity } from '../entities/{{module_folder_name}}.entity'
import {
  SearchParams as DefaultSearchParams,
  SearchResultAsterisk as DefaultSearchResult,
  SearchableRepositoryInterfaceAsterisk,
} from '@/shared/domain/repositories/searchable-repository-contracts'

export namespace {{module_name.pascalCase()}}Repository {
  export type Filter = string

  export class SearchParams extends DefaultSearchParams<Filter> {}

  export class SearchResult extends DefaultSearchResult<{{module_name.pascalCase()}}Entity, Filter> {}

  export interface Repository
    extends SearchableRepositoryInterfaceAsterisk<
      {{module_name.pascalCase()}}Entity,
      Filter,
      SearchParams,
      SearchResult
    > {
    softDelete(id: number | string): Promise<void>
    restore(id: number | string): Promise<void>
    findAllIncludingDeleted(): Promise<{{module_name.pascalCase()}}Entity[]>
    findByIdIncludingDeleted(id: number | string): Promise<{{module_name.pascalCase()}}Entity>
  }
}
