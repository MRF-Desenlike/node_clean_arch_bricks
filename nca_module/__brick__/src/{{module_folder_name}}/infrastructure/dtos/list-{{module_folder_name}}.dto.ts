import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contracts'
import { List{{module_name.pascalCase()}}UseCase } from '@/{{module_folder_name}}/application/usecases/list-{{module_folder_name}}.usecase'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class List{{module_name.pascalCase()}}Dto implements List{{module_name.pascalCase()}}UseCase.Input {
  @ApiPropertyOptional({ description: 'Página que será retornada' })
  @IsOptional()
  page?: number

  @ApiPropertyOptional({ description: 'Quantidade de registros por página' })
  @IsOptional()
  perPage?: number

  @ApiPropertyOptional({
    description: 'Coluna definida para ordenar os dados: "name" ou "createdAt"',
  })
  @IsOptional()
  sort?: string

  @ApiPropertyOptional({
    description: 'Ordenação dos dados: crescente ou decrescente',
  })
  @IsOptional()
  sortDir?: SortDirection

  @ApiPropertyOptional({
    description: 'Dado informado para filtrar o resultado',
  })
  @IsOptional()
  filter?: string
}
