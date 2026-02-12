import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { Product } from '../../../orm/entities/product.entity';
import { FilterContext, FilterHandler, Operation } from '../filter-handler';

@Injectable()
export class CoreStatusEqHandler implements FilterHandler {
  id = 'core-status-eq';
  priority = 100;

  supports(key: string, op: Operation, value: any, ctx: FilterContext): boolean {
    void ctx;
    return key === 'status' && op === 'eq' && typeof value === 'string';
  }

  apply(qb: SelectQueryBuilder<Product>, key: string, op: Operation, value: any, ctx: FilterContext): void {
    void key; void op; void ctx;
    qb.andWhere('p.status = :status', { status: value });
  }
}
