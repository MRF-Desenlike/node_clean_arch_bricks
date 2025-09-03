import { Create{{module_name.pascalCase()}}UseCase } from '@/{{module_folder_name}}/application/usecases/create-{{module_folder_name}}.usecase'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class Create{{module_name.pascalCase()}}Dto implements Create{{module_name.pascalCase()}}UseCase.Input {
  @ApiProperty({ description: 'Nome do usuário' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: 'E-mail do usuário' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({ description: 'Senha do usuário' })
  @IsString()
  @IsNotEmpty()
  password: string
}
