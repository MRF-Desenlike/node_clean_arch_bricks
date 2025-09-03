import { {{module_name.pascalCase()}}Repository } from '@/{{module_folder_name}}/domain/repositories/{{module_folder_name}}.repository'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module'
import { {{module_name.pascalCase()}}Module } from '../../{{module_folder_name}}.module'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import request from 'supertest'
import { {{module_name.pascalCase()}}Controller } from '../../{{module_folder_name}}.controller'
import { instanceToPlain } from 'class-transformer'
import { applyGlobalConfig } from '@/global-config'
import { {{module_name.pascalCase()}}Entity } from '@/{{module_folder_name}}/domain/entities/{{module_folder_name}}.entity'
import { {{module_name.pascalCase()}}DataBuilder } from '@/{{module_folder_name}}/domain/testing/helpers/{{module_folder_name}}-data-builder'
import { Update{{module_name.pascalCase()}}Dto } from '../../dtos/update-{{module_folder_name}}.dto'

describe('{{module_name.pascalCase()}}Controller e2e tests', () => {
  let app: INestApplication
  let module: TestingModule
  let repository: {{module_name.pascalCase()}}Repository.Repository
  let update{{module_name.pascalCase()}}Dto: Update{{module_name.pascalCase()}}Dto
  const prismaService = new PrismaClient()
  let entity: {{module_name.pascalCase()}}Entity
  let accessToken: string

  beforeAll(async () => {
    setupPrismaTests()
    module = await Test.createTestingModule({
      imports: [
        EnvConfigModule,
        {{module_name.pascalCase()}}Module,
        DatabaseModule.forTest(prismaService),
      ],
    }).compile()
    app = module.createNestApplication()
    applyGlobalConfig(app)
    await app.init()
    repository = module.get<{{module_name.pascalCase()}}Repository.Repository>('{{module_name.pascalCase()}}Repository')
  })

  beforeEach(async () => {
    update{{module_name.pascalCase()}}Dto = {
      name: 'test name',
    }
    await prismaService.{{module_name.camelCase()}}.deleteMany()
    entity = new {{module_name.pascalCase()}}Entity(
      {{module_name.pascalCase()}}DataBuilder({
        email: 'a@a.com',
        password: '',
      }),
    )
    await repository.insert(entity)

    const loginResponse = await request(app.getHttpServer())
      .post('/{{module_folder_name}}/login')
      .send({ email: 'a@a.com', password: '1234' })
      .expect(200)
    accessToken = loginResponse.body.accessToken
  })

  describe('PUT /{{module_folder_name}}/:id', () => {
    it('should update a item', async () => {
      update{{module_name.pascalCase()}}Dto.name = 'test name'
      const res = await request(app.getHttpServer())
        .put(`/{{module_folder_name}}/${entity._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(update{{module_name.pascalCase()}}Dto)
        .expect(200)
      const {{module_name.camelCase()}} = await repository.findById(entity._id)
      const presenter = {{module_name.pascalCase()}}Controller.{{module_name.camelCase()}}ToResponse({{module_name.camelCase()}}.toJSON())
      const serialized = instanceToPlain(presenter)
      expect(res.body.data).toStrictEqual(serialized)
    })

    it('should return a error with 422 code when the request body is invalid', async () => {
      const res = await request(app.getHttpServer())
        .put(`/{{module_folder_name}}/${entity._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(422)
      expect(res.body.error).toBe('Unprocessable Entity')
      expect(res.body.message).toEqual([
        'name should not be empty',
        'name must be a string',
      ])
    })

    it('should return a error with 404 code when throw NotFoundError with invalid id', async () => {
      const res = await request(app.getHttpServer())
        .put('/{{module_folder_name}}/fakeId')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(update{{module_name.pascalCase()}}Dto)
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: '{{module_name.pascalCase()}}Model not found using ID fakeId',
        })
    })

    it('should return a error with 401 code when the request is not authorized', async () => {
      const res = await request(app.getHttpServer())
        .put('/{{module_folder_name}}/fakeId')
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        })
    })
  })
})
