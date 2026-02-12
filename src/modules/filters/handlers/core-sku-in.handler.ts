import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { Product } from '../../../orm/entities/product.entity';
import { FilterContext, FilterHandler, Operation } from '../filter-handler';

@Injectable()
export class CoreSkuInHandler implements FilterHandler {
  id = 'core-sku-in';
  priority = 100;

  supports(key: string, op: Operation, value: any, ctx: FilterContext): boolean {
    void ctx;
    return key === 'sku_in' && op === 'in' && Array.isArray(value);
  }

  apply(qb: SelectQueryBuilder<Product>, key: string, op: Operation, value: any, ctx: FilterContext): void {
    void key; void op; void ctx;
    qb.andWhere('p.sku IN (:...skuIn)', { skuIn: value });
  }
}
