import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { Product } from '../../../orm/entities/product.entity';
import { FilterContext, FilterHandler, Operation } from '../filter-handler';

@Injectable()
export class CustomFieldStringEqualityHandler implements FilterHandler {
  id = 'custom-field-string-eq-in';
  priority = 20;

  supports(key: string, op: Operation, value: any, ctx: FilterContext): boolean {
    if (ctx.coreKeys.has(key)) return false;
    if (ctx.propertyType !== 'string') return false;
    if (op === 'in' && Array.isArray(value)) return true;
    if (op === 'eq' && typeof value === 'string') return true;
    return false;
  }

  apply(qb: SelectQueryBuilder<Product>, key: string, op: Operation, value: any, ctx: FilterContext): void {
    void ctx;
    const alias = `cf_${key}`;
    if (op === 'in') {
      qb.andWhere(`
        EXISTS (
          SELECT 1 FROM product_properties ${alias}
          WHERE ${alias}.product_id = p.id
            AND ${alias}.property_key = :k_${key}
            AND ${alias}.property_type = 'string'
            AND ${alias}.value_string IN (:...v_${key})
        )
      `, { [`k_${key}`]: key, [`v_${key}`]: value });
    } else {
      qb.andWhere(`
        EXISTS (
          SELECT 1 FROM product_properties ${alias}
          WHERE ${alias}.product_id = p.id
            AND ${alias}.property_key = :k_${key}
            AND ${alias}.property_type = 'string'
            AND ${alias}.value_string = :v_${key}
        )
      `, { [`k_${key}`]: key, [`v_${key}`]: value });
    }
  }
}
