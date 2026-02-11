import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Product } from '../../orm/entities/product.entity';
import { CollectionFilesService } from '../collection-files/collection-files.service';

type SortOrder = 'asc' | 'desc';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly files: CollectionFilesService,
  ) {}

  private applyCoreFilters(qb: SelectQueryBuilder<Product>, filters: Record<string, any>) {
    if (filters.price?.lt !== undefined) {
      qb.andWhere('p.price < :priceLt', { priceLt: filters.price.lt });
    }
    if (filters.price?.gt !== undefined) {
      qb.andWhere('p.price > :priceGt', { priceGt: filters.price.gt });
    }
    if (filters.status !== undefined) {
      qb.andWhere('p.status = :status', { status: filters.status });
    }
    if (filters.sku_in) {
      qb.andWhere('p.sku IN (:...skuIn)', { skuIn: filters.sku_in });
    }
  }

  private applyCustomFilters(qb: SelectQueryBuilder<Product>, filters: Record<string, any>) {
    for (const [key, value] of Object.entries(filters)) {
      if (['price', 'status', 'sku_in'].includes(key)) continue;
      if (value === undefined) continue;
      const alias = `pp_${key}`;
      if (Array.isArray(value)) {
        qb.andWhere(`
          EXISTS (
            SELECT 1 FROM product_properties ${alias}
            WHERE ${alias}.product_id = p.id
              AND ${alias}.property_key = :k_${key}
              AND ${alias}.value_string IN (:...v_${key})
          )
        `, { [`k_${key}`]: key, [`v_${key}`]: value });
      } else if (typeof value === 'boolean') {
        qb.andWhere(`
          EXISTS (
            SELECT 1 FROM product_properties ${alias}
            WHERE ${alias}.product_id = p.id
              AND ${alias}.property_key = :k_${key}
              AND ${alias}.value_bool = :v_${key}
          )
        `, { [`k_${key}`]: key, [`v_${key}`]: value });
      } else if (typeof value === 'number') {
        qb.andWhere(`
          EXISTS (
            SELECT 1 FROM product_properties ${alias}
            WHERE ${alias}.product_id = p.id
              AND ${alias}.property_key = :k_${key}
              AND (${alias}.value_int = :v_${key} OR ${alias}.value_decimal = :v_${key})
          )
        `, { [`k_${key}`]: key, [`v_${key}`]: value });
      } else if (typeof value === 'string') {
        qb.andWhere(`
          EXISTS (
            SELECT 1 FROM product_properties ${alias}
            WHERE ${alias}.product_id = p.id
              AND ${alias}.property_key = :k_${key}
              AND ${alias}.value_string = :v_${key}
          )
        `, { [`k_${key}`]: key, [`v_${key}`]: value });
      }
    }
  }

  private applySort(qb: SelectQueryBuilder<Product>, sort?: Record<string, SortOrder>) {
    if (!sort) return;
    const entries = Object.entries(sort);
    for (const [key, dir] of entries) {
      if (['price', 'stock', 'sku', 'status'].includes(key)) {
        qb.addOrderBy(`p.${key}`, dir.toUpperCase() as 'ASC' | 'DESC', 'NULLS LAST');
      } else {
        const alias = `s_${key}`;
        qb.leftJoin(
          'product_properties',
          alias,
          `${alias}.product_id = p.id AND ${alias}.property_key = :sort_${key}`,
          { [`sort_${key}`]: key },
        );
        qb.addOrderBy(`${alias}.value_int`, dir.toUpperCase() as 'ASC' | 'DESC', 'NULLS LAST');
        qb.addOrderBy(`${alias}.value_decimal`, dir.toUpperCase() as 'ASC' | 'DESC', 'NULLS LAST');
        qb.addOrderBy(`${alias}.value_string`, dir.toUpperCase() as 'ASC' | 'DESC', 'NULLS LAST');
      }
    }
  }

  async run(id: string, page = 1, pageSize = 20) {
    const def = await this.files.get(id);
    if (!def) return { total: 0, items: [] };
    const filters = def.filters ?? {};
    const sort = def.sort ?? {};
    const ps = def.pagination?.pageSize ?? pageSize;
    const qb = this.productRepo.createQueryBuilder('p');
    if (def.schema_id) {
      qb.andWhere('p.schema_id = :schemaId', { schemaId: def.schema_id });
    }
    this.applyCoreFilters(qb, filters);
    this.applyCustomFilters(qb, filters);
    this.applySort(qb, sort);
    qb.limit(ps).offset((page - 1) * ps);
    const items = await qb.getMany();
    return { items, page, pageSize: ps };
  }
}
