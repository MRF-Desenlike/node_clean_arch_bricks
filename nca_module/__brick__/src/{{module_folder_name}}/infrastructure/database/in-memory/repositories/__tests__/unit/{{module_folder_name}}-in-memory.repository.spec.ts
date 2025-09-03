import { {{module_name.pascalCase()}}Entity } from '@/{{module_folder_name}}/domain/entities/{{module_folder_name}}.entity'
import { {{module_name.pascalCase()}}InMemoryRepository } from '../../{{module_folder_name}}-in-memory.repository'
import { {{module_name.pascalCase()}}DataBuilder } from '@/{{module_folder_name}}/domain/testing/helpers/{{module_folder_name}}-data-builder'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { ConflictError } from '@/shared/domain/errors/conflict-error'

describe('{{module_name.pascalCase()}}InMemoryRepository unit tests', () => {
  let sut: {{module_name.pascalCase()}}InMemoryRepository

  beforeEach(() => {
    sut = new {{module_name.pascalCase()}}InMemoryRepository()
  })

  it('Should no filter items when filter object is null', async () => {
    const entity = new {{module_name.pascalCase()}}Entity({{module_name.pascalCase()}}DataBuilder({}))
    await sut.insert(entity)
    const result = await sut.findAll()
    const spyFilter = jest.spyOn(result, 'filter')
    const itemsFiltered = await sut['applyFilter'](result, null)
    expect(spyFilter).not.toHaveBeenCalled()
    expect(itemsFiltered).toStrictEqual(result)
  })

  it('Should filter name field using filter param', async () => {
    const items = [
      new {{module_name.pascalCase()}}Entity({{module_name.pascalCase()}}DataBuilder({ name: 'Test' })),
      new {{module_name.pascalCase()}}Entity({{module_name.pascalCase()}}DataBuilder({ name: 'TEST' })),
      new {{module_name.pascalCase()}}Entity({{module_name.pascalCase()}}DataBuilder({ name: 'fake' })),
    ]
    const spyFilter = jest.spyOn(items, 'filter')
    const itemsFiltered = await sut['applyFilter'](items, 'TEST')
    expect(spyFilter).toHaveBeenCalled()
    expect(itemsFiltered).toStrictEqual([items[0], items[1]])
  })

  it('Should filter name field ignoring accents', async () => {
    const items = [
      new {{module_name.pascalCase()}}Entity({{module_name.pascalCase()}}DataBuilder({ name: 'Érick Nilson' })),
      new {{module_name.pascalCase()}}Entity({{module_name.pascalCase()}}DataBuilder({ name: 'José Silva' })),
      new {{module_name.pascalCase()}}Entity({{module_name.pascalCase()}}DataBuilder({ name: 'André Costa' })),
      new {{module_name.pascalCase()}}Entity({{module_name.pascalCase()}}DataBuilder({ name: 'Normal Name' })),
    ]

    // Buscar por "erick" deve encontrar "Érick Nilson"
    let itemsFiltered = await sut['applyFilter'](items, 'erick')
    expect(itemsFiltered).toStrictEqual([items[0]])

    // Buscar por "jose" deve encontrar "José Silva"
    itemsFiltered = await sut['applyFilter'](items, 'jose')
    expect(itemsFiltered).toStrictEqual([items[1]])

    // Buscar por "andre" deve encontrar "André Costa"
    itemsFiltered = await sut['applyFilter'](items, 'andre')
    expect(itemsFiltered).toStrictEqual([items[2]])

    // Buscar por "normal" deve encontrar "Normal Name"
    itemsFiltered = await sut['applyFilter'](items, 'normal')
    expect(itemsFiltered).toStrictEqual([items[3]])

    // Buscar por "nilson" deve encontrar "Érick Nilson"
    itemsFiltered = await sut['applyFilter'](items, 'nilson')
    expect(itemsFiltered).toStrictEqual([items[0]])
  })

  it('Should sort by createAt when sort param is null', async () => {
    const createdAt = new Date()
    const items = [
      new {{module_name.pascalCase()}}Entity({{module_name.pascalCase()}}DataBuilder({ name: 'Test', createdAt })),
      new {{module_name.pascalCase()}}Entity(
        {{module_name.pascalCase()}}DataBuilder({
          name: 'TEST',
          createdAt: new Date(createdAt.getTime() + 1),
        }),
      ),
      new {{module_name.pascalCase()}}Entity(
        {{module_name.pascalCase()}}DataBuilder({
          name: 'fake',
          createdAt: new Date(createdAt.getTime() + 2),
        }),
      ),
    ]
    const itemsSorted = await sut['applySort'](items, null, null)
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]])
  })

  it('Should sort by name field', async () => {
    const createdAt = new Date()
    const items = [
      new {{module_name.pascalCase()}}Entity({{module_name.pascalCase()}}DataBuilder({ name: 'c' })),
      new {{module_name.pascalCase()}}Entity(
        {{module_name.pascalCase()}}DataBuilder({
          name: 'd',
        }),
      ),
      new {{module_name.pascalCase()}}Entity(
        {{module_name.pascalCase()}}DataBuilder({
          name: 'a',
        }),
      ),
    ]
    let itemsSorted = await sut['applySort'](items, 'name', 'asc')
    expect(itemsSorted).toStrictEqual([items[2], items[0], items[1]])

    itemsSorted = await sut['applySort'](items, 'name', null)
    expect(itemsSorted).toStrictEqual([items[1], items[0], items[2]])
  })
})
