import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { {{module_name.pascalCase()}}PrismaRepository } from '@/{{module_folder_name}}/infrastructure/database/prisma/repositories/{{module_folder_name}}-prisma.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { Create{{module_name.pascalCase()}}UseCase } from '../../create-{{module_folder_name}}.usecase'

describe('Create{{module_name.pascalCase()}}UseCase integration tests', () => {
  const prismaService = new PrismaClient()
  let sut: Create{{module_name.pascalCase()}}UseCase.UseCase
  let repository: {{module_name.pascalCase()}}PrismaRepository
  let module: TestingModule

  beforeAll(async () => {
    setupPrismaTests()
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile()
  })

  beforeEach(async () => {
    sut = new Create{{module_name.pascalCase()}}UseCase.UseCase(repository)
    await prismaService.{{module_name.camelCase()}}.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should create a item', async () => {
    const props = {
      name: 'test name',
      email: 'a@a.com',
      password: 'TestPassword123',
    }
    const output = await sut.execute(props)
    expect(output.id).toBeDefined()
    expect(output.createdAt).toBeInstanceOf(Date)
  })
})
