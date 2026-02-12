import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { Product } from '../../orm/entities/product.entity';
import { SortContext, SortDir, SortHandler, PropertyType } from './sort-handler';

@Injectable()
export class SortResolverService {
  constructor(private readonly handlers: SortHandler[]) {}

  applyAll(
    qb: SelectQueryBuilder<Product>,
    sort: Record<string, SortDir>,
    ctxBase: Omit<SortContext, 'propertyType'> & { propertyTypes?: Record<string, PropertyType> },
  ) {
    const coreKeys = ctxBase.coreKeys ?? new Set(['price', 'status', 'sku', 'stock']);
    for (const [key, dir] of Object.entries(sort ?? {})) {
      const propertyType = ctxBase.propertyTypes?.[key];
      const ctx: SortContext = { coreKeys, propertyType, schemaId: ctxBase.schemaId };
      const candidates = this.handlers.filter((h) => h.supports(key, dir, ctx));
      if (candidates.length === 0) {
        throw new (require('@nestjs/common').BadRequestException)(`Unsupported sort for key "${key}"`);
      }
      const handler = candidates.sort((a, b) => b.priority - a.priority)[0];
      handler.apply(qb, key, dir, ctx);
    }
  }
}
