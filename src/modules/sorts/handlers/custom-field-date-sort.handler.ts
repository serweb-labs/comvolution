import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { Product } from '../../../orm/entities/product.entity';
import { SortContext, SortDir, SortHandler } from '../sort-handler';

@Injectable()
export class CustomFieldDateSortHandler implements SortHandler {
  id = 'custom-field-date-sort';
  priority = 20;

  supports(key: string, dir: SortDir, ctx: SortContext): boolean {
    void dir;
    return !ctx.coreKeys.has(key) && ctx.propertyType === 'date';
  }

  apply(qb: SelectQueryBuilder<Product>, key: string, dir: SortDir, ctx: SortContext): void {
    void ctx;
    const alias = `cf_${key}`;
    qb.leftJoin(
      'product_properties',
      alias,
      `${alias}.product_id = p.id AND ${alias}.property_key = :sort_${key} AND ${alias}.property_type = 'date'`,
      { [`sort_${key}`]: key },
    );
    qb.addOrderBy(`${alias}.value_date`, dir.toUpperCase() as 'ASC' | 'DESC', 'NULLS LAST');
  }
}
