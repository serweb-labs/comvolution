import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { Product } from '../../../orm/entities/product.entity';
import { SortContext, SortDir, SortHandler } from '../sort-handler';

@Injectable()
export class CoreSortHandler implements SortHandler {
  id = 'core-sort';
  priority = 100;

  supports(key: string, dir: SortDir, ctx: SortContext): boolean {
    void dir;
    return ctx.coreKeys.has(key);
  }

  apply(qb: SelectQueryBuilder<Product>, key: string, dir: SortDir, ctx: SortContext): void {
    void ctx;
    qb.addOrderBy(`p.${key}`, dir.toUpperCase() as 'ASC' | 'DESC', 'NULLS LAST');
  }
}
