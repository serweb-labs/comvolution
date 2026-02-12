import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { Product } from '../../../orm/entities/product.entity';
import { FilterContext, FilterHandler, Operation } from '../filter-handler';

@Injectable()
export class CustomFieldDecimalEqualityHandler implements FilterHandler {
  id = 'custom-field-decimal-eq';
  priority = 20;

  supports(key: string, op: Operation, value: any, ctx: FilterContext): boolean {
    if (ctx.coreKeys.has(key)) return false;
    if (ctx.propertyType !== 'decimal') return false;
    return op === 'eq' && typeof value === 'number';
  }

  apply(qb: SelectQueryBuilder<Product>, key: string, op: Operation, value: any, ctx: FilterContext): void {
    void op; void ctx;
    const alias = `cf_${key}`;
    qb.andWhere(`
      EXISTS (
        SELECT 1 FROM product_properties ${alias}
        WHERE ${alias}.product_id = p.id
          AND ${alias}.property_key = :k_${key}
          AND ${alias}.property_type = 'decimal'
          AND ${alias}.value_decimal = :v_${key}
      )
    `, { [`k_${key}`]: key, [`v_${key}`]: value });
  }
}
