import { PrismaClient } from '@prisma/client'
import { {{module_name.pascalCase()}}PrismaRepository } from '../../{{module_folder_name}}-prisma.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { {{module_name.pascalCase()}}Entity } from '@/{{module_folder_name}}/domain/entities/{{module_folder_name}}.entity'
import { {{module_name.pascalCase()}}DataBuilder } from '@/{{module_folder_name}}/domain/testing/helpers/{{module_folder_name}}-data-builder'
import { {{module_name.pascalCase()}}Repository } from '@/{{module_folder_name}}/domain/repositories/{{module_folder_name}}.repository'
import { ConflictError } from '@/shared/domain/errors/conflict-error'

describe('{{module_name.pascalCase()}}PrismaRepository integration tests', () => {
  const prismaService = new PrismaClient()
  let sut: {{module_name.pascalCase()}}PrismaRepository
  let module: TestingModule

  beforeAll(async () => {
    setupPrismaTests()
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile()
  })

  beforeEach(async () => {
    sut = new {{module_name.pascalCase()}}PrismaRepository(prismaService as any)
    await prismaService.{{module_name.camelCase()}}.deleteMany()
  })

  it('should throws error when entity not found', async () => {
    await expect(() => sut.findById('FakeId')).rejects.toThrow(
      new NotFoundError('{{module_name.pascalCase()}}Model not found using ID FakeId'),
    )
  })

  it('should finds a entity by id', async () => {
    const entity = new {{module_name.pascalCase()}}Entity({{module_name.pascalCase()}}DataBuilder({}))
    const new{{module_name.pascalCase()}} = await prismaService.{{module_name.camelCase()}}.create({
      data: entity.toJSON(),
    })

    const output = await sut.findById(new{{module_name.pascalCase()}}.id)
    expect(output.toJSON()).toStrictEqual(entity.toJSON())
  })

  it('should insert a new entity', async () => {
    const entity = new {{module_name.pascalCase()}}Entity({{module_name.pascalCase()}}DataBuilder({}))
    await sut.insert(entity)

    const result = await prismaService.{{module_name.camelCase()}}.findUnique({
      where: {
        id: entity._id,
      },
    })

    expect(result).toStrictEqual(entity.toJSON())
  })

  it('should returns all items', async () => {
    const entity = new {{module_name.pascalCase()}}Entity({{module_name.pascalCase()}}DataBuilder({}))
    const new{{module_name.pascalCase()}} = await prismaService.{{module_name.camelCase()}}.create({
      data: entity.toJSON(),
    })

    const entities = await sut.findAll()
    expect(entities).toHaveLength(1)
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]))
    entities.map(item => expect(item.toJSON()).toStrictEqual(entity.toJSON()))
  })

  it('should throws error on update when a entity not found', async () => {
    const entity = new {{module_name.pascalCase()}}Entity({{module_name.pascalCase()}}DataBuilder({}))
    await expect(() => sut.update(entity)).rejects.toThrow(
      new NotFoundError(`{{module_name.pascalCase()}}Model not found using ID ${entity._id}`),
    )
  })

  it('should update a entity', async () => {
    const entity = new {{module_name.pascalCase()}}Entity({{module_name.pascalCase()}}DataBuilder({}))
    const new{{module_name.pascalCase()}} = await prismaService.{{module_name.camelCase()}}.create({
      data: entity.toJSON(),
    })
    entity.update('new name')
    await sut.update(entity)

    const output = await prismaService.{{module_name.camelCase()}}.findUnique({
      where: {
        id: entity._id,
      },
    })
    expect(output.name).toBe('new name')
  })

  it('should throws error on delete when a entity not found', async () => {
    const entity = new {{module_name.pascalCase()}}Entity({{module_name.pascalCase()}}DataBuilder({}))
    await expect(() => sut.delete(entity._id)).rejects.toThrow(
      new NotFoundError(`{{module_name.pascalCase()}}Model not found using ID ${entity._id}`),
    )
  })

  it('should delete a entity', async () => {
    const entity = new {{module_name.pascalCase()}}Entity({{module_name.pascalCase()}}DataBuilder({}))
    const new{{module_name.pascalCase()}} = await prismaService.{{module_name.camelCase()}}.create({
      data: entity.toJSON(),
    })
    await sut.delete(entity._id)

    const output = await prismaService.{{module_name.camelCase()}}.findUnique({
      where: {
        id: entity._id,
      },
    })
    expect(output).toBeNull()
  })

  describe('search method tests', () => {
    it('should apply only pagination when the other params are null', async () => {
      const createdAt = new Date()
      const entities: {{module_name.pascalCase()}}Entity[] = []
      const arrange = Array(16).fill({{module_name.pascalCase()}}DataBuilder({}))
      arrange.forEach((element, index) => {
        entities.push(
          new {{module_name.pascalCase()}}Entity({
            ...element,
            email: `test${index}@mail.com`,
            createdAt: new Date(createdAt.getTime() + index),
          }),
        )
      })

      await prismaService.{{module_name.camelCase()}}.createMany({
        data: entities.map(item => item.toJSON()),
      })

      const searchOutput = await sut.search(new {{module_name.pascalCase()}}Repository.SearchParams())
      const items = searchOutput.items

      expect(searchOutput).toBeInstanceOf({{module_name.pascalCase()}}Repository.SearchResult)
      expect(searchOutput.total).toBe(16)
      expect(searchOutput.items.length).toBe(15)
      searchOutput.items.forEach(item => {
        expect(item).toBeInstanceOf({{module_name.pascalCase()}}Entity)
      })
      items.reverse().forEach((item, index) => {
        expect(`test${index + 1}@mail.com`).toBe(item.email)
      })
    })

    it('should search using filter, sort and paginate', async () => {
      const createdAt = new Date()
      const entities: {{module_name.pascalCase()}}Entity[] = []
      const arrange = ['test', 'a', 'TEST', 'b', 'TeSt']
      arrange.forEach((element, index) => {
        entities.push(
          new {{module_name.pascalCase()}}Entity({
            ...{{module_name.pascalCase()}}DataBuilder({ name: element }),
            createdAt: new Date(createdAt.getTime() + index),
          }),
        )
      })

      await prismaService.{{module_name.camelCase()}}.createMany({
        data: entities.map(item => item.toJSON()),
      })

      const searchOutputPage1 = await sut.search(
        new {{module_name.pascalCase()}}Repository.SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      )

      expect(searchOutputPage1.items[0].toJSON()).toMatchObject(
        entities[0].toJSON(),
      )
      expect(searchOutputPage1.items[1].toJSON()).toMatchObject(
        entities[4].toJSON(),
      )

      const searchOutputPage2 = await sut.search(
        new {{module_name.pascalCase()}}Repository.SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      )

      expect(searchOutputPage2.items[0].toJSON()).toMatchObject(
        entities[2].toJSON(),
      )
    })
  })
})
