import { CollectionPresenter } from '@/shared/infrastructure/presenters/collection.presenter'
import { {{module_name.pascalCase()}}Output } from '@/{{module_folder_name}}/application/dtos/{{module_folder_name}}-output'
import { List{{module_name.pascalCase()}}UseCase } from '@/{{module_folder_name}}/application/usecases/list-{{module_folder_name}}.usecase'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'

export class {{module_name.pascalCase()}}Presenter {
  @ApiProperty({ description: 'Identificação' })
  id: number

  @ApiProperty({ description: 'E-mail' })
  tenant_id: number

  @ApiProperty({ description: 'Nome' })
  name: string

  @ApiProperty({ description: 'Data de criação' })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date

  constructor(output: {{module_name.pascalCase()}}Output) {
    this.id = output.id
    this.tenant_id = output.tenant_id
    this.name = output.name
    this.createdAt = output.createdAt
  }
}

export class {{module_name.pascalCase()}}CollectionPresenter extends CollectionPresenter {
  data: {{module_name.pascalCase()}}Presenter[]

  constructor(output: List{{module_name.pascalCase()}}UseCase.Output) {
    const { items, ...paginationProps } = output
    super(paginationProps)
    this.data = items.map(item => new {{module_name.pascalCase()}}Presenter(item))
  }
}
