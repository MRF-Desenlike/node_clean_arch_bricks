import { Create{{module_name.pascalCase()}}UseCase } from '@/{{module_folder_name}}/application/usecases/create-{{module_folder_name}}.usecase'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsNumber } from 'class-validator'

export class Create{{module_name.pascalCase()}}Dto implements Create{{module_name.pascalCase()}}UseCase.Input {
  @ApiProperty({ description: 'ID do Tenant' })
  @IsNumber()
  @IsNotEmpty()
  tenant_id: number

  @ApiProperty({ description: 'Nome' })
  @IsString()
  @IsNotEmpty()
  name: string
}
