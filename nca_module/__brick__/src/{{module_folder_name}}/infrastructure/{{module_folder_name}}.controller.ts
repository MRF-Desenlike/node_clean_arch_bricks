import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  HttpCode,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common'
import { Create{{module_name.pascalCase()}}Dto } from './dtos/create-{{module_folder_name}}.dto'
import { Update{{module_name.pascalCase()}}Dto } from './dtos/update-{{module_folder_name}}.dto'
import { Create{{module_name.pascalCase()}}UseCase } from '../application/usecases/create-{{module_folder_name}}.usecase'
import { Update{{module_name.pascalCase()}}UseCase } from '../application/usecases/update-{{module_folder_name}}.usecase'
import { Delete{{module_name.pascalCase()}}UseCase } from '../application/usecases/delete-{{module_folder_name}}.usecase'
import { SoftDelete{{module_name.pascalCase()}}UseCase } from '../application/usecases/soft-delete-{{module_folder_name}}.usecase'
import { Restore{{module_name.pascalCase()}}UseCase } from '../application/usecases/restore-{{module_folder_name}}.usecase'
import { Get{{module_name.pascalCase()}}UseCase } from '../application/usecases/get-{{module_folder_name}}.usecase'
import { List{{module_name.pascalCase()}}UseCase } from '../application/usecases/list-{{module_folder_name}}.usecase'
import { List{{module_name.pascalCase()}}sDto } from './dtos/list-{{module_folder_name}}.dto'
import { {{module_name.pascalCase()}}Output } from '../application/dtos/{{module_folder_name}}-output'
import {
  {{module_name.pascalCase()}}CollectionPresenter,
  {{module_name.pascalCase()}}Presenter,
} from './presenters/{{module_folder_name}}.presenter'
import { AuthService } from '@/auth/infrastructure/auth.service'
import { AuthGuard } from '@/auth/infrastructure/auth.guard'
import {
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger'

@ApiTags('{{module_folder_name}}')
@Controller('{{module_folder_name}}')
export class {{module_name.pascalCase()}}Controller {
  @Inject(Create{{module_name.pascalCase()}}UseCase.UseCase)
  private {{module_name.camelCase()}}UseCase: Create{{module_name.pascalCase()}}UseCase.UseCase

  @Inject(Update{{module_name.pascalCase()}}UseCase.UseCase)
  private update{{module_name.pascalCase()}}UseCase: Update{{module_name.pascalCase()}}UseCase.UseCase

  @Inject(Delete{{module_name.pascalCase()}}UseCase.UseCase)
  private delete{{module_name.pascalCase()}}UseCase: Delete{{module_name.pascalCase()}}UseCase.UseCase

  @Inject(SoftDelete{{module_name.pascalCase()}}UseCase.UseCase)
  private softDelete{{module_name.pascalCase()}}UseCase: SoftDelete{{module_name.pascalCase()}}UseCase.UseCase

  @Inject(Restore{{module_name.pascalCase()}}UseCase.UseCase)
  private restore{{module_name.pascalCase()}}UseCase: Restore{{module_name.pascalCase()}}UseCase.UseCase

  @Inject(Get{{module_name.pascalCase()}}UseCase.UseCase)
  private get{{module_name.pascalCase()}}UseCase: Get{{module_name.pascalCase()}}UseCase.UseCase

  @Inject(List{{module_name.pascalCase()}}UseCase.UseCase)
  private list{{module_name.pascalCase()}}UseCase: List{{module_name.pascalCase()}}UseCase.UseCase

  @Inject(AuthService)
  private authService: AuthService

  static {{module_name.camelCase()}}ToResponse(output: {{module_name.pascalCase()}}Output) {
    return new {{module_name.pascalCase()}}Presenter(output)
  }

  static list{{module_name.pascalCase()}}sToResponse(output: List{{module_name.pascalCase()}}UseCase.Output) {
    return new {{module_name.pascalCase()}}CollectionPresenter(output)
  }

  @ApiResponse({
    status: 409,
    description: 'Conflito de e-mail',
  })
  @ApiResponse({
    status: 422,
    description: 'Corpo da requisição com dados inválidos',
  })
  @Post()
  async create(@Body() {{module_name.camelCase()}}Dto: Create{{module_name.pascalCase()}}Dto) {
    const output = await this.{{module_name.camelCase()}}UseCase.execute({{module_name.camelCase()}}Dto)
    return {{module_name.pascalCase()}}Controller.{{module_name.camelCase()}}ToResponse(output)
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        meta: {
          type: 'object',
          properties: {
            total: {
              type: 'number',
            },
            currentPage: {
              type: 'number',
            },
            lastPage: {
              type: 'number',
            },
            perPage: {
              type: 'number',
            },
          },
        },
        data: {
          type: 'array',
          items: { $ref: getSchemaPath({{module_name.pascalCase()}}Presenter) },
        },
      },
    },
  })
  @ApiResponse({
    status: 422,
    description: 'Parâmetros de consulta inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Acesso não autorizado',
  })
  @UseGuards(AuthGuard)
  @Get()
  async search(@Query() searchParams: List{{module_name.pascalCase()}}sDto) {
    const output = await this.list{{module_name.pascalCase()}}UseCase.execute(searchParams)
    return {{module_name.pascalCase()}}Controller.list{{module_name.pascalCase()}}sToResponse(output)
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 404,
    description: 'Id não encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'Acesso não autorizado',
  })
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const output = await this.get{{module_name.pascalCase()}}UseCase.execute({ id })
    return {{module_name.pascalCase()}}Controller.{{module_name.camelCase()}}ToResponse(output)
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 422,
    description: 'Corpo da requisição com dados inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Id não encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'Acesso não autorizado',
  })
  @UseGuards(AuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() update{{module_name.pascalCase()}}Dto: Update{{module_name.pascalCase()}}Dto) {
    const output = await this.update{{module_name.pascalCase()}}UseCase.execute({
      id,
      ...update{{module_name.pascalCase()}}Dto,
    })
    return {{module_name.pascalCase()}}Controller.{{module_name.camelCase()}}ToResponse(output)
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 204,
    description: '{{module_name}} deletado com sucesso (soft delete)',
  })
  @ApiResponse({
    status: 401,
    description: 'Acesso não autorizado',
  })
  @ApiResponse({
    status: 404,
    description: '{{module_name}} não encontrado',
  })
  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Patch(':id/soft-delete')
  async softDelete(@Param('id') id: string) {
    await this.softDelete{{module_name.pascalCase()}}UseCase.execute({ id })
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 204,
    description: '{{module_name}} restaurado com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Acesso não autorizado',
  })
  @ApiResponse({
    status: 404,
    description: '{{module_name}} não encontrado',
  })
  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Patch(':id/restore')
  async restore(@Param('id') id: string) {
    await this.restore{{module_name.pascalCase()}}UseCase.execute({ id })
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 204,
    description: 'Resposta de confirmação da exclusão (hard delete)',
  })
  @ApiResponse({
    status: 404,
    description: 'Id não encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'Acesso não autorizado',
  })
  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.delete{{module_name.pascalCase()}}UseCase.execute({ id })
  }
}
