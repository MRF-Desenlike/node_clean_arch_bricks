import { {{module_name.pascalCase()}}Repository } from '@/{{module_folder_name}}/domain/repositories/{{module_folder_name}}.repository'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { Create{{module_name.pascalCase()}}Dto } from '../../dtos/create-{{module_folder_name}}.dto'
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

describe('{{module_name.pascalCase()}}Controller e2e tests', () => {
  let app: INestApplication
  let module: TestingModule
  let repository: {{module_name.pascalCase()}}Repository.Repository
  let {{module_name.camelCase()}}Dto: Create{{module_name.pascalCase()}}Dto
  const prismaService = new PrismaClient()

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
    {{module_name.camelCase()}}Dto = {
      name: 'test name',
      email: 'a@a.com',
      password: 'TestPassword123',
    }
    await prismaService.{{module_name.camelCase()}}.deleteMany()
  })

  describe('POST /{{module_folder_name}}', () => {
    it('should create a item', async () => {
      const res = await request(app.getHttpServer())
        .post('/{{module_folder_name}}')
        .send({{module_name.camelCase()}}Dto)
        .expect(201)
      expect(Object.keys(res.body)).toStrictEqual(['data'])
      const {{module_name.camelCase()}} = await repository.findById(res.body.data.id)
      const presenter = {{module_name.pascalCase()}}Controller.{{module_name.camelCase()}}ToResponse({{module_name.camelCase()}}.toJSON())
      const serialized = instanceToPlain(presenter)
      expect(res.body.data).toStrictEqual(serialized)
    })

    it('should return a error with 422 code when the request body is invalid', async () => {
      const res = await request(app.getHttpServer())
        .post('/{{module_folder_name}}')
        .send({})
        .expect(422)
      expect(res.body.error).toBe('Unprocessable Entity')
      expect(res.body.message).toEqual([
        'name should not be empty',
        'name must be a string',
        'email must be an email',
        'email should not be empty',
        'email must be a string',
        'password should not be empty',
        'password must be a string',
      ])
    })

    it('should return a error with 422 code when the name field is invalid', async () => {
      delete {{module_name.camelCase()}}Dto.name
      const res = await request(app.getHttpServer())
        .post('/{{module_folder_name}}')
        .send({{module_name.camelCase()}}Dto)
        .expect(422)
      expect(res.body.error).toBe('Unprocessable Entity')
      expect(res.body.message).toEqual([
        'name should not be empty',
        'name must be a string',
      ])
    })

    it('should return a error with 422 code when the email field is invalid', async () => {
      delete {{module_name.camelCase()}}Dto.email
      const res = await request(app.getHttpServer())
        .post('/{{module_folder_name}}')
        .send({{module_name.camelCase()}}Dto)
        .expect(422)
      expect(res.body.error).toBe('Unprocessable Entity')
      expect(res.body.message).toEqual([
        'email must be an email',
        'email should not be empty',
        'email must be a string',
      ])
    })

    it('should return a error with 422 code when the password field is invalid', async () => {
      delete {{module_name.camelCase()}}Dto.password
      const res = await request(app.getHttpServer())
        .post('/{{module_folder_name}}')
        .send({{module_name.camelCase()}}Dto)
        .expect(422)
      expect(res.body.error).toBe('Unprocessable Entity')
      expect(res.body.message).toEqual([
        'password should not be empty',
        'password must be a string',
      ])
    })

    it('should return a error with 422 code with invalid field provided', async () => {
      const res = await request(app.getHttpServer())
        .post('/{{module_folder_name}}')
        .send(Object.assign({{module_name.camelCase()}}Dto, { xpto: 'fake' }))
        .expect(422)
      expect(res.body.error).toBe('Unprocessable Entity')
      expect(res.body.message).toEqual(['property xpto should not exist'])
    })

    it('should return a error with 409 code when the email is duplicated', async () => {
      const entity = new {{module_name.pascalCase()}}Entity({{module_name.pascalCase()}}DataBuilder({ ...{{module_name.camelCase()}}Dto }))
      await repository.insert(entity)
      const res = await request(app.getHttpServer())
        .post('/{{module_folder_name}}')
        .send({{module_name.camelCase()}}Dto)
        .expect(409)
        .expect({
          statusCode: 409,
          error: 'Conflict',
          message: 'Email address already used',
        })
    })
  })
})
