import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Product } from '../../orm/entities/product.entity';
import { CollectionFilesService } from '../collection-files/collection-files.service';
import { SchemaFilesService } from '../schema-files/schema-files.service';
import { FilterResolverService } from '../filters/filter-resolver.service';
import { SortResolverService } from '../sorts/sort-resolver.service';

type SortOrder = 'asc' | 'desc';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly files: CollectionFilesService,
    private readonly schemas: SchemaFilesService,
    private readonly filtersResolver: FilterResolverService,
    private readonly sortResolver: SortResolverService,
  ) {}

  private applyFilters(qb: SelectQueryBuilder<Product>, filters: Record<string, any>, propertyTypes?: Record<string, any>, schemaId?: string) {
    this.filtersResolver.applyAll(qb, filters, { coreKeys: new Set(['price', 'status', 'sku', 'stock', 'sku_in']), propertyTypes, schemaId });
  }

  private applySort(qb: SelectQueryBuilder<Product>, sort?: Record<string, SortOrder>, propertyTypes?: Record<string, any>, schemaId?: string) {
    if (!sort) return;
    this.sortResolver.applyAll(qb, sort as any, { coreKeys: new Set(['price', 'status', 'sku', 'stock']), propertyTypes, schemaId });
  }

  async run(id: string, page = 1, pageSize = 20) {
    const def = await this.files.get(id);
    if (!def) return { total: 0, items: [] };
    const filters = def.filters ?? {};
    const sort = def.sort ?? {};
    const ps = pageSize ?? def.pagination?.pageSize ?? 20;
    const qb = this.productRepo.createQueryBuilder('p');
    if (def.schema_id) {
      qb.andWhere('p.schema_id = :schemaId', { schemaId: def.schema_id });
    }
    let propertyTypes: Record<string, any> | undefined = undefined;
    if (def.schema_id) {
      const fields = await this.schemas.getFields(def.schema_id);
      propertyTypes = fields ? Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, v.type])) : undefined;
    }
    this.applyFilters(qb, filters, propertyTypes, def.schema_id);
    this.applySort(qb, sort, propertyTypes, def.schema_id);
    qb.limit(ps).offset((page - 1) * ps);
    const items = await qb.getMany();
    return { items, page, pageSize: ps };
  }
}
