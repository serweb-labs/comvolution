import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { Product } from '../../../orm/entities/product.entity';
import { FilterContext, FilterHandler, Operation } from '../filter-handler';

@Injectable()
export class CustomFieldIntRangeHandler implements FilterHandler {
  id = 'custom-field-int-range';
  priority = 20;

  supports(key: string, op: Operation, value: any, ctx: FilterContext): boolean {
    if (ctx.coreKeys.has(key)) return false;
    if (ctx.propertyType !== 'int') return false;
    return op === 'ltgt' && value && typeof value === 'object';
  }

  apply(qb: SelectQueryBuilder<Product>, key: string, op: Operation, value: any, ctx: FilterContext): void {
    void op; void ctx;
    const alias = `cf_${key}`;
    const params: Record<string, any> = { [`k_${key}`]: key, [`ptype_${key}`]: 'int' };
    const lt = (value as any).lt;
    const gt = (value as any).gt;
    if (lt !== undefined) params[`lt_${key}`] = lt;
    if (gt !== undefined) params[`gt_${key}`] = gt;
    qb.andWhere(`
      EXISTS (
        SELECT 1 FROM product_properties ${alias}
        WHERE ${alias}.product_id = p.id
          AND ${alias}.property_key = :k_${key}
          AND ${alias}.property_type = :ptype_${key}
          ${lt !== undefined ? `AND ${alias}.value_int < :lt_${key}` : ''}
          ${gt !== undefined ? `AND ${alias}.value_int > :gt_${key}` : ''}
      )
    `, params);
  }
}
