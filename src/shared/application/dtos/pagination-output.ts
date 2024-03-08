import { Entity } from '@/shared/domain/entities/entity'
import { SearchResult } from '@/shared/domain/repositories/searchable-repository-contracts'

export type PaginationOutPut<Item = any> = {
  items: Item[]
  total: number
  currentPage: number
  lastPage: number
  perPage: number
}

export class PaginationOutputMapper {
  static toOutput<Item = any>(
    items: Item[],
    result: SearchResult<Entity>,
  ): PaginationOutPut<Item> {
    return {
      items,
      total: result.total,
      currentPage: result.currentPage,
      lastPage: result.lastPage,
      perPage: result.perPage,
    }
  }
}
