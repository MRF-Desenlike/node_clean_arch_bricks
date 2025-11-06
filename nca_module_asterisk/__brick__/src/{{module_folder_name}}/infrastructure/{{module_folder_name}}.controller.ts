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
import { List{{module_name.pascalCase()}}Dto } from './dtos/list-{{module_folder_name}}.dto'
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
import { CurrentUser, CurrentUserData } from '@/shared/infrastructure/decorators/current-user.decorator'
import { Create{{module_name.pascalCase()}}Service } from '@/shared/application/services/{{module_folder_name}}/create-{{module_folder_name}}.service'
import { Update{{module_name.pascalCase()}}Service } from '@/shared/application/services/{{module_folder_name}}/update-{{module_folder_name}}.service'
import { Delete{{module_name.pascalCase()}}Service } from '@/shared/application/services/{{module_folder_name}}/delete-{{module_folder_name}}.service'
import { Get{{module_name.pascalCase()}}Service } from '@/shared/application/services/{{module_folder_name}}/get-{{module_folder_name}}.service'
import { List{{module_name.pascalCase()}}Service } from '@/shared/application/services/{{module_folder_name}}/list-{{module_folder_name}}.service'
import { List{{module_name.pascalCase()}}UseCase } from '../application/usecases/list-{{module_folder_name}}.usecase'

@ApiTags('{{module_folder_name}}')
@Controller('{{module_folder_name}}')
export class {{module_name.pascalCase()}}Controller {
  @Inject(Create{{module_name.pascalCase()}}Service)
  private {{module_name.camelCase()}}Service: Create{{module_name.pascalCase()}}Service

  @Inject(Update{{module_name.pascalCase()}}Service)
  private update{{module_name.pascalCase()}}Service: Update{{module_name.pascalCase()}}Service

  @Inject(Delete{{module_name.pascalCase()}}Service)
  private delete{{module_name.pascalCase()}}Service: Delete{{module_name.pascalCase()}}Service

  @Inject(Get{{module_name.pascalCase()}}Service)
  private get{{module_name.pascalCase()}}Service: Get{{module_name.pascalCase()}}Service

  @Inject(List{{module_name.pascalCase()}}Service)
  private list{{module_name.pascalCase()}}Service: List{{module_name.pascalCase()}}Service

  @Inject(AuthService)
  private authService: AuthService

  static {{module_name.camelCase()}}ToResponse(output: {{module_name.pascalCase()}}Output) {
    return new {{module_name.pascalCase()}}Presenter(output)
  }

  static list{{module_name.pascalCase()}}sToResponse(output: List{{module_name.pascalCase()}}UseCase.Output) {
    return new {{module_name.pascalCase()}}CollectionPresenter(output)
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 422,
    description: 'Corpo da requisição com dados inválidos',
  })
  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() {{module_name.camelCase()}}Dto: Create{{module_name.pascalCase()}}Dto,
    @CurrentUser() user: CurrentUserData,
  ) {
    const companyId = user.isSuperAdmin && {{module_name.camelCase()}}Dto.companyId
      ? {{module_name.camelCase()}}Dto.companyId
      : user.companyId
    const output = await this.{{module_name.camelCase()}}Service.execute({
      ...{{module_name.camelCase()}}Dto,
      companyId,
    })
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
  async search(
    @Query() searchParams: List{{module_name.pascalCase()}}Dto,
    @CurrentUser() user: CurrentUserData,
  ) {
    const companyId = user.isSuperAdmin && searchParams.companyId
      ? searchParams.companyId
      : user.companyId
    const output = await this.list{{module_name.pascalCase()}}Service.execute({
      ...searchParams,
      companyId,
    })
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
  async findOne(
    @Param('id') id: number,
    @Query() searchParams: List{{module_name.pascalCase()}}Dto,
    @CurrentUser() user: CurrentUserData,
  ) {
    const companyId = user.isSuperAdmin && searchParams.companyId
      ? searchParams.companyId
      : user.companyId
    const output = await this.get{{module_name.pascalCase()}}Service.execute({ id, companyId })
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
  async update(
    @Param('id') id: number, 
    @Body() update{{module_name.pascalCase()}}Dto: Update{{module_name.pascalCase()}}Dto,
    @CurrentUser() user: CurrentUserData,
  ) {
    const companyId = user.isSuperAdmin && update{{module_name.pascalCase()}}Dto.companyId
      ? update{{module_name.pascalCase()}}Dto.companyId
      : user.companyId
    const output = await this.update{{module_name.pascalCase()}}Service.execute({
      id,
      companyId,
      ...update{{module_name.pascalCase()}}Dto,
    })
    return {{module_name.pascalCase()}}Controller.{{module_name.camelCase()}}ToResponse(output)
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
  async remove(
    @Param('id') id: number,
    @Query() searchParams: List{{module_name.pascalCase()}}Dto,
    @CurrentUser() user: CurrentUserData,
  ) {
    const companyId = user.isSuperAdmin && searchParams.companyId
      ? searchParams.companyId
      : user.companyId
    await this.delete{{module_name.pascalCase()}}Service.execute({ id, companyId })
  }
}
