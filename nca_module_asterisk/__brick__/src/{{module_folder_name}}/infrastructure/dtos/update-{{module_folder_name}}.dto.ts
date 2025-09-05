import { Update{{module_name.pascalCase()}}UseCase } from '@/{{module_folder_name}}/application/usecases/update-{{module_folder_name}}.usecase'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsNumber } from 'class-validator'

export class Update{{module_name.pascalCase()}}Dto implements Omit<Update{{module_name.pascalCase()}}UseCase.Input, 'id'> {
  @ApiProperty({ description: 'ID do Tenant' })
  @IsNumber()
  @IsNotEmpty()
  tenant_id: number

  @ApiProperty({ description: 'Nome do usuário' })
  @IsString()
  @IsNotEmpty()
  name: string
}
