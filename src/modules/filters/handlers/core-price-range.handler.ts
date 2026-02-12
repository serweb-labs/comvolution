import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { Product } from '../../../orm/entities/product.entity';
import { FilterContext, FilterHandler, Operation } from '../filter-handler';

@Injectable()
export class CorePriceRangeHandler implements FilterHandler {
  id = 'core-price-range';
  priority = 100;

  supports(key: string, op: Operation, value: any, ctx: FilterContext): boolean {
    void value; void ctx;
    return key === 'price' && op === 'ltgt';
  }

  apply(qb: SelectQueryBuilder<Product>, key: string, op: Operation, value: any, ctx: FilterContext): void {
    void key; void op; void ctx;
    if (value.lt !== undefined) {
      qb.andWhere('p.price < :priceLt', { priceLt: value.lt });
    }
    if (value.gt !== undefined) {
      qb.andWhere('p.price > :priceGt', { priceGt: value.gt });
    }
  }
}
