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
  let entity: {{module_name.pascalCase()}}Entity
  const prismaService = new PrismaClient()
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

  describe('GET /{{module_folder_name}}', () => {
    it('should return the {{module_name}}s ordered by createdAt', async () => {
      const createdAt = new Date()
      const entities: {{module_name.pascalCase()}}Entity[] = []
      const arrange = Array(3).fill({{module_name.pascalCase()}}DataBuilder({}))
      arrange.forEach((element, index) => {
        entities.push(
          new {{module_name.pascalCase()}}Entity({
            ...element,
            email: `a${index}@a.com`,
            createdAt: new Date(createdAt.getTime() + index),
          }),
        )
      })
      await prismaService.{{module_name.camelCase()}}.deleteMany()
      await prismaService.{{module_name.camelCase()}}.createMany({
        data: entities.map(item => item.toJSON()),
      })
      const searchParams = {}
      const queryParams = new URLSearchParams(searchParams as any).toString()

      const res = await request(app.getHttpServer())
        .get(`/{{module_folder_name}}/?${queryParams}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
      expect(Object.keys(res.body)).toStrictEqual(['data', 'meta'])
      expect(res.body).toStrictEqual({
        data: [...entities]
          .reverse()
          .map(item => instanceToPlain({{module_name.pascalCase()}}Controller.{{module_name.camelCase()}}ToResponse(item))),
        meta: {
          total: 3,
          currentPage: 1,
          perPage: 15,
          lastPage: 1,
        },
      })
    })

    it('should return the {{module_name}}s ordered by createdAt', async () => {
      const createdAt = new Date()
      const entities: {{module_name.pascalCase()}}Entity[] = []
      const arrange = ['test', 'a', 'TEST', 'b', 'TeSt']
      arrange.forEach((element, index) => {
        entities.push(
          new {{module_name.pascalCase()}}Entity({
            ...{{module_name.pascalCase()}}DataBuilder({}),
            name: element,
            email: `a${index}@a.com`,
          }),
        )
      })
      await prismaService.{{module_name.camelCase()}}.createMany({
        data: entities.map(item => item.toJSON()),
      })
      const searchParams = {
        page: 1,
        perPage: 2,
        sort: 'name',
        sortDir: 'asc',
        filter: 'TEST',
      }
      const queryParams = new URLSearchParams(searchParams as any).toString()

      const res = await request(app.getHttpServer())
        .get(`/{{module_folder_name}}/?${queryParams}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
      expect(Object.keys(res.body)).toStrictEqual(['data', 'meta'])
      expect(res.body).toStrictEqual({
        data: [entities[0], entities[4]].map(item =>
          instanceToPlain({{module_name.pascalCase()}}Controller.{{module_name.camelCase()}}ToResponse(item)),
        ),
        meta: {
          total: 3,
          currentPage: 1,
          perPage: 2,
          lastPage: 2,
        },
      })
    })

    it('should return a error with 422 code when the query params is invalid', async () => {
      const res = await request(app.getHttpServer())
        .get('/{{module_folder_name}}/?fakeId=10')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(422)
      expect(res.body.error).toBe('Unprocessable Entity')
      expect(res.body.message).toEqual(['property fakeId should not exist'])
    })

    it('should return a error with 401 code when the request is not authorized', async () => {
      const res = await request(app.getHttpServer())
        .get('/{{module_folder_name}}')
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        })
    })
  })
})
