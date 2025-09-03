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

describe('{{module_name.pascalCase()}}Controller e2e tests', () => {
  let app: INestApplication
  let module: TestingModule
  let repository: {{module_name.pascalCase()}}Repository.Repository
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

  describe('DELETE /{{module_folder_name}}/:id', () => {
    it('should remove a item', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/{{module_folder_name}}/${entity._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204)
        .expect({})
    })

    it('should return a error with 404 code when throw NotFoundError with invalid id', async () => {
      const res = await request(app.getHttpServer())
        .delete('/{{module_folder_name}}/fakeId')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: '{{module_name.pascalCase()}}Model not found using ID fakeId',
        })
    })

    it('should return a error with 401 code when the request is not authorized', async () => {
      const res = await request(app.getHttpServer())
        .delete('/{{module_folder_name}}/fakeId')
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        })
    })
  })
})
