import { {{module_name.pascalCase()}}Repository } from '@/{{module_folder_name}}/domain/repositories/{{module_folder_name}}.repository'
import { {{module_name.pascalCase()}}Output, {{module_name.pascalCase()}}OutputMapper } from '../dtos/{{module_folder_name}}-output'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { SearchInput } from '@/shared/application/dtos/search-input'
import {
  PaginationOutput,
  PaginationOutputMapperAsterisk,
} from '@/shared/application/dtos/pagination-output'

export namespace List{{module_name.pascalCase()}}UseCase {
  export type Input = SearchInput

  export type Output = PaginationOutput<{{module_name.pascalCase()}}Output>

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private {{module_name.camelCase()}}Repository: {{module_name.pascalCase()}}Repository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const params = new {{module_name.pascalCase()}}Repository.SearchParams(input)
      const searchResult = await this.{{module_name.camelCase()}}Repository.search(params)
      return this.toOutput(searchResult)
    }

    private toOutput(searchResult: {{module_name.pascalCase()}}Repository.SearchResult): Output {
      const items = searchResult.items.map(item => {
        return {{module_name.pascalCase()}}OutputMapper.toOutput(item)
      })
      return PaginationOutputMapperAsterisk.toOutput(items, searchResult)
    }
  }
}
