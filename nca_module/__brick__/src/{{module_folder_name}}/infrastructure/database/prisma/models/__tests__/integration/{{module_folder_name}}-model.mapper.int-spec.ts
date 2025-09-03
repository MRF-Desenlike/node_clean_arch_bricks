import { PrismaClient, {{module_name.pascalCase()}} } from '@prisma/client'
import { {{module_name.pascalCase()}}ModelMapper } from '../../{{module_folder_name}}-model.mapper'
import { ValidationError } from '@/shared/domain/errors/validation-error'
import { {{module_name.pascalCase()}}Entity } from '@/{{module_folder_name}}/domain/entities/{{module_folder_name}}.entity'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'

describe('{{module_name.pascalCase()}}ModelMapper integration tests', () => {
  let prismaService: PrismaClient
  let props: any

  beforeAll(async () => {
    setupPrismaTests()
    prismaService = new PrismaClient()
    await prismaService.$connect()
  })

  beforeEach(async () => {
    await prismaService.{{module_name.camelCase()}}.deleteMany()
    props = {
      id: 'd4255494-f981-4d26-a2a1-35d3f5b8d36a',
      name: 'Test name',
      email: 'a@a.com',
      password: 'TestPassword123',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    }
  })

  afterAll(async () => {
    await prismaService.$disconnect()
  })

  it('should throws error when item model is invalid', async () => {
    const model: {{module_name.pascalCase()}} = Object.assign(props, { name: null })
    expect(() => {{module_name.pascalCase()}}ModelMapper.toEntity(model)).toThrowError(ValidationError)
  })

  it('should convert a item model to a item entity', async () => {
    const model: {{module_name.pascalCase()}} = await prismaService.{{module_name.camelCase()}}.create({
      data: props,
    })
    const sut = {{module_name.pascalCase()}}ModelMapper.toEntity(model)
    expect(sut).toBeInstanceOf({{module_name.pascalCase()}}Entity)
    expect(sut.toJSON()).toStrictEqual(props)
  })
})
